#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const WRITE = process.argv.includes('--write');
const BASELINE_COMMIT = 'fb63103778831688b89bf5e4b08dbe1882c2f354';
const SNAPSHOT_DIR = path.join(ROOT, 'tests', 'snapshots');
const FIXTURE_DIR = path.join(ROOT, 'tests', 'fixtures');
const CARD_DATA_BASELINE_FIXTURE = path.join(FIXTURE_DIR, 'card-data-v6.79.0.json');
const CARD_DATA_REFRESH_FIXTURE = path.join(FIXTURE_DIR, 'card-data-phase1b-20260723.json');
const SOURCE_REGISTRY_PATH = path.join(ROOT, 'data', 'source-registry.js');
const CARDS_OFFICIAL_PATH = path.join(ROOT, 'data', 'cards-official.js');
const CARD_CHANNELS_PATH = path.join(ROOT, 'data', 'card-channels.js');

const FILES = {
  optimizer: path.join(FIXTURE_DIR, 'optimizer-v6.79.0.json'),
  product: path.join(SNAPSHOT_DIR, 'product-surface-v6.79.0.json'),
  generated: path.join(SNAPSHOT_DIR, 'generated-files-v6.79.0.json'),
  dom: path.join(SNAPSHOT_DIR, 'dom-v6.79.0.json'),
  storage: path.join(SNAPSHOT_DIR, 'localstorage-v6.79.0.json')
};

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function stableText(value) {
  return JSON.stringify(stable(value), null, 2) + '\n';
}

function roundNumber(value) {
  if (!Number.isFinite(value)) return value;
  return Number(value.toFixed(6));
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeValue(item)]));
  }
  return typeof value === 'number' ? roundNumber(value) : value;
}

function walk(rel) {
  const absolute = path.join(ROOT, rel);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [rel.replaceAll(path.sep, '/')];
  const output = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(rel, entry.name);
    if (entry.isDirectory()) output.push(...walk(child));
    else if (entry.isFile()) output.push(child.replaceAll(path.sep, '/'));
  }
  return output.sort();
}

function fileRecords(paths) {
  const files = paths.flatMap(walk).sort();
  return files.map((file) => {
    const data = read(file);
    return { file, bytes: data.length, sha256: sha256(data) };
  });
}

function recordsHash(records) {
  return sha256(stableText(records));
}

