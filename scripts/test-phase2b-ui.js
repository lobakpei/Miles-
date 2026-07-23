#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const OFFICIAL_PATH = path.join(ROOT, 'data', 'cards-official.js');
const CHANNEL_PATH = path.join(ROOT, 'data', 'card-channels.js');
const html = fs.readFileSync(INDEX_PATH, 'utf8');

let passed = 0;
const failures = [];

function check(condition, message, detail) {
  if (condition) {
    passed += 1;
    return;
  }
  failures.push(detail === undefined ? message : `${message}\n    ${detail}`);
}

function json(value) {
  return JSON.parse(JSON.stringify(value));
}

function same(actual, expected, message) {
  const actualText = JSON.stringify(json(actual));
  const expectedText = JSON.stringify(json(expected));
  check(actualText === expectedText, message, `expected ${expectedText}; received ${actualText}`);
}

function near(actual, expected, message, tolerance = 1e-9) {
  check(
    Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance,
    message,
    `expected ${expected}; received ${actual}`
  );
}

function extractBetween(source, startNeedle, endNeedle, label) {
  const start = source.indexOf(startNeedle);
  const end = start < 0 ? -1 : source.indexOf(endNeedle, start + startNeedle.length);
  if (start < 0 || end < 0) {
    failures.push(`Cannot extract ${label}.`);
    return '';
  }
  return source.slice(start, end);
}

function extractFunction(source, name, useLast = false) {
  const needle = `function ${name}(`;
  const start = useLast ? source.lastIndexOf(needle) : source.indexOf(needle);
  if (start < 0) {
    failures.push(`Cannot find function ${name}().`);
    return '';
  }
  const open = source.indexOf('{', start + needle.length);
  if (open < 0) {
    failures.push(`Cannot find opening brace for ${name}().`);
    return '';
  }

  let depth = 0;
  let mode = 'code';
  let quote = '';
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (mode === 'line-comment') {
      if (char === '\n') mode = 'code';
      continue;
    }
    if (mode === 'block-comment') {
      if (char === '*' && next === '/') {
        mode = 'code';
        i += 1;
      }
      continue;
    }
    if (mode === 'string') {
      if (char === '\\') {
        i += 1;
      } else if (char === quote) {
        mode = 'code';
      }
      continue;
    }
    if (char === '/' && next === '/') {
      mode = 'line-comment';
      i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      mode = 'block-comment';
      i += 1;
      continue;
    }
    if (char === '\'' || char === '"' || char === '`') {
      mode = 'string';
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  failures.push(`Cannot find closing brace for ${name}().`);
  return '';
}

function firstInputId(fragment) {
  const input = fragment.match(/<input\b[^>]*>/i);
  if (!input) return '';
  const id = input[0].match(/\bid="([^"]+)"/i);
  return id ? id[1] : '';
}

function walkFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function loadCore() {
  const match = html.match(/<script id="bm-core">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('Missing <script id="bm-core">.');
  const official = require(OFFICIAL_PATH);
  const channels = require(CHANNEL_PATH);
  const context = {
    AcreMilesCardsOfficial: official,
    AcreMilesCardChannels: channels,
    module: { exports: {} },
    exports: {}
  };
  vm.runInNewContext(match[1], context, { filename: 'index.html#bm-core' });
  return {
    BM: context.module.exports,
    official,
    channels
  };
}

function loadPhase2BDemos(BM) {
  const start = html.indexOf('var PHASE2B_HERO_SCENARIOS =');
  const end = start < 0 ? -1 : html.indexOf('\n  function phase2bScenario', start);
  if (start < 0 || end < 0) throw new Error('Missing Phase 2B demonstration definitions.');
  const context = { BM, cards: BM.DEFAULT_CARDS };
  vm.runInNewContext(
    `${html.slice(start, end)}
this.hero = PHASE2B_HERO_SCENARIOS;
this.additional = PHASE2B_SPEND_EXAMPLES;
this.demoInput = phase2bDemoInput;
this.demoResult = phase2bDemoResult;`,
    context,
    { filename: 'index.html#phase2b-demonstrations' }
  );
  return context;
}

function resultSummary(result) {
  return {
    total: result.total,
    rounded: Math.round(result.total),
    newCards: result.rows.filter((row) => row.isNew).length,
    newFees: result.newFees || 0,
    rows: result.rows.map((row) => ({
      id: row.card.id,
      spend: row.spend,
      welcome: row.welcomeMiles,
      base: row.baseMiles,
      isNew: row.isNew
    }))
  };
}

/* Build every retired phrase from fragments so this regression file cannot
   itself make the repository-wide literal search fail. */
const forbiddenHeaderPhrases = [
  ['由想', '去邊開始，', '我幫', '你計'].join(''),
  ['由想', '去邊開始'].join(''),
  ['我幫', '你計'].join(''),
  ['砌好', '行程，再反推', '要幾多里'].join(''),
  ['砌好', '行程'].join(''),
  ['再反推', '要幾多里'].join('')
];

check(
  !html.includes(['想去', '邊開始'].join('')),
  'Active Header and Homepage runtime must not contain the shorter travel-first phrase.'
);

const repositoryFiles = walkFiles(ROOT);
for (const [phraseIndex, phrase] of forbiddenHeaderPhrases.entries()) {
  const matches = repositoryFiles
    .filter((file) => fs.readFileSync(file).includes(Buffer.from(phrase)))
    .map((file) => path.relative(ROOT, file).replaceAll(path.sep, '/'))
    .sort();
  check(
    matches.length === 0,
    `Legacy Header phrase ${phraseIndex + 1} must have zero matches across the repository.`,
    matches.join(', ')
  );
}

const { BM, official, channels } = loadCore();
check(Array.isArray(BM.DEFAULT_CARDS) && BM.DEFAULT_CARDS.length > 0, 'bm-core must load official card records.');
check(BM.CHANNEL_OFFERS && typeof BM.CHANNEL_OFFERS === 'object', 'bm-core must load channel records separately.');
check(official.schemaVersion === 1, 'Official card data schema must remain version 1.');
check(channels.schemaVersion === 3, 'Channel data schema must remain version 3.');

/* Homepage order and collapsed final section. */
const home = extractBetween(html, '<section id="tab-journey">', '<section id="tab-articles"', 'Homepage');
const homeOrder = [
  'id="homeHero"',
  'id="moreSpendExamples"',
  'id="homeOffers"',
  'id="homeUserContent"',
  'id="homeAdvertisements"',
  'id="homeTodayHighlights"'
];
let previousHomeIndex = -1;
for (const marker of homeOrder) {
  const current = home.indexOf(marker);
  check(current >= 0, `Homepage must contain ${marker}.`);
  check(current > previousHomeIndex, `Homepage order must place ${marker} after the preceding required surface.`);
  previousHomeIndex = current;
}
check(
  /<details\b[^>]*\bid="homeTodayHighlights"[^>]*>/i.test(home) &&
    !/<details\b[^>]*\bid="homeTodayHighlights"[^>]*\bopen\b[^>]*>/i.test(home),
  '今日重點 must be a collapsed details element by default.'
);
check(!/\bid="(?:greeting|outcomeFeature)"/i.test(home), 'Homepage must not retain the old Greeting or duplicated outcome feature.');
check(!/Featured Guides/i.test(home), 'Homepage must not add a Featured Guides section.');
check(!/testimonial/i.test(home), 'Homepage Hero must not add fake testimonials.');

const demos = loadPhase2BDemos(BM);
const hero = json(demos.hero);
const additional = json(demos.additional);
const heroIds = hero.map((scenario) => scenario.id);
const additionalIds = additional.map((scenario) => scenario.id);

same(heroIds, ['iphone', 'car', 'wedding'], 'Hero must contain exactly iPhone, car and wedding in that order.');
same(
  additionalIds,
  ['renovation', 'furniture', 'appliances', 'travel-hotel', 'tuition', 'medical-dental', 'online-shopping'],
  'Additional demonstrations must contain the seven approved non-Hero scenarios in order.'
);
check(new Set(heroIds).size === 3, 'Hero scenario IDs must be unique.');
check(new Set(additionalIds).size === 7, 'Additional scenario IDs must be unique.');
check(
  additionalIds.every((id) => !heroIds.includes(id)),
  'Additional demonstrations must not duplicate any Hero scenario.'
);

const expectedScenarioMeta = {
  iphone: {
    title: 'iPhone 17・512GB',
    amountHKD: 8599,
    spendPattern: 'lump',
    exclusions: ['sc-cathay', 'amex-explorer', 'citi-pm'],
    sourceType: 'official-price',
    sourceURL: 'https://www.apple.com/hk-zh/shop/buy-iphone/iphone-17',
    paymentURL: 'https://www.apple.com/hk-zh/shop/help/payments'
  },
  car: {
    title: '買車',
    amountHKD: 100000,
    spendPattern: 'spread',
    exclusions: ['sc-cathay', 'amex-explorer'],
    sourceType: 'authored-demo'
  },
  wedding: {
    title: 'Wedding／結婚',
    amountHKD: 150000,
    spendPattern: 'spread',
    exclusions: ['sc-cathay', 'amex-explorer'],
    sourceType: 'authored-demo'
  },
  renovation: { amountHKD: 120000 },
  furniture: { amountHKD: 50000 },
  appliances: { amountHKD: 30000 },
  'travel-hotel': { amountHKD: 40000 },
  tuition: { amountHKD: 80000 },
  'medical-dental': { amountHKD: 60000 },
  'online-shopping': { amountHKD: 20000 }
};

const expectedOutputs = {
  iphone: {
    total: 21719.8,
    rounded: 21720,
    newCards: 1,
    newFees: 0,
    rows: [
      { id: 'hsbc-everymile', spend: 8599, welcome: 20000, base: 1719.8, isNew: true }
    ]
  },
  car: {
    total: 59625,
    rounded: 59625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 95000, welcome: 20000, base: 19000, isNew: true }
    ]
  },
  wedding: {
    total: 69625,
    rounded: 69625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 145000, welcome: 20000, base: 29000, isNew: true }
    ]
  },
  renovation: {
    total: 63625,
    rounded: 63625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 115000, welcome: 20000, base: 23000, isNew: true }
    ]
  },
  furniture: {
    total: 49625,
    rounded: 49625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 45000, welcome: 20000, base: 9000, isNew: true }
    ]
  },
  appliances: {
    total: 45625,
    rounded: 45625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 25000, welcome: 20000, base: 5000, isNew: true }
    ]
  },
  'travel-hotel': {
    total: 47625,
    rounded: 47625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 35000, welcome: 20000, base: 7000, isNew: true }
    ]
  },
  tuition: {
    total: 55625,
    rounded: 55625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 75000, welcome: 20000, base: 15000, isNew: true }
    ]
  },
  'medical-dental': {
    total: 51625,
    rounded: 51625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 55000, welcome: 20000, base: 11000, isNew: true }
    ]
  },
  'online-shopping': {
    total: 43625,
    rounded: 43625,
    newCards: 2,
    newFees: 0,
    rows: [
      { id: 'citi-pm', spend: 5000, welcome: 20000, base: 625, isNew: true },
      { id: 'hsbc-everymile', spend: 15000, welcome: 20000, base: 3000, isNew: true }
    ]
  }
};

