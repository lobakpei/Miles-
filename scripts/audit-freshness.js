#!/usr/bin/env node
/*
 * AcreMiles 信用卡資料新鮮度檢查
 *
 * 用法：
 *   node scripts/audit-freshness.js
 *   node scripts/audit-freshness.js --strict
 *   node scripts/audit-freshness.js --date 2026-07-20
 *
 * 一般模式：錯誤會令 exit code = 1；提醒只會列出。
 * --strict：提醒亦會令 exit code = 1，方便每週 GitHub Action 主動通知。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DAY_MS = 24 * 60 * 60 * 1000;

function usage() {
  console.log(`AcreMiles 信用卡資料新鮮度檢查

Options:
  --file PATH       用嚟定位同層 data/ 嘅主頁（預設 index.html）
  --date YYYY-MM-DD 模擬香港今日日期
  --warn-days N     優惠幾多日內到期要提醒（預設 14）
  --stale-days N    卡資料幾多日未核實要提醒（預設 35）
  --strict          有提醒都回傳失敗，適合排程通知
  --help            顯示說明`);
}

function parseArgs(argv) {
  const options = {
    file: 'index.html',
    date: null,
    warnDays: 14,
    staleDays: 35,
    strict: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    } else if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--file' || arg === '--date' || arg === '--warn-days' || arg === '--stale-days') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} 缺少數值`);
      i += 1;
      if (arg === '--file') options.file = value;
      if (arg === '--date') options.date = value;
      if (arg === '--warn-days') options.warnDays = Number(value);
      if (arg === '--stale-days') options.staleDays = Number(value);
    } else {
      throw new Error(`不明參數：${arg}`);
    }
  }

  ['warnDays', 'staleDays'].forEach(key => {
    if (!Number.isInteger(options[key]) || options[key] < 0) {
      throw new Error(`${key === 'warnDays' ? '--warn-days' : '--stale-days'} 必須係 0 或以上整數`);
    }
  });
  return options;
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function validIsoDateTime(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value || '') &&
    Number.isFinite(Date.parse(value));
}

function dayNumber(value) {
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

function hongKongToday() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function loadData(file) {
  const root = path.dirname(path.resolve(file));
  const cardsPath = path.join(root, 'data', 'cards-official.js');
  const channelsPath = path.join(root, 'data', 'card-channels.js');
  if (!fs.existsSync(cardsPath) || !fs.existsSync(channelsPath)) {
    throw new Error(`搵唔到獨立信用卡資料來源：${path.join(root, 'data')}`);
  }
  const cardsOfficial = require(cardsPath);
  const cardChannels = require(channelsPath);
  const cards = cardsOfficial.getCards();
  const offers = cardChannels.getOffers();
  if (!Array.isArray(cards) || !offers || typeof offers !== 'object') {
    throw new Error('獨立資料來源冇輸出 cards／channel offers');
  }
  return {
    DEFAULT_CARDS: cards,
    CHANNEL_OFFERS: offers,
    isChannelOfferCurrent: cardChannels.isOfferCurrent
  };
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const file = path.resolve(options.file);
  const today = options.date || hongKongToday();
  if (!validIsoDate(today)) throw new Error(`日期格式無效：${today}`);

  const BM = loadData(file);
  const todayDay = dayNumber(today);
  const now = options.date ? new Date(`${today}T12:00:00+08:00`) : new Date();
  const nowMs = now.getTime();
  const errors = [];
  const warnings = [];
  const notes = [];
  const error = message => errors.push(message);
  const warn = message => warnings.push(message);

  let activeOfferCount = 0;
  let activeOfficialOfferCount = 0;
  Object.entries(BM.CHANNEL_OFFERS).forEach(([cardId, offers]) => {
    if (!Array.isArray(offers)) {
      error(`渠道優惠 ${cardId} 唔係陣列`);
      return;
    }
    offers.forEach((offer, index) => {
      const label = `${cardId}／${offer.platform || `優惠 ${index + 1}`}`;

      if (!offer || !offer.sourceUrl || !offer.sourceType || !offer.verifiedAt || !offer.status) {
        error(`${label} 缺少 sourceUrl／sourceType／verifiedAt／status`);
        return;
      }
      if (!validIsoDate(offer.verifiedAt)) error(`${label} verifiedAt 格式無效：${offer.verifiedAt}`);
      if (offer.validFrom && !validIsoDate(offer.validFrom)) error(`${label} validFrom 格式無效：${offer.validFrom}`);
      if (offer.validUntil && !validIsoDate(offer.validUntil)) error(`${label} validUntil 格式無效：${offer.validUntil}`);
      if (offer.expiry !== offer.validUntil) error(`${label} legacy expiry 同 validUntil 不一致`);
      if (offer.startsAt && !validIsoDateTime(offer.startsAt)) error(`${label} startsAt 格式無效：${offer.startsAt}`);
      if (offer.expiresAt && !validIsoDateTime(offer.expiresAt)) error(`${label} expiresAt 格式無效：${offer.expiresAt}`);
      if (offer.startsAt && offer.validFrom && offer.startsAt.slice(0, 10) !== offer.validFrom) error(`${label} startsAt 同 validFrom 日期不一致`);
      if (offer.expiresAt && offer.validUntil && offer.expiresAt.slice(0, 10) !== offer.validUntil) error(`${label} expiresAt 同 validUntil 日期不一致`);

      if (offer.active !== true) {
        if (offer.status === 'unknown' || /unknown/.test(offer.verificationStatus || '')) {
          notes.push(`${label} 已披露 unknown，唔會當現行優惠展示`);
        }
        return;
      }
      activeOfferCount += 1;

      if (offer.verified !== true) error(`${label} 仍然 active，但未核實`);
      if (!/^active/.test(offer.status)) error(`${label} active flag 同 status 衝突：${offer.status}`);
      if (!offer.expiry) {
        error(`${label} 仍然 active，但缺少 expiry`);
        return;
      }
      if (!validIsoDate(offer.expiry)) {
        error(`${label} expiry 格式無效：${offer.expiry}`);
        return;
      }

      const daysLeft = dayNumber(offer.expiry) - todayDay;
      if (offer.expiresAt && nowMs > Date.parse(offer.expiresAt)) {
        error(`${label} 已於 ${offer.expiresAt} 到期，但仍然 active`);
      } else if (daysLeft < 0) {
        error(`${label} 已於 ${offer.expiry} 到期，但仍然 active`);
      } else if (daysLeft <= options.warnDays) {
        warn(`${label} 將於 ${offer.expiresAt || offer.expiry} 到期（尚餘 ${daysLeft} 日）`);
      }

      if (offer.randomBonus && offer.randomBonus.validUntil) {
        const random = offer.randomBonus;
        if (!validIsoDate(random.validUntil)) error(`${label} randomBonus validUntil 格式無效`);
        else if (/active/.test(random.status || '') && dayNumber(random.validUntil) < todayDay) {
          error(`${label} 嘅非保證抽獎已於 ${random.validUntil} 到期，但 nested status 仍標 active`);
        }
      }
    });
  });

  BM.DEFAULT_CARDS.forEach(card => {
    const label = `${card.id || 'unknown'}／${card.name || '未命名卡'}`;
    if (!card.sourceVerifiedAt) {
      error(`${label} 缺少 sourceVerifiedAt`);
    } else if (!validIsoDate(card.sourceVerifiedAt)) {
      error(`${label} sourceVerifiedAt 格式無效：${card.sourceVerifiedAt}`);
    } else {
      const age = todayDay - dayNumber(card.sourceVerifiedAt);
      if (age < 0) error(`${label} 核實日期 ${card.sourceVerifiedAt} 晚過香港今日`);
      else if (age > options.staleDays) warn(`${label} 已 ${age} 日未重新核實官方資料`);
    }

    const officialOffers = Array.isArray(card.officialOffers) ? card.officialOffers : [];
    officialOffers.forEach((offer, index) => {
      const offerLabel = `${label}／${offer.id || `official offer ${index + 1}`}`;
      if (!offer.sourceUrl || !offer.sourceType || !offer.verifiedAt || !offer.status) {
        error(`${offerLabel} 缺少 sourceUrl／sourceType／verifiedAt／status`);
        return;
      }
      if (!validIsoDate(offer.verifiedAt)) {
        error(`${offerLabel} verifiedAt 日期格式無效`);
        return;
      }
      if (offer.status === 'conflict') {
        if (offer.validFrom != null || offer.validUntil != null) {
          if (![offer.validFrom, offer.validUntil].every(validIsoDate)) error(`${offerLabel} conflict 日期必須完整 ISO 或同時為 null`);
        }
        notes.push(`${offerLabel} 已披露 official conflict／日期 unknown，唔會自行揀數`);
        return;
      }
      if (!offer.validFrom || !offer.validUntil || ![offer.validFrom, offer.validUntil].every(validIsoDate)) {
        error(`${offerLabel} 日期格式無效`);
        return;
      }
      if (offer.status === 'historical') return;
      if (!/^active/.test(offer.status)) {
        error(`${offerLabel} status 無法識別：${offer.status}`);
        return;
      }
      activeOfficialOfferCount += 1;
      const daysLeft = dayNumber(offer.validUntil) - todayDay;
      if (daysLeft < 0) error(`${offerLabel} 已於 ${offer.validUntil} 到期，但仍標 active`);
      else if (daysLeft <= options.warnDays) warn(`${offerLabel} 將於 ${offer.validUntil} 到期（尚餘 ${daysLeft} 日）`);
      if (/conflict/.test(offer.engineStatus || '')) {
        notes.push(`${offerLabel} 已披露 Engine model conflict；現行資料不會無解釋計入 Result`);
      }
    });
  });

  notes.unshift(
    `香港日期：${today}`,
    `已檢查 ${BM.DEFAULT_CARDS.length} 張卡、${activeOfficialOfferCount} 個 active 官方優惠、${activeOfferCount} 個 active 渠道優惠`,
    `提醒門檻：優惠 ${options.warnDays} 日內到期；卡資料超過 ${options.staleDays} 日未核實`
  );

  console.log('AcreMiles 每週信用卡資料檢查');
  notes.forEach(message => console.log(`ℹ ${message}`));
  warnings.forEach(message => console.log(`⚠ ${message}`));
  // 同一輸出 stream，避免 CI 將錯誤排到總結之後先顯示。
  errors.forEach(message => console.log(`❌ ${message}`));
  console.log(`\n結果：${errors.length} 個錯誤，${warnings.length} 個提醒`);

  if (errors.length || (options.strict && warnings.length)) process.exitCode = 1;
}

try {
  run();
} catch (err) {
  console.error(`❌ 檢查無法執行：${err.message}`);
  process.exitCode = 1;
}
