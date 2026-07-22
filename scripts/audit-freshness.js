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

const path = require('path');
const CARD_DATA = require(path.resolve(__dirname, '..', 'data'));

const DAY_MS = 24 * 60 * 60 * 1000;

function usage() {
  console.log(`AcreMiles 信用卡資料新鮮度檢查

Options:
  --date YYYY-MM-DD 模擬香港今日日期
  --warn-days N     優惠幾多日內到期要提醒（預設 14）
  --stale-days N    卡資料幾多日未核實要提醒（預設 35）
  --strict          有提醒都回傳失敗，適合排程通知
  --help            顯示說明`);
}

function parseArgs(argv) {
  const options = {
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
    } else if (arg === '--date' || arg === '--warn-days' || arg === '--stale-days') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} 缺少數值`);
      i += 1;
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

function run() {
  const options = parseArgs(process.argv.slice(2));
  const today = options.date || hongKongToday();
  if (!validIsoDate(today)) throw new Error(`日期格式無效：${today}`);

  const BM = CARD_DATA;
  if (!Array.isArray(BM.DEFAULT_CARDS) || !Array.isArray(BM.CHANNEL_RECORDS) || !BM.SOURCE_REGISTRY) {
    throw new Error('data/ 冇輸出 DEFAULT_CARDS／CHANNEL_RECORDS／SOURCE_REGISTRY');
  }
  const todayDay = dayNumber(today);
  const errors = [];
  const warnings = [];
  const notes = [];
  const error = message => errors.push(message);
  const warn = message => warnings.push(message);

  let activeOfferCount = 0;
  let unknownChannelCount = 0;
  BM.CHANNEL_RECORDS.forEach((offer, index) => {
      const cardId = offer.cardId || 'unknown';
      const label = `${cardId}／${offer.platform || offer.id || `優惠 ${index + 1}`}`;
      if (!offer.id || offer.scope !== 'channel') error(`${label} 缺少 channel provenance`);
      if (offer.validFrom && !validIsoDate(offer.validFrom)) error(`${label} validFrom 格式無效：${offer.validFrom}`);
      if (offer.validUntil && !validIsoDate(offer.validUntil)) error(`${label} validUntil 格式無效：${offer.validUntil}`);
      if (offer.verifiedAt && !validIsoDate(offer.verifiedAt)) error(`${label} verifiedAt 格式無效：${offer.verifiedAt}`);
      if (offer.status === 'unknown' || offer.status === 'conflict') {
        unknownChannelCount += 1;
        warn(`${label} 狀態係 ${offer.status}，Stage B 要重新核實${offer.validUntil ? `（舊記錄至 ${offer.validUntil}）` : ''}`);
        return;
      }
      if (offer.status !== 'active') return;
      activeOfferCount += 1;
      if (offer.verificationStatus !== 'verified') error(`${label} 仍然 active，但未核實`);
      if (!offer.sourceUrl) error(`${label} 仍然 active，但缺少平台 sourceUrl`);
      if (!offer.validUntil) {
        error(`${label} 仍然 active，但缺少 validUntil`);
        return;
      }
      const daysLeft = dayNumber(offer.validUntil) - todayDay;
      if (daysLeft < 0) {
        error(`${label} 已於 ${offer.validUntil} 到期，但仍然 active`);
      } else if (daysLeft <= options.warnDays) {
        warn(`${label} 將於 ${offer.validUntil} 到期（尚餘 ${daysLeft} 日）`);
      }
  });

  let unknownOfficialPromotionCount = 0;
  (BM.SOURCE_REGISTRY.promotions || []).forEach(record => {
    const label = `${(record.cardIds || []).join(',') || 'unknown'}／${record.id || '未命名官方推廣'}`;
    if (record.validFrom && !validIsoDate(record.validFrom)) error(`${label} validFrom 格式無效：${record.validFrom}`);
    if (record.validUntil && !validIsoDate(record.validUntil)) error(`${label} validUntil 格式無效：${record.validUntil}`);
    if (record.verifiedAt && !validIsoDate(record.verifiedAt)) error(`${label} verifiedAt 格式無效：${record.verifiedAt}`);
    if (record.status === 'unknown' || record.status === 'conflict') {
      unknownOfficialPromotionCount += 1;
      warn(`${label} 官方規則狀態係 ${record.status}，Stage B 要用銀行官方來源核實${record.validUntil ? `（舊記錄至 ${record.validUntil}）` : ''}`);
    } else if (record.status === 'active' && (!record.sourceUrl || !/^https:\/\//.test(record.sourceUrl))) {
      error(`${label} 仍然 active，但冇銀行官方 sourceUrl`);
    }
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

    const welcome = card.welcome || {};
    if (!welcome.expired && welcome.deadline) {
      if (!validIsoDate(welcome.deadline)) {
        error(`${label} welcome.deadline 格式無效：${welcome.deadline}`);
      } else {
        const daysLeft = dayNumber(welcome.deadline) - todayDay;
        if (daysLeft < 0) error(`${label} 官方迎新已於 ${welcome.deadline} 到期，但未標示 expired`);
        else if (daysLeft <= options.warnDays) warn(`${label} 官方迎新將於 ${welcome.deadline} 到期（尚餘 ${daysLeft} 日）`);
      }
    }
  });

  notes.push(`香港日期：${today}`);
  notes.push(`已檢查 ${BM.DEFAULT_CARDS.length} 張卡、${activeOfferCount} 個 active 渠道優惠、${unknownChannelCount} 個渠道 unknown、${unknownOfficialPromotionCount} 個官方推廣 unknown`);
  notes.push(`提醒門檻：優惠 ${options.warnDays} 日內到期；卡資料超過 ${options.staleDays} 日未核實`);

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