const knownCardIds = new Set(BM.DEFAULT_CARDS.map((card) => card.id));
for (const scenario of hero.concat(additional)) {
  const meta = expectedScenarioMeta[scenario.id];
  check(Boolean(meta), `${scenario.id} must have locked test metadata.`);
  if (!meta) continue;

  for (const [key, expected] of Object.entries(meta)) {
    same(scenario[key], expected, `${scenario.id} ${key} must match the approved demonstration input.`);
  }
  check(Number.isInteger(scenario.amountHKD) && scenario.amountHKD > 0, `${scenario.id} must use an explicit positive HKD amount.`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(scenario.asOf), `${scenario.id} must expose a traceable as-of date.`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(scenario.verifiedUntil), `${scenario.id} must expose a verification deadline.`);
  check(
    scenario.exclusions.every((cardId) => knownCardIds.has(cardId)),
    `${scenario.id} exclusions must reference real cards.`
  );

  const input = json(demos.demoInput(scenario));
  const expectedInput = {
    amount: scenario.amountHKD,
    income: 300000,
    months: 6,
    goal: 'am',
    spendPattern: scenario.spendPattern,
    owned: [],
    family: false,
    income2: 0,
    owned2: [],
    maxNewCards: 2,
    excludedCards: scenario.exclusions,
    allowHighFee: false
  };
  same(input, expectedInput, `${scenario.id} must pass the approved safe input directly to the Engine.`);

  const viaUI = demos.demoResult(scenario);
  const direct = BM.optimize(input, BM.DEFAULT_CARDS);
  same(resultSummary(viaUI), resultSummary(direct), `${scenario.id} UI result must be the unmodified Engine result.`);
  same(resultSummary(viaUI), expectedOutputs[scenario.id], `${scenario.id} exact Engine output must remain locked.`);
  near(
    viaUI.rows.reduce((sum, row) => sum + row.spend, 0),
    scenario.amountHKD,
    `${scenario.id} Engine rows must conserve the full spending amount.`
  );
  check(!viaUI.unverified, `${scenario.id} must not contain unverified recommendation data.`);
  check(
    viaUI.rows.every((row) => row.card.verified && !row.card.pending && !scenario.exclusions.includes(row.card.id)),
    `${scenario.id} must use verified, eligible and non-excluded recommendation rows.`
  );
}