function loadCore() {
  const html = read('index.html').toString('utf8');
  const match = html.match(/<script id="bm-core">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('找不到 <script id="bm-core">。');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'acremiles-core-'));
  const coreFile = path.join(tempDir, 'bm-core.cjs');
  try {
    fs.writeFileSync(coreFile,
      `var AcreMilesCardsOfficial = require(${JSON.stringify(CARDS_OFFICIAL_PATH)});\n` +
      `var AcreMilesCardChannels = require(${JSON.stringify(CARD_CHANNELS_PATH)});\n` +
      match[1]
    );
    delete require.cache[coreFile];
    return require(coreFile);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function checkCardDataMigration() {
  if (!fs.existsSync(CARD_DATA_BASELINE_FIXTURE)) throw new Error('缺少 card-data-v6.79.0 migration fixture。');
  if (!fs.existsSync(CARD_DATA_REFRESH_FIXTURE)) throw new Error('缺少 card-data-phase1b-20260723 refresh fixture。');
  const baseline = JSON.parse(fs.readFileSync(CARD_DATA_BASELINE_FIXTURE, 'utf8'));
  const refresh = JSON.parse(fs.readFileSync(CARD_DATA_REFRESH_FIXTURE, 'utf8'));
  const sourceRegistry = require(SOURCE_REGISTRY_PATH);
  const cardsOfficial = require(CARDS_OFFICIAL_PATH);
  const cardChannels = require(CARD_CHANNELS_PATH);
  if (sourceRegistry.schemaVersion !== 2 || cardsOfficial.schemaVersion !== 1 || cardChannels.schemaVersion !== 3) {
    throw new Error('Phase 1 data source schema version 未鎖定。');
  }
  const BM = loadCore();
  const legacyCards = BM.DEFAULT_CARDS.map((card) => {
    const copy = JSON.parse(JSON.stringify(card));
    ['slug', 'image', 'status', 'sourceRef'].forEach((key) => delete copy[key]);
    return copy;
  });
  if (!Array.isArray(baseline.cards) || baseline.cards.length !== 9 || !baseline.channelOffers) {
    throw new Error('Stage A 搬遷前 card fixture 已損壞。');
  }
  if (sha256(stableText(legacyCards)) !== refresh.cardsSha256) {
    throw new Error('Phase 1B official card data 同已審閱 refresh fixture 有 drift。');
  }
  if (sha256(stableText(cardChannels.getOffers())) !== refresh.channelOffersSha256) {
    throw new Error('Phase 1B channel data 同已審閱 refresh fixture 有 drift。');
  }
  const cards = cardsOfficial.getCards();
  const ids = cards.map((card) => card.id);
  const slugs = cards.map((card) => card.slug);
  if (cards.length !== 9 || new Set(ids).size !== cards.length || new Set(slugs).size !== cards.length) {
    throw new Error('獨立信用卡資料嘅 id／slug 唔完整或重複。');
  }
  for (const card of cards) {
    const source = sourceRegistry.CARD_SOURCES[card.sourceRef];
    if (!source || !card.image || !card.status) throw new Error(`卡資料生成 metadata／source 缺漏：${card.id}`);
    const legacySourceDocs = (source.sourceDocs || []).map((doc) => ({label: doc.label, url: doc.url}));
    if (card.url !== source.url || card.sourceVerifiedAt !== source.sourceVerifiedAt ||
        card.sourceStatus !== source.sourceStatus || stableText(card.sourceDocs) !== stableText(legacySourceDocs)) {
      throw new Error(`卡資料同 official source registry 不一致：${card.id}`);
    }
    if (source.sourceType !== 'bank-official' ||
        !(source.sourceDocs || []).every((doc) => /^official-/.test(doc.sourceType || ''))) {
      throw new Error(`官方來源類型缺漏：${card.id}`);
    }
    if (stableText(card.officialOffers || []) !== stableText((sourceRegistry.OFFICIAL_OFFERS || {})[card.id] || [])) {
      throw new Error(`卡資料同 official offer registry 不一致：${card.id}`);
    }
  }
  const dbs = cards.find((card) => card.id === 'dbs-black');
  if (!dbs || dbs.welcome.deadline !== '2026-10-05' || dbs.welcome.engineEligible !== false ||
      !Array.isArray(dbs.welcome.history) || !dbs.welcome.history.some((offer) => offer.status === 'historical')) {
    throw new Error('DBS Q3／Q2 history／Engine conflict gate 未完整保存。');
  }
  const everyMile = cards.find((card) => card.id === 'hsbc-everymile');
  if (!everyMile || everyMile.welcome.deadline !== '2026-07-31' || everyMile.welcome.modelStatus !== 'partial-components') {
    throw new Error('HSBC EveryMile base／flash 拆分狀態缺漏。');
  }
  const allChannelRecords = Object.values(cardChannels.getOffers()).flat();
  for (const offer of allChannelRecords) {
    if (!offer.id || !offer.sourceUrl || !offer.sourceType || !offer.verifiedAt || !offer.status || offer.expiry !== offer.validUntil) {
      throw new Error(`渠道資料 schema／日期缺漏：${offer.id || offer.platform || 'unknown'}`);
    }
    if (offer.active === true && (offer.verified !== true || !offer.validUntil || !/^active/.test(offer.status))) {
      throw new Error(`渠道現行狀態未完整核實：${offer.id}`);
    }
  }
  const mrMiles = allChannelRecords.filter((offer) => offer.platform === '里先生' && offer.active && offer.fixedBonus && offer.fixedBonus.unit === 'MM Credit');
  if (mrMiles.length !== 4 || mrMiles.some((offer) => offer.fixedBonus.maxAmount !== 88 ||
      Object.prototype.hasOwnProperty.call(offer.fixedBonus, 'amount') || offer.fixedBonus.components.length !== 2)) {
    throw new Error('里先生 88 MM Credit 必須保持「有條件最高值」結構。');
  }
  const scMoneySmart = allChannelRecords.find((offer) => offer.id === 'sc-cathay-moneysmart-2026-07');
  if (!scMoneySmart || !scMoneySmart.fixedBonus.options.some((option) => option.claimedValueHKD === 3980) ||
      scMoneySmart.fixedBonus.options.filter((option) => option.faceValueHKD === 900).length !== 3 ||
      scMoneySmart.randomBonus.validUntil !== '2026-07-23' || scMoneySmart.randomBonus.approvalDeadline !== '2026-08-13' ||
      !cardChannels.isPeriodCurrent(scMoneySmart.randomBonus, new Date('2026-07-23T15:59:00Z')) ||
      cardChannels.isPeriodCurrent(scMoneySmart.randomBonus, new Date('2026-07-23T16:01:00Z')) ||
      !cardChannels.isPeriodExpired(scMoneySmart.randomBonus, new Date('2026-07-23T16:01:00Z'))) {
    throw new Error('MoneySmart 渣打禮品同盲盒期限再次混淆。');
  }
  const hsbcClaims = allChannelRecords.filter((offer) => /^hsbc-everymile-/.test(offer.id) && offer.issuerOfferClaim);
  if (hsbcClaims.length !== 3 || hsbcClaims.some((offer) =>
      !offer.issuerOfferClaim.components.some((component) => component.type === 'july-flash' &&
        component.requiresMobilePayment === true && !component.requiresMobileOrQrPayment))) {
    throw new Error('EveryMile Flash 必須保持 mobile-only component。');
  }
  const dbsChannel = allChannelRecords.find((offer) => offer.id === 'dbs-black-moneyhero-cardplus-2026-q3');
  if (!dbsChannel || dbsChannel.fixedBonus !== null || !dbsChannel.issuerOfferClaim ||
      dbsChannel.issuerOfferClaim.customerType !== 'existing' || dbsChannel.issuerOfferClaim.singleRetailSpendHKD !== 200) {
    throw new Error('DBS HK$50 必須分類為 issuer existing-customer welcome。');
  }
  const aeMoneyHero = allChannelRecords.find((offer) => offer.id === 'amex-platinum-moneyhero-2026-07');
  if (!aeMoneyHero || !cardChannels.isOfferCurrent(aeMoneyHero, new Date('2026-07-29T09:59:00Z')) ||
      cardChannels.isOfferCurrent(aeMoneyHero, new Date('2026-07-29T10:01:00Z'))) {
    throw new Error('MoneyHero AE Platinum 18:00 HKT 下架邊界失效。');
  }
  const hsbcOverseas = (sourceRegistry.OFFICIAL_OFFERS['hsbc-everymile'] || []).find((offer) => offer.id === 'hsbc-everymile-overseas-2026-h2');
  const dbsOverseas = (sourceRegistry.OFFICIAL_OFFERS['dbs-black'] || []).find((offer) => offer.id === 'dbs-black-overseas-2026');
  if (!hsbcOverseas || hsbcOverseas.maxExtraRewardCashTotalHKD !== 450 || hsbcOverseas.engineStatus !== 'excluded-conditional-rate' ||
      !dbsOverseas || dbsOverseas.maxExtraDbsDollarMonthly !== 240 || dbsOverseas.maxExtraDbsDollarTotal !== 2880 ||
      dbsOverseas.engineStatus !== 'excluded-conditional-rate') {
    throw new Error('HSBC／DBS 海外 HK$2/里條件式推廣來源鎖失效。');
  }
  const explorer = cards.find((card) => card.id === 'amex-explorer');
  if (!explorer || !/HK\$15,000/.test(explorer.welcome.prereq || '') || explorer.welcome.modelStatus !== 'legacy-model-conflict') {
    throw new Error('AE Explorer 26k 本地 HK$15k＋登記條件／legacy conflict 缺漏。');
  }
  console.log('PASS data');
}

function normalizeOptimizeResult(result) {
  return normalizeValue({
    amount: result.amount,
    months: result.months,
    capSpan: result.capSpan,
    spendPattern: result.spendPattern,
    family: result.family,
    totalMiles: result.total,
    welcomeMiles: result.welcomeTotal,
    costPerMile: result.costPerMile,
    firstYearFees: result.newFees,
    renewalFees: result.renewalFees,
    unverified: result.unverified,
    excludedByIncome: result.excludedByIncome,
    welcomeCapture: result.welcomeCapture,
    spendSum: result.spendSum,
    bankNew: result.bankNew,
    warnings: result.warnings,
    butlerNotes: result.butlerNotes,
    rows: result.rows.map((row) => ({
      baseId: row.card && (row.card._baseId || row.card.id),
      cardId: row.card && row.card.id,
      person: row.card && row.card._person,
      isNew: row.isNew,
      bulkOnly: row.bulkOnly,
      applyMonth: row.applyMonth,
      deadlineMonth: row.deadlineMonth,
      spend: row.spend,
      baseMiles: row.baseMiles,
      welcomeMiles: row.welcomeMiles,
      totalMiles: row.baseMiles + row.welcomeMiles,
      bankPenalty: row.bankPenalty,
      altOffer: row.altOffer,
      tiersTotal: row.tiersTotal,
      tiersTaken: row.tiersTaken,
      welcomeTargetSpend: row.welcomeTargetSpend,
      welcomePotential: row.welcomePotential,
      nextTier: row.nextTier
    }))
  });
}

function optimizerSnapshot() {
  const BM = loadCore();
  const base = {
    income: 1000000,
    months: 6,
    goal: 'am',
    spendPattern: 'spread',
    owned: [],
    family: false,
    income2: 1000000,
    owned2: [],
    maxNewCards: 6,
    excludedCards: [],
    allowHighFee: false
  };
  const amounts = [5000, 8000, 16999, 30000, 100000, 300000, 1000000];
  const cases = [];
  for (const amount of amounts) {
    cases.push({ id: `single-${amount}`, input: { ...base, amount } });
    cases.push({ id: `family-${amount}`, input: { ...base, amount, family: true } });
  }
  cases.push(
    { id: 'owned-card-30000', input: { ...base, amount: 30000, owned: ['citi-pm'] } },
    { id: 'excluded-card-30000', input: { ...base, amount: 30000, excludedCards: ['citi-pm'] } },
    { id: 'annual-fee-off-300000', input: { ...base, amount: 300000, allowHighFee: false } },
    { id: 'annual-fee-on-300000', input: { ...base, amount: 300000, allowHighFee: true } },
    { id: 'lump-spend-100000', input: { ...base, amount: 100000, spendPattern: 'lump' } },
    { id: 'tiered-sc-cathay-110000', cardIds: ['sc-cathay'], input: { ...base, amount: 110000 } },
    { id: 'threshold-citi-pm-8000', cardIds: ['citi-pm'], input: { ...base, amount: 8000 } },
    { id: 'fee-purchase-citi-8000', cardIds: ['citi-prestige', 'citi-pm'], input: { ...base, amount: 8000 } }
  );

  return {
    schemaVersion: 1,
    baselineCommit: BASELINE_COMMIT,
    engineContract: 'BM.optimize(input)',
    fixtureCount: cases.length,
    cases: cases.map(({ id, input, cardIds }) => {
      const cards = cardIds ? BM.DEFAULT_CARDS.filter((card) => cardIds.includes(card.id)) : BM.DEFAULT_CARDS;
      if (cardIds && cards.length !== cardIds.length) throw new Error(`${id}: fixture card id missing.`);
      return {
        id,
        ...(cardIds ? { cardIds } : {}),
        input,
        output: normalizeOptimizeResult(BM.optimize(input, cards))
      };
    })
  };
}

function productSnapshot() {
  const groups = {
    index: fileRecords(['index.html']),
    serviceWorker: fileRecords(['sw.js']),
    manifest: fileRecords(['manifest.json']),
    data: fileRecords(['data']),
    cards: fileRecords(['cards']),
    share: fileRecords(['share']),
    images: fileRecords(['img'])
  };
  return {
    schemaVersion: 1,
    baselineCommit: BASELINE_COMMIT,
    scope: ['index.html', 'sw.js', 'manifest.json', 'data/**', 'cards/**', 'share/**', 'img/**'],
    groups: Object.fromEntries(Object.entries(groups).map(([name, records]) => [name, {
      count: records.length,
      treeSha256: recordsHash(records),
      files: records
    }]))
  };
}

function parseAttributes(raw) {
  const attrs = {};
  const re = /([:@A-Za-z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(raw))) attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? true;
  return attrs;
}

function domSnapshot() {
  const html = read('index.html').toString('utf8');
  const elements = [];
  const tagRe = /<([A-Za-z][\w:-]*)([^<>]*\sid=(?:"[^"]+"|'[^']+')[^<>]*)>/g;
  let match;
  while ((match = tagRe.exec(html))) {
    const attrs = parseAttributes(match[2]);
    const line = html.slice(0, match.index).split('\n').length;
    elements.push(normalizeValue({
      id: attrs.id,
      tag: match[1].toLowerCase(),
      class: attrs.class || null,
      role: attrs.role || null,
      type: attrs.type || null,
      name: attrs.name || null,
      href: attrs.href || null,
      hidden: Object.prototype.hasOwnProperty.call(attrs, 'hidden'),
      ariaHidden: attrs['aria-hidden'] || null,
      ariaLabel: attrs['aria-label'] || null,
      dataTab: attrs['data-tab'] || null,
      line
    }));
  }

  const navMatch = html.match(/<nav class="tabs"[\s\S]*?<\/nav>/);
  const tabs = [];
  if (navMatch) {
    const tabRe = /<button([^>]*)data-tab="([^"]+)"([^>]*)>[\s\S]*?<span>([^<]+)<\/span>[\s\S]*?<\/button>/g;
    let tab;
    while ((tab = tabRe.exec(navMatch[0]))) {
      const attrs = parseAttributes(`${tab[1]} data-tab="${tab[2]}" ${tab[3]}`);
      tabs.push({ dataTab: tab[2], label: tab[4].trim(), ariaLabel: attrs['aria-label'] || null });
    }
  }

  const structural = html
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>')
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1</style>')
    .replace(/\s+/g, ' ')
    .trim();
  const criticalIds = [
    'welcome', 'dc-title', 'dc-ok', 'dc-min', 'heroAsk',
    'tab-opt', 'tab-redeem', 'tab-journey', 'tab-articles', 'tab-guides',
    'calcContinue', 'calcDetails', 'calcAdvanced',
    'plannerGateway', 'plannerBeginner', 'plannerAdvanced',
    'scenarioSection', 'scenarioStrip'
  ];

  return {
    schemaVersion: 1,
    baselineCommit: BASELINE_COMMIT,
    indexSha256: sha256(Buffer.from(html)),
    structuralDomSha256: sha256(Buffer.from(structural)),
    idCount: elements.length,
    duplicateIds: [...new Set(elements.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index))].sort(),
    bottomNavigation: tabs,
    criticalElements: criticalIds.map((id) => elements.find((item) => item.id === id) || { id, missing: true }),
    elements
  };
}

