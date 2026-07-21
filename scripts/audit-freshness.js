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
const vm = require('vm');

const DAY_MS = 24 * 60 * 60 * 1000;

function usage() {
  console.log(`AcreMiles 信用卡資料新鮮度檢查

Options:
  --file PATH       要檢查嘅主頁（預設 index.html）
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

function loadCore(file) {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/<script\b[^>]*\bid=["']bm-core["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) throw new Error(`搵唔到 <script id="bm-core">：${file}`);

  const sandbox = {module: {exports: {}}, exports: {}};
  vm.createContext(sandbox);
  new vm.Script(match[1], {filename: `${file}#bm-core`}).runInContext(sandbox, {timeout: 5000});
  const data = sandbox.module.exports;
  if (!data || !Array.isArray(data.DEFAULT_CARDS) || !data.CHANNEL_OFFERS) {
    throw new Error('bm-core 冇輸出 DEFAULT_CARDS／CHANNEL_OFFERS');
  }
  return data;
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const file = path.resolve(options.file);
  const today = options.date || hongKongToday();
  if (!validIsoDate(today)) throw new Error(`日期格式無效：${today}`);

  const BM = loadCore(file);
  const todayDay = dayNumber(today);
  const errors = [];
  const warnings = [];
  const notes = [];
  const error = message => errors.push(message);
  const warn = message => warnings.push(message);

  let activeOfferCount = 0;
  Object.entries(BM.CHANNEL_OFFERS).forEach(([cardId, offers]) => {
    if (!Array.isArray(offers)) {
      error(`渠道優惠 ${cardId} 唔係陣列`);
      return;
    }
    offers.forEach((offer, index) => {
      if (!offer || offer.active !== true) return;
      activeOfferCount += 1;
      const label = `${cardId}／${offer.platform || `優惠 ${index + 1}`}`;

      if (offer.verified !== true) error(`${label} 仍然 active，但未核實`);
      if (!offer.expiry) {
        error(`${label} 仍然 active，但缺少 expiry`);
        return;
      }
      if (!validIsoDate(offer.expiry)) {
        error(`${label} expiry 格式無效：${offer.expiry}`);
        return;
      }

      const daysLeft = dayNumber(offer.expiry) - todayDay;
      if (daysLeft < 0) {
        error(`${label} 已於 ${offer.expiry} 到期，但仍然 active`);
      } else if (daysLeft <= options.warnDays) {
        warn(`${label} 將於 ${offer.expiry} 到期（尚餘 ${daysLeft} 日）`);
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
  notes.push(`已檢查 ${BM.DEFAULT_CARDS.length} 張卡、${activeOfferCount} 個 active 渠道優惠`);
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