const heroRenderer = extractFunction(html, 'renderHomeHero');
const exampleRenderer = extractFunction(html, 'renderSpendScenarios');
check(
  heroRenderer.includes('data-hero-scenario=') && heroRenderer.includes('Math.round(res.total)'),
  'Hero slides must expose Engine-generated result metadata.'
);
check(
  exampleRenderer.includes('data-spend-example=') && exampleRenderer.includes('Math.round(res.total)'),
  'Additional examples must expose Engine-generated result metadata.'
);
check(
  heroRenderer.includes('data-hero-earn=') && heroRenderer.includes('>點做到？</button>'),
  'Every Hero slide must use the exact direct-to-Earn CTA.'
);
check(
  heroRenderer.includes('setInterval') &&
    heroRenderer.includes("track.onscroll = syncHero") &&
    heroRenderer.includes("$('heroPrev').onclick") &&
    heroRenderer.includes("$('heroNext').onclick") &&
    heroRenderer.includes("dots.onclick"),
  'Hero must support auto slideshow, swipe/scroll syncing, dots and desktop arrows.'
);
check(
  heroRenderer.includes('現行規則核實可行情境') &&
    !heroRenderer.includes('<img') &&
    !heroRenderer.includes('background-image'),
  'Hero must use the verified-demonstration label without article-thumbnail treatment.'
);
const horizontalScroller = extractFunction(html, 'bindHorizontalScroller');
check(
  horizontalScroller.includes('host.onwheel') &&
    horizontalScroller.includes('host.onpointerdown') &&
    horizontalScroller.includes('host.onpointermove'),
  'Additional examples must support desktop wheel and pointer dragging.'
);
check(!/\b(?:expectedMiles|marketingMiles|manualMiles)\b/.test(html), 'No demonstration may carry a hand-authored miles result.');