function storageSnapshot() {
  const html = read('index.html').toString('utf8');
  const referenced = [...html.matchAll(/['"](bm_[a-z0-9_]+)['"]/g)].map((match) => match[1]);
  const keys = [...new Set(referenced)].sort();
  const resetMatch = html.match(/\b(?:var|let|const)\s+ACREMILES_STORAGE_KEYS\s*=\s*\[([\s\S]*?)\]\s*;/);
  const resetKeys = resetMatch
    ? [...new Set([...resetMatch[1].matchAll(/['"](bm_[a-z0-9_]+)['"]/g)].map((match) => match[1]))].sort()
    : [];
  if (!resetKeys.length) {
    throw new Error('localStorage reset key 清單為空，或未能讀取 ACREMILES_STORAGE_KEYS（var／let／const）。');
  }
  const missingResetKeys = keys.filter((key) => !resetKeys.includes(key));
  if (missingResetKeys.length) {
    throw new Error(`localStorage reset 未涵蓋實際引用嘅 key：${missingResetKeys.join(', ')}`);
  }
  return {
    schemaVersion: 1,
    baselineCommit: BASELINE_COMMIT,
    keyCount: keys.length,
    keys,
    resetKeys,
    referenceCounts: Object.fromEntries(keys.map((key) => [key, referenced.filter((item) => item === key).length])),
    schemas: {
      bm_consent: { analytics: 'boolean', ts: 'ISO datetime string' },
      bm_input: {
        amount: 'number', income: 'number', months: 'number', goal: 'string', spendPattern: 'lump|spread',
        owned: 'string[]', family: 'boolean', income2: 'number', owned2: 'string[]', maxNewCards: 'number',
        excludedCards: 'string[]', preferProgram: 'string'
      },
      bm_daily: { owned: 'string[]', owned2: 'string[]', family: 'boolean', spend: 'Record<string, number>' },
      bm_ow: { cabin: 'string', segs: 'Array<{from,to,carrier,stay}>' },
      bm_saved_plans: 'Array<{id,name,ts,amount,miles,snap,pinned?}>',
      bm_saved_redeem: 'Array<{id,name,ts,cabin,route,segs,pinned?}>',
      bm_sa: { dest: 'string', trip: 'string', region: 'string' },
      bm_favs: 'Record<cards|offers|guides, Record<id,{n,ts}>>',
      bm_sub: { email: 'string', ts: 'ISO datetime string', sent: 'boolean', queued: 'boolean' },
      scalars: ['bm_card_overrides', 'bm_esub', 'bm_ok', 'bm_rsub', 'bm_theme', 'bm_welcome_ts', 'bm_zoom']
    }
  };
}

function copyPath(sourceRel, destinationRoot) {
  const source = path.join(ROOT, sourceRel);
  const destination = path.join(destinationRoot, sourceRel);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function generatedSnapshot() {
  const before = fileRecords(['cards', 'share']);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'acremiles-generated-'));
  try {
    for (const rel of ['index.html', 'share-meta.js', 'data', 'img', 'cards', 'share', 'scripts']) copyPath(rel, temp);
    const cardOutput = execFileSync(process.execPath, ['scripts/generate-card-pages.js'], { cwd: temp, encoding: 'utf8' }).trim();
    const shareOutput = execFileSync(process.execPath, ['scripts/generate-share-pages.js'], { cwd: temp, encoding: 'utf8' }).trim();
    const after = ['cards', 'share'].flatMap((rel) => {
      const base = path.join(temp, rel);
      const visit = (absolute) => fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
        const child = path.join(absolute, entry.name);
        if (entry.isDirectory()) return visit(child);
        const relative = path.relative(temp, child).replaceAll(path.sep, '/');
        const data = fs.readFileSync(child);
        return [{ file: relative, bytes: data.length, sha256: sha256(data) }];
      });
      return visit(base);
    }).sort((a, b) => a.file.localeCompare(b.file));
    return {
      schemaVersion: 1,
      baselineCommit: BASELINE_COMMIT,
      commands: ['node scripts/generate-card-pages.js', 'node scripts/generate-share-pages.js'],
      commandOutput: [cardOutput, shareOutput],
      before: { count: before.length, treeSha256: recordsHash(before), files: before },
      after: { count: after.length, treeSha256: recordsHash(after), files: after },
      drift: stableText(before) === stableText(after) ? [] : ['Generated output differs from committed cards/** or share/**.']
    };
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function snapshots() {
  return {
    optimizer: optimizerSnapshot(),
    product: productSnapshot(),
    generated: generatedSnapshot(),
    dom: domSnapshot(),
    storage: storageSnapshot()
  };
}

function writeSnapshots(actual) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  fs.mkdirSync(FIXTURE_DIR, { recursive: true });
  for (const [name, file] of Object.entries(FILES)) fs.writeFileSync(file, stableText(actual[name]));
}

function checkSnapshots(actual) {
  let failed = false;
  for (const [name, file] of Object.entries(FILES)) {
    if (!fs.existsSync(file)) {
      console.error(`FAIL ${name}: 缺少 ${path.relative(ROOT, file)}`);
      failed = true;
      continue;
    }
    const expected = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (stableText(expected) !== stableText(actual[name])) {
      console.error(`FAIL ${name}: snapshot drift（如屬刻意改動，須經 Founder 核准後重建）。`);
      failed = true;
    } else {
      console.log(`PASS ${name}`);
    }
  }
  if (actual.generated.drift.length) {
    console.error(`FAIL generated: ${actual.generated.drift.join(' ')}`);
    failed = true;
  }
  if (failed) process.exitCode = 1;
}

try {
  checkCardDataMigration();
  const actual = snapshots();
  if (WRITE) {
    writeSnapshots(actual);
    console.log(`WROTE ${actual.optimizer.fixtureCount} optimizer fixtures and 4 regression snapshots.`);
  }
  checkSnapshots(actual);
  if (!process.exitCode) {
    console.log(`Regression lock matched AcreMiles v6.79.0 baseline ${BASELINE_COMMIT.slice(0, 12)}.`);
  }
} catch (error) {
  console.error(`FAIL regression-lock: ${error.stack || error.message}`);
  process.exitCode = 1;
}