/* Direct completed Earn and amount-first/result-first structure. */
const tabOpt = extractBetween(html, '<section id="tab-opt"', '<section id="tab-redeem"', 'Earn tab');
same(firstInputId(tabOpt), 'amount', 'Spending amount must be the first editable Earn input.');
check(tabOpt.indexOf('id="amount"') < tabOpt.indexOf('id="calcDetails"'), 'Amount must precede optional refinements.');
check(
  tabOpt.indexOf('<!-- /calcDetails -->') < tabOpt.indexOf('id="results"'),
  'Completed result container must sit outside the optional refinements.'
);
check(!tabOpt.includes('id="calcContinue"'), 'Earn must not restore the old continue gate.');
check(tabOpt.includes('id="earnNewCardCount"'), 'Earn summary must expose the new-card count.');
check(tabOpt.includes('id="earnMilesTotal"'), 'Earn summary must expose the exact miles total.');
check(tabOpt.includes('id="allowAnnualFee"'), 'Earn refinements must expose the annual-fee checkbox.');

const scheduleEarn = extractFunction(html, 'scheduleEarnRecalc');
check(
  scheduleEarn.includes('parseAmount() > 0') && scheduleEarn.includes('runCalc(false)'),
  'Amount edits must automatically calculate a completed result.'
);
const directEarn = extractFunction(html, 'startSpendCalculator');
for (const required of [
  'phase2bScenario(ref)',
  'state.amount = a',
  "$('amount').value = BM.fmt(a)",
  "store.set('bm_input', state)",
  "b.click()",
  "runCalc(false)"
]) {
  check(directEarn.includes(required), `Hero CTA flow must include ${required}.`);
}
check(
  !/(?:data-open|openArticle|openPage|pg[A-Z]\d)/.test(directEarn),
  'Hero CTA flow must not open an article before Earn.'
);

const optInputFunction = extractFunction(html, 'optInput');
check(
  /allowHighFee\s*:\s*!!state\.allowAnnualFee/.test(optInputFunction),
  'Annual-fee checkbox state must pass through as Engine allowHighFee.'
);
check(
  /allowAnnualFeeEl\.addEventListener\('change'[\s\S]*?state\.allowAnnualFee\s*=\s*!!allowAnnualFeeEl\.checked[\s\S]*?runCalc\(false\)/.test(html),
  'Changing the annual-fee checkbox must persist and immediately recalculate.'
);

/* Miles-first General/RTW redemption. */
const tabRedeem = extractBetween(html, '<section id="tab-redeem"', '<section id="tab-journey"', 'Redeem tab');
same(firstInputId(tabRedeem), 'redeemMiles', 'Available miles must be the first editable Redeem input.');
const redeemModes = Array.from(
  tabRedeem.matchAll(/<button\b[^>]*data-redeem-mode="([^"]+)"[^>]*>([^<]+)<\/button>/g),
  (match) => ({ id: match[1], label: match[2].trim() })
);
same(
  redeemModes,
  [
    { id: 'general', label: '一般兌換' },
    { id: 'rtw', label: '環球票' }
  ],
  'Redeem first level must contain only General and RTW.'
);
check(tabRedeem.indexOf('id="generalRedeem"') < tabRedeem.indexOf('id="rtwRedeem"'), 'General redemption must precede RTW.');
const rtwStart = tabRedeem.indexOf('id="rtwRedeem"');
check(tabRedeem.indexOf('id="plannerBeginner"') > rtwStart, 'Beginner must exist only inside RTW.');
check(tabRedeem.indexOf('id="plannerAdvanced"') > rtwStart, 'Advanced must exist only inside RTW.');
check(tabRedeem.includes('單程／酒店</b>即將推出'), 'One-way and hotels must be marked coming soon.');
check(tabRedeem.includes('其他兌換</b>即將推出'), 'Other redemption types must be marked coming soon.');
check(tabRedeem.includes('冇可支持嘅一年平均票價'), 'Redeem must state the unsupported average-fare limitation.');

const renderRedeem = extractFunction(html, 'renderRedeem');
check(
  /r\.trip\s*===\s*'來回'/.test(renderRedeem),
  'General redemption must filter Engine data to return tickets.'
);
check(
  /generalRedeemState\.program\s*===\s*'avios'[\s\S]*?'asiaMiles'/.test(renderRedeem),
  'General redemption must support the existing Asia Miles and Avios fields.'
);
check(
  /x\.r\.route\.replace\(\/\^香港/.test(renderRedeem),
  'General results must derive human destination names for the first-level card.'
);
const setRedeemMode = extractFunction(html, 'setRedeemMode');
check(
  setRedeemMode.includes("mode === 'rtw' ? 'rtw' : 'general'") &&
    setRedeemMode.includes("$('generalRedeem').hidden") &&
    setRedeemMode.includes("$('rtwRedeem').hidden"),
  'Redeem mode switching must be gated to General or RTW.'
);
check(
  html.includes("$('carryMilesToRedeem').addEventListener('click'") &&
    html.includes("$('fillFromOpt').addEventListener('click'"),
  'Miles must be carryable from Earn into Redeem.'
);

/* Inspect only the active definition, not the retained legacy function. */
const activeCardDetail = extractFunction(html, 'openCardDetail', true);
const cardBlocks = Array.from(activeCardDetail.matchAll(/\bblock\(\s*'([^']+)'/g), (match) => match[1]);
const directCardBlocks = Array.from(
  activeCardDetail.matchAll(/data-card-section="(official-source|application-channel)"/g),
  (match) => match[1]
);
same(
  cardBlocks.concat(directCardBlocks),
  ['education', 'eligibility', 'welcome', 'annual-fee', 'deadline', 'exclusions', 'official-source', 'application-channel'],
  'Active Card Detail must contain exactly the approved information sections.'
);
check(activeCardDetail.includes("favHeart('cards'"), 'Active Card Detail must retain the favourite heart.');
check(
  activeCardDetail.includes('id="cardApplyCta"') && activeCardDetail.includes('>立即申請</a>'),
  'Active Card Detail must use the exact main application CTA.'
);
same(
  Array.from(activeCardDetail.matchAll(/data-source-scope="([^"]+)"/g), (match) => match[1]),
  ['official', 'channel'],
  'Official and channel/referral sources must remain explicitly separated.'
);
check(
  activeCardDetail.includes('銀行官方資料') &&
    activeCardDetail.includes('申請渠道／推薦資料（與銀行官方資料分開）'),
  'Active Card Detail must label official and channel data separately.'
);
const closeCardDetail = extractFunction(html, 'closeCardDetail');
check(
  closeCardDetail.includes("unlock('card-detail')") &&
    closeCardDetail.includes('_cardDetailReturnFocus.focus') &&
    !/(?:runCalc|renderResults|BM\.optimize)/.test(closeCardDetail),
  'Closing Card Detail must restore focus without recalculating or mutating the result.'
);
for (const disallowed of [
  ['related', 'Cards'].join(''),
  ['related', 'Articles'].join(''),
  ['confidence', 'Score'].join(''),
  ['相關', '信用卡'].join(''),
  ['相關', '文章'].join(''),
  ['信心', '分數'].join(''),
  ['share', 'Mini'].join(''),
  ['分', '享'].join('')
]) {
  check(!activeCardDetail.toLowerCase().includes(disallowed.toLowerCase()), `Active Card Detail must not contain disallowed content: ${disallowed}.`);
}

if (failures.length) {
  console.error(`Phase 2B UI regression: ${passed} passed, ${failures.length} failed.`);
  failures.forEach((failure, index) => console.error(`FAIL ${index + 1}: ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Phase 2B UI regression: PASS (${passed} assertions).`);
}
