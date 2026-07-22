#!/usr/bin/env node
/* AcreMiles verify — 用法: node scripts/verify.js path/to/index.html
   做齊：build marker、逐 script block 語法、引擎 invariant、資產、私隱及產品可信度 gate。
   Invariant FAIL = 唔可以交付。快照數字唔算 FAIL（卡數據改咗會變），眼睇合唔合理。 */
'use strict';
const fs = require('fs'), cp = require('child_process'), os = require('os'), path = require('path'), vm = require('vm');
const file = process.argv[2] || 'index.html';
const src = fs.readFileSync(file, 'utf8');
const root = path.dirname(path.resolve(file));
const CARD_DATA = require(path.join(root, 'data'));
const CARDS_OFFICIAL = require(path.join(root, 'data', 'cards-official.js'));
const CARD_CHANNELS = require(path.join(root, 'data', 'card-channels.js'));
const SOURCE_REGISTRY = require(path.join(root, 'data', 'source-registry.js'));
const swPath = path.join(root, 'sw.js');
const manifestPath = path.join(root, 'manifest.json');
const z10CsvPath = path.join(root, 'docs', 'ZONE-10-ROUTE.csv');
const sw = fs.existsSync(swPath) ? fs.readFileSync(swPath, 'utf8') : '';
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : null;
const z10Csv = fs.existsSync(z10CsvPath) ? fs.readFileSync(z10CsvPath, 'utf8').trim() : '';
let fails = 0;
const ok = (n, c) => { console.log((c ? '✓ ' : '❌ ') + n); if (!c) fails++; };
const near = (a, b, e) => Math.abs(a - b) < (e || 2);
const sum = r => r.rows.reduce((s, x) => s + x.spend, 0);
function jpegDimensions(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath);
  if (data[0] !== 0xff || data[1] !== 0xd8) return null;
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < data.length) {
    if (data[offset] !== 0xff) { offset += 1; continue; }
    while (data[offset] === 0xff) offset += 1;
    const marker = data[offset++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= data.length) return null;
    const length = data.readUInt16BE(offset);
    if (sof.has(marker)) return {height: data.readUInt16BE(offset + 3), width: data.readUInt16BE(offset + 5)};
    if (length < 2) return null;
    offset += length;
  }
  return null;
}

/* 1. build marker + 行數 */
const first = src.split('\n')[0];
ok('第一行係 build marker', /^<!-- build: 20/.test(first));
console.log('  ' + first.slice(0, 110) + (first.length > 110 ? '…' : ''));
console.log('  總行數: ' + src.split('\n').length);

/* 2. script blocks 語法（⚠️ 一定要 <script[^>]*>，引擎 block 有 id 屬性） */
const blocks = [];
const blockTags = [];
src.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (m, attrs, b) => { blocks.push(b); blockTags.push(attrs || ''); return m; });
console.log('  script blocks: ' + blocks.length);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bm-'));
blocks.forEach((b, i) => {
  if (/application\/ld\+json/.test(blockTags[i] || '')) { console.log('✓ block ' + i + ' 語法 (JSON-LD，跳過JS檢查)'); return; }
  const p = path.join(tmp, 'blk' + i + '.js');
  fs.writeFileSync(p, b);
  const r = cp.spawnSync('node', ['--check', p], { encoding: 'utf8' });
  ok('block ' + i + ' 語法', r.status === 0);
  if (r.status !== 0) console.log(r.stderr.slice(0, 500));
});
const htmlCheck = cp.spawnSync('python3', [path.join(__dirname, 'verify-html.py'), file], { encoding: 'utf8' });
if (htmlCheck.status === 2 && /lxml is not installed/.test(htmlCheck.stderr || '')) {
  console.log('⚠ HTML 結構檢查跳過（要安裝 lxml）');
} else {
  ok('HTML 標籤結構', htmlCheck.status === 0);
  if (htmlCheck.status !== 0) console.log((htmlCheck.stderr || '').slice(0, 1000));
}
const consentCheck = cp.spawnSync('node', [path.join(__dirname, 'test-consent-gate.js'), file], { encoding: 'utf8' });
ok('consent gate runtime', consentCheck.status === 0);
if (consentCheck.status !== 0) console.log((consentCheck.stderr || consentCheck.stdout || '').slice(0, 1000));
const browserDataContext = {console};
vm.createContext(browserDataContext);
for (const name of ['source-registry.js', 'cards-official.js', 'card-channels.js', 'index.js']) {
  new vm.Script(fs.readFileSync(path.join(root, 'data', name), 'utf8'), {filename: `data/${name}`}).runInContext(browserDataContext);
}
ok('四個 data modules 嘅 browser UMD path 同 Node export 完全一致', JSON.stringify(browserDataContext.ACREMILES_CARD_DATA) === JSON.stringify(CARD_DATA));
if (fails) { console.log('\n❌ 語法都未過，先修好。'); process.exit(1); }

/* 3. 引擎 invariants */
let engIdx = blockTags.findIndex(a => /id=["']bm-core["']/.test(a));
if (engIdx < 0) engIdx = 0;
global.ACREMILES_CARD_DATA = CARD_DATA;
const BM = require(path.join(tmp, 'blk' + engIdx + '.js'));
delete global.ACREMILES_CARD_DATA;
const base = { amount: 168888, months: 6, goal: 'any', owned: [], income: 300000, spendPattern: 'spread' };
const X = o => Object.assign({}, base, o || {});

const r1 = BM.optimize(X(), BM.DEFAULT_CARDS);
ok('金額守恆(spread)', near(sum(r1), base.amount));
ok('total>0 無NaN', r1.total > 0 && isFinite(r1.total));
const rl = BM.optimize(X({ spendPattern: 'lump' }), BM.DEFAULT_CARDS);
ok('金額守恆(lump)', near(sum(rl), base.amount));
ok('lump ≤ spread', rl.total <= r1.total + 1);
ok('pending 卡唔出現', !r1.rows.some(r => r.card.pending));
ok('未核實卡唔出現', !r1.rows.some(r => r.card.verified !== true));
ok('HSBC Visa Signature 未核實卡唔入推薦', !r1.rows.some(r => (r.card._baseId || r.card.id) === 'hsbc-visasig'));

let cr = false;
try { BM.optimize(X({ owned: ['hs-mmpower', 'zombie-id'] }), BM.DEFAULT_CARDS); } catch (e) { cr = true; }
ok('殘留舊 owned id 唔 crash', !cr);

const top = r1.rows.find(r => r.isNew);
if (top) {
  const tid = top.card._baseId || top.card.id;
  const ex = BM.optimize(X({ excludedCards: [tid] }), BM.DEFAULT_CARDS);
  ok('剔卡後守恆', near(sum(ex), base.amount));
  ok('剔卡後嗰張唔出現', !ex.rows.some(r => (r.card._baseId || r.card.id) === tid));
  ok('剔卡後仍有組合(有替代)', ex.rows.length >= 1);
}

const rf = BM.optimize(X({ amount: 300000, family: true, income2: 130000, owned2: [] }), BM.DEFAULT_CARDS);
ok('家庭守恆', near(sum(rf), 300000));
ok('家庭每人每月≤2張新卡', (() => {
  const c = {};
  rf.rows.filter(r => r.isNew && !r.bulkOnly).forEach(r => { const k = (r.card._person || '') + 'M' + r.applyMonth; c[k] = (c[k] || 0) + 1; });
  return Object.keys(c).every(k => c[k] <= 2);
})());
cr = false;
try { BM.optimize(X({ family: true, income2: 100000, owned: ['cancelled-card-a'], owned2: ['cancelled-card-b'], excludedCards: ['dbs-black'] }), BM.DEFAULT_CARDS); } catch (e) { cr = true; }
ok('家庭+舊id+剔卡 唔crash', !cr);

/* 有 cap 嘅卡：超額必須跌 excess（唔准無限 flat rate） */
BM.DEFAULT_CARDS.filter(c => c.verified === true && !c.pending && BM.hasCap(c)).forEach(c => {
  const capa = BM.goodRateCapacity(c, 6);
  if (!isFinite(capa)) return;
  const m = BM.milesForBaseSpend(c, capa * 2, 6);
  const naive = (capa * 2) / BM.effRate(c);
  ok(c.id + ' 超上限部分有跌 excess', m < naive - 0.5);
});

/* 3.5 UI 層 lint：捉「call 咗但冇定義」嘅 function（optInputNoExclude 類漏網 bug 嘅防線）
   node --check 唔會捉呢種——因為語法啱，係 runtime 先 throw。用簡單啟發式：
   搵所有 `foo(` 形式嘅 call，check 有冇對應 `function foo(` 或 `var foo =`。
   只查 UI block（blk1），淨計「本地定義」嘅名，跳過已知全域（BM/document/window/等）。 */
(function uiLint(){
  if (blocks.length < 2) return;
  let uiIdx = blocks.findIndex(b => b.indexOf('var store = {') >= 0);
  if (uiIdx < 0) uiIdx = blocks.length - 1;
  const ui = blocks[uiIdx];
  const known = new Set(['if','for','while','switch','catch','function','return','typeof','Number','String','Boolean','Array','Object','Math','JSON','parseInt','parseFloat','isFinite','isNaN','setTimeout','setInterval','encodeURIComponent','decodeURIComponent','$','BM','document','window','console','Array','requestAnimationFrame','localStorage']);
  const defined = new Set();
  let m;
  const reDef = /(?:function\s+([A-Za-z_$][\w$]*)\s*\(|(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=)/g;
  while ((m = reDef.exec(ui))) { if (m[1]) defined.add(m[1]); if (m[2]) defined.add(m[2]); }
  const reCall = /([A-Za-z_$][\w$]*)\s*\(/g;
  const missing = new Set();
  while ((m = reCall.exec(ui))) {
    const name = m[1];
    if (known.has(name) || defined.has(name)) continue;
    // 跳過方法呼叫（前面係 . ）
    const before = ui[m.index - 1];
    if (before === '.') continue;
    missing.add(name);
  }
  // 只報「似係本地 helper 但搵唔到定義」嘅——過濾明顯全域/DOM API
  const suspects = [...missing].filter(n => /^(opt|render|run|parse|show|setup|open|calc|update|make|build|get|do)[A-Z]/.test(n) || n.startsWith('_'));
  ok('UI 層冇 call 未定義嘅本地 function', suspects.length === 0);
  if (suspects.length) console.log('  ⚠ 可疑（call 咗但搵唔到定義）: ' + suspects.join(', '));
})();

/* 3.6 產品可信度、私隱、版本同交付結構 gate */
(function releaseSafety(){
  const version = (first.match(/—\s*(v\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?)/i) || [])[1];
  const buildDate = (first.match(/build:\s*(\d{4}-\d{2}-\d{2})/) || [])[1];
  ok('build marker 有可解析版本同日期', !!version && !!buildDate);
  ok('APP_VERSION 同 build marker 一致', !!version && src.includes("var APP_VERSION = '" + version + ' · build ' + buildDate + "'"));
  ok('設定頁版本同 build marker 一致', !!version && src.includes('AcreMiles · ' + version));
  ok('service worker cache 版本一致', !!version && sw.includes("var CACHE = 'acremiles-" + version + "'"));
  ok('manifest 品牌係 AcreMiles', !!manifest && manifest.name.startsWith('AcreMiles') && manifest.short_name === 'AcreMiles');
  const cardPageFiles = fs.existsSync(path.join(root, 'cards'))
    ? fs.readdirSync(path.join(root, 'cards')).filter(n => n.endsWith('.html'))
    : [];
  const cardPages = cardPageFiles.map(n => fs.readFileSync(path.join(root, 'cards', n), 'utf8'));
  const productCardPages = cardPageFiles.filter(n => n !== 'index.html').map(n => fs.readFileSync(path.join(root, 'cards', n), 'utf8'));
  ok('部署品牌無 Angel方加／BigMiles 殘留', !/Angel方加|BigMiles/.test(src + sw + JSON.stringify(manifest || {}) + cardPages.join('\n')));

  const usedKeys = new Set([...src.matchAll(/['"](bm_[a-z_]+)['"]/g)].map(m => m[1]));
  const resetBlock = (src.match(/var ACREMILES_STORAGE_KEYS\s*=\s*\[([\s\S]*?)\];/) || [])[1] || '';
  const resetKeys = new Set([...resetBlock.matchAll(/['"](bm_[a-z_]+)['"]/g)].map(m => m[1]));
  const missingReset = [...usedKeys].filter(k => !resetKeys.has(k));
  ok('重設清齊所有 bm_* keys', missingReset.length === 0 && resetKeys.size > 0);
  if (missingReset.length) console.log('  漏咗: ' + missingReset.join(', '));

  ok('Sentry 有 consent gate', /function diagnosticsAllowed\([\s\S]*?bm_consent[\s\S]*?consent\.analytics/.test(src));
  ok('關閉同意會即時停 GA/Sentry', /function stopDiagnostics\([\s\S]*?analytics_storage:\s*'denied'[\s\S]*?disableAcreMilesDiagnostics/.test(src));
  ok('GA 載入前檢查 consent', /function loadGA\([\s\S]*?store\.get\('bm_consent'\)[\s\S]*?if \(!cs \|\| !cs\.analytics\) return/.test(src));
  ok('私隱政策披露三個第三方', ['Google Analytics','Sentry','MailerLite'].every(n => src.includes(n)));
  ok('私隱政策列明三項保存安排', /Google Analytics[\s\S]*?事件資料 2 個月[\s\S]*?使用者資料 14 個月[\s\S]*?Sentry Developer[\s\S]*?30 日[\s\S]*?MailerLite/.test(src));
  ok('使用條款清楚講推薦限制及不可排除權利',
    /唔保證結果係最抵、最完整/.test(src) && /法律上不可排除嘅消費者權利/.test(src));
  ok('RTW 清楚標示教學示例而非出票保證',
    /教學示例｜唔係出票保證/.test(src) && /正式確認同最終出票結果為準/.test(src));
  ok('未同意前無靜態第三方 script/stylesheet', !/<script[^>]+src=["']https?:|<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i.test(src));

  ok('香港日期 helper 已用於優惠到期', /function hkToday\(/.test(src) && (src.match(/var today = (?:todayStr \|\| )?hkToday\(\);/g) || []).length >= 2);
  ok('未核實卡 UI pool 有硬過濾', /recommendableCards\s*=\s*cards\.filter\(function\(c\)\{\s*return c\.verified\s*&&\s*!c\.pending/.test(src));
  const sourceScripts = ['data/source-registry.js','data/cards-official.js','data/card-channels.js','data/index.js'];
  const sourcePositions = sourceScripts.map(name => src.indexOf(`src="${name}"`));
  ok('index 以 blocking script 直接讀四個 card data modules', sourcePositions.every(pos => pos >= 0) && sourcePositions.every((pos, i) => !i || pos > sourcePositions[i - 1]) && sourcePositions[3] < src.indexOf('id="bm-core"'));
  ok('service worker 精確 precache 四個 card data modules', sourceScripts.every(name => (sw.match(new RegExp(`['"]\\./${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')) || []).length === 1));
  ok('bm-core 冇再內嵌 DEFAULT_CARDS／CHANNEL_OFFERS 正式資料', !/var DEFAULT_CARDS\s*=\s*\[/.test(src) && !/var CHANNEL_OFFERS\s*=\s*\{/.test(src));
  ok('卡資料三個責任檔齊全', Array.isArray(CARDS_OFFICIAL) && CARD_CHANNELS && Array.isArray(CARD_CHANNELS.records) && SOURCE_REGISTRY && SOURCE_REGISTRY.cards && Array.isArray(SOURCE_REGISTRY.promotions));
  ok('每張卡自帶唯一 slug、image、status', CARDS_OFFICIAL.length === 9 && new Set(CARDS_OFFICIAL.map(c => c.id)).size === 9 && new Set(CARDS_OFFICIAL.map(c => c.slug)).size === 9 && CARDS_OFFICIAL.every(c => c.slug && c.image && c.status === 'active' && fs.existsSync(path.join(root, c.image))));
  ok('官方卡檔冇混入具名第三方渠道 prose', !/MoneyHero|MoneySmart|里先生|小斯|mrmiles\.hk|flyformiles\.hk/i.test(fs.readFileSync(path.join(root, 'data', 'cards-official.js'), 'utf8')));
  ok('非官方 applyWeeks 冇冒充銀行官方卡資料', CARDS_OFFICIAL.every(c => !Object.prototype.hasOwnProperty.call(c, 'applyWeeks')) && SOURCE_REGISTRY.modelAssumptions && SOURCE_REGISTRY.modelAssumptions.applyWeeks && SOURCE_REGISTRY.modelAssumptions.applyWeeks.sourceType === 'none' && SOURCE_REGISTRY.modelAssumptions.applyWeeks.status === 'unknown');
  ok('第二張卡乘數保留原值但明確標示 unknown', CARDS_OFFICIAL.every(c => !Object.prototype.hasOwnProperty.call(c, 'secondCardMult')) && SOURCE_REGISTRY.modelAssumptions.cardSecondMultiplier.status === 'unknown' && SOURCE_REGISTRY.modelAssumptions.cardSecondMultiplier.values['amex-explorer'] === 0 && SOURCE_REGISTRY.modelAssumptions.cardSecondMultiplier.values['amex-platinum'] === 0.81 && SOURCE_REGISTRY.modelAssumptions.bankSecondCardMultiplier.status === 'unknown' && JSON.stringify(SOURCE_REGISTRY.modelAssumptions.bankSecondCardMultiplier.values) === JSON.stringify({'Citibank':0, '滙豐':0.25, '美國運通':0.65}));
  const assumedFeeWaiverIds = ['citi-pm', 'dbs-black', 'dahsing-ba', 'hsbc-visasig'];
  ok('未逐欄官方化嘅 fee waiver 冇冒充官方卡資料', assumedFeeWaiverIds.every(id => { const card = CARDS_OFFICIAL.find(c => c.id === id); return card && !Object.prototype.hasOwnProperty.call(card, 'feeWaivable') && !Object.prototype.hasOwnProperty.call(card, 'waiveNote') && SOURCE_REGISTRY.modelAssumptions.feeWaiver.values[id].status === 'unknown'; }));
  ok('source registry 完整覆蓋 9 張卡', Object.keys(SOURCE_REGISTRY.cards).length === 9 && CARDS_OFFICIAL.every(c => SOURCE_REGISTRY.cards[c.id]));
  ok('渠道／官方推廣全部有 machine-readable provenance', CARD_CHANNELS.records.every(r => r.id && r.cardId && r.scope === 'channel' && r.sourceType && r.status && Object.prototype.hasOwnProperty.call(r, 'validFrom') && Object.prototype.hasOwnProperty.call(r, 'validUntil') && Object.prototype.hasOwnProperty.call(r, 'verifiedAt')) && SOURCE_REGISTRY.promotions.every(r => r.id && Array.isArray(r.cardIds) && r.scope === 'bank-official-claim' && r.sourceType && r.status && Object.prototype.hasOwnProperty.call(r, 'validFrom') && Object.prototype.hasOwnProperty.call(r, 'validUntil') && Object.prototype.hasOwnProperty.call(r, 'verifiedAt')));
  ok('bm-core 同直接 data source 完全一致', JSON.stringify(BM.DEFAULT_CARDS) === JSON.stringify(CARD_DATA.DEFAULT_CARDS) && JSON.stringify(BM.CHANNEL_OFFERS) === JSON.stringify(CARD_DATA.CHANNEL_OFFERS));
  ok('無核實渠道優惠預設下架', Object.values(CARD_DATA.CHANNEL_OFFERS).flat().every(o => o.verified === true || o.active !== true));
  const dataAsOfDate = ((BM.DATA_AS_OF || '').match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
  ok('9 張卡全部有銀行官方產品頁及 KFS／T&C', BM.DEFAULT_CARDS.length === 9 && !!dataAsOfDate && BM.DEFAULT_CARDS.every(c =>
    /^https:\/\//.test(c.url || '') && !/mrmiles\.hk/i.test(c.url || '') &&
    /^\d{4}-\d{2}-\d{2}$/.test(c.sourceVerifiedAt || '') && c.sourceVerifiedAt <= dataAsOfDate &&
    Array.isArray(c.sourceDocs) && c.sourceDocs.length >= 2 && c.sourceDocs.every(d => /^https:\/\//.test(d.url || ''))
  ));
  const sc = BM.DEFAULT_CARDS.find(c => c.id === 'sc-cathay');
  ok('渣打 HK$96,000 已正確標為年薪而非簽賬豁免門檻', !!sc && sc.incomeVerified === true && /唔係簽賬門檻/.test(sc.waiveNote || ''));
  const hsbcVs = BM.DEFAULT_CARDS.find(c => c.id === 'hsbc-visasig');
  ok('HSBC Visa Signature 有官方來源但未完成建模前不推薦', !!hsbcVs && hsbcVs.verified === false && hsbcVs.capTotal === 100000 && Array.isArray(hsbcVs.sourceDocs));
  const generatorSource = fs.readFileSync(path.join(root, 'scripts', 'generate-card-pages.js'), 'utf8');
  ok('卡頁由 data source 自動產生，冇 hardcoded card id/file map', /require\(path\.join\(root, 'data'\)\)/.test(generatorSource) && !/fileById|imageById|<script id="bm-core">/.test(generatorSource));

  const cts = BM.owAirport('CTS'), fuk = BM.owAirport('FUK');
  const hnl = BM.owAirport('HNL'), hkg = BM.owAirport('HKG'), mad = BM.owAirport('MAD');
  ok('RTW 已核實／冇直航／未核實三態',
    BM.owRouteStatus(cts, fuk, 'JL') === 'verified' &&
    BM.owRouteStatus(hnl, hkg, 'CX') === 'no-direct' &&
    BM.owRouteStatus(hkg, mad, 'QR') === 'unverified');
  const hnd = BM.owAirport('HND'), nrt = BM.owAirport('NRT'), gmp = BM.owAirport('GMP'), icn = BM.owAirport('ICN');
  const syd = BM.owAirport('SYD'), bkk = BM.owAirport('BKK'), sin = BM.owAirport('SIN');
  ok('RTW 用精確機場碼，唔會再混淆成田／羽田或仁川／金浦',
    BM.owRouteStatus(hnd, gmp, 'JL') === 'verified' && BM.owRouteStatus(nrt, icn, 'JL') === 'unverified' &&
    BM.owRouteStatus(hnd, syd, 'JL') === 'verified' && BM.owRouteStatus(nrt, syd, 'JL') === 'unverified');
  ok('曼谷至新加坡國泰直航錯誤封鎖已修正', BM.owRouteStatus(bkk, sin, 'CX') === 'verified');
  ok('季節線會另外提示', BM.owRouteSeasonality(BM.owAirport('LAX'), BM.owAirport('HEL'), 'AY') === 'seasonal');
  ok('Hawaiian Airlines 已加入 oneworld 清單', BM.OW_CARRIERS.some(c => c.c === 'HA'));
  const pit = BM.owAirport('PIT');
  const z10Verified = [
    ['HKG','MAD','CX'], ['MAD','CDG','IB'], ['LHR','JFK','BA'], ['JFK','BOS','AA'],
    ['BOS','PIT','AA'], ['PIT','ORD','AA'], ['ORD','SEA','AA'], ['YVR','NRT','JL'],
    ['NRT','TPE','JL'], ['TPE','HKG','CX']
  ];
  ok('區10 正式方案十段航線已逐段入核實庫', pit && z10Verified.every(x => BM.owRouteStatus(BM.owAirport(x[0]), BM.owAirport(x[1]), x[2]) === 'verified'));
  const z10Eval = BM.owEvaluate([
    {from:'HKG',to:'MAD',carrier:'CX',stay:'stop'}, {from:'MAD',to:'CDG',carrier:'IB',stay:'stop'},
    {from:'LHR',to:'JFK',carrier:'BA',stay:'stop'}, {from:'JFK',to:'BOS',carrier:'AA',stay:'stop'},
    {from:'BOS',to:'PIT',carrier:'AA',stay:'transit'}, {from:'PIT',to:'ORD',carrier:'AA',stay:'transit'},
    {from:'ORD',to:'SEA',carrier:'AA',stay:'stop'}, {from:'YVR',to:'NRT',carrier:'JL',stay:'stop'},
    {from:'NRT',to:'TPE',carrier:'JL',stay:'stop'}, {from:'TPE',to:'HKG',carrier:'CX',stay:'stop'}
  ], 'j');
  ok('區10 正式方案距離、分區同 5／2／2 票規重算一致', z10Eval.errors.length === 0 && z10Eval.total === 19960 && z10Eval.zone.z === 10 && z10Eval.need === 230000 && z10Eval.stopovers === 5 && z10Eval.transits === 2 && z10Eval.openJaws === 2);
  ok('區10 正式方案可由文章載入規劃器',
    /z10\s*:\s*\[[\s\S]*?HKG[\s\S]*?MAD[\s\S]*?CDG[\s\S]*?LHR[\s\S]*?JFK[\s\S]*?BOS[\s\S]*?PIT[\s\S]*?ORD[\s\S]*?SEA[\s\S]*?YVR[\s\S]*?NRT[\s\S]*?TPE[\s\S]*?HKG/.test(src) &&
    /data-owdiy=["']z10["']/.test(src) && /img\/pgW10-hero\.jpg/.test(src));
  const z10CsvRows = z10Csv.split(/\r?\n/).slice(1).map(line => line.split(','));
  const z10CsvFlights = z10CsvRows.filter(row => row[0] === 'flight');
  ok('區10 CSV 同規劃器十段資料、距離及 5／2／2 一致',
    z10CsvFlights.length === 10 && z10CsvFlights.reduce((n, row) => n + Number(row[5] || 0), 0) === 19960 &&
    z10CsvFlights.filter(row => row[4] === 'stop').length === 5 && z10CsvFlights.filter(row => row[4] === 'transit').length === 2 &&
    z10CsvRows.filter(row => row[0] === 'open_jaw').length === 2 &&
    z10CsvFlights.map(row => row[1] + '-' + row[2] + '-' + row[3]).join('|') === z10Verified.map(row => row.join('-')).join('|'));
  ok('現行 Zone 10 程式冇殘留被取代距離或 NRT→KIX', !/19[,.](496|793|918|925)|NRT\s*(?:→|-|&rarr;)\s*KIX/.test(src));
  ok('過期優惠文章保留內容並有首屏灰色存檔提示',
    /function applyExpiryNotices\([\s\S]*?expired-article[\s\S]*?歷史優惠｜已於[\s\S]*?insertBefore\(n, body\.firstChild\)/.test(src));
  ok('取消卡冇出現喺公開卡庫', !/建行\(亞洲\).*BA 白金|中銀.*Cheers|BOC Cheers/.test(src.replace(/\/\*[^]*?\*\//g, '')));
  ok('每張卡都有長版公開條款分類', BM.DEFAULT_CARDS.every(c => c.publicDetails && ['eligibility','registration','fees','exclusions','crediting','benefits'].filter(k => Array.isArray(c.publicDetails[k]) && c.publicDetails[k].length).length >= 5));
  ok('現行渠道優惠有實際到期日，過期後會轉歷史紀錄',
    Object.values(BM.CHANNEL_OFFERS).flat().filter(o => o.active && o.verified).length >= 6 &&
    /過往優惠紀錄/.test(src) && /已完結 · /.test(src));
  ok('對外不再宣稱「條線齊規」', !src.includes('條線齊規'));

  ok('viewport 允許縮放', !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(src));
  ok('首頁有 h1', /<h1\b/.test(src));
  ok('訂閱 email 有 accessible name', /<input[^>]+id="subEmail"[^>]+aria-label=/.test(src));
  ok('RTW 目的地冇 duplicate placeholder', !/<input[^>]*placeholder="[^"]*"[^>]*placeholder=/.test(src));
  const ids = [...src.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  ok('HTML id 全部唯一', new Set(ids).size === ids.length);
  const blankLinks = [...src.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map(m => m[0]);
  ok('新視窗連結全部有 noopener', blankLinks.every(tag => /rel=["'][^"']*noopener/.test(tag)));
  ok('主要 dialog 有 aria-modal 同名稱', ['disclaimer','cardDetail','apPicker','setSheet','subSheet','planActionSheet'].every(id => {
    const start = src.indexOf('id="' + id + '"');
    return start >= 0 && /role="dialog"[\s\S]{0,160}aria-modal="true"|aria-modal="true"[\s\S]{0,160}role="dialog"/.test(src.slice(Math.max(0, start - 80), start + 260));
  }));

  const refs = new Set();
  const addRefs = (text, re) => { let m; while ((m = re.exec(text))) refs.add(m[1]); };
  addRefs(src, /(?:src|href)=["']((?:\.\/)?(?:data\/|img\/|cards\/|share\/|share-meta\.js|manifest\.json|icon-[^"']+|apple-touch-icon\.png)[^"']*)["']/g);
  addRefs(src, /\bimg\s*:\s*["']((?:\.\/)?img\/[^"']+)["']/g);
  addRefs(sw, /["']((?:\.\/)?(?:data\/|img\/|share\/|share-meta\.js|manifest\.json|icon-[^"']+|apple-touch-icon\.png)[^"']*)["']/g);
  const missingAssets = [...refs].filter(ref => {
    const clean = ref.replace(/^\.\//, '').replace(/[?#].*$/, '');
    const p = path.join(root, clean);
    return clean.endsWith('/') ? !fs.existsSync(path.join(p, 'index.html')) : !fs.existsSync(p);
  });
  ok('本地 data、圖片、manifest、icon 同 cards 路徑齊全', missingAssets.length === 0);
  if (missingAssets.length) console.log('  缺檔: ' + missingAssets.join(', '));
  const pgO1 = path.join(root, 'img', 'pgO1-hero.jpg');
  ok('pgO1 正確封面已引用及加入離線 cache', fs.existsSync(pgO1) && fs.statSync(pgO1).size > 50000 && src.includes('img/pgO1-hero.jpg') && sw.includes('img/pgO1-hero.jpg'));
  const shareMetaPath = path.join(root, 'share-meta.js');
  const shareMeta = fs.existsSync(shareMetaPath) ? require(shareMetaPath) : {};
  ok('限時文章同分享頁到期日一致', ['pgO1','pgO2','pgO3','pgO4'].every(id => {
    const match = src.match(new RegExp(`pg:['"]${id}['"],\\s*expire:['"](\\d{4}-\\d{2}-\\d{2})['"]`));
    return match && shareMeta[id] && shareMeta[id].expire === match[1];
  }));
  const sharePages = Object.keys(shareMeta).map(id => path.join(root, 'share', shareMeta[id].slug, 'index.html'));
  ok('每篇文章有獨立 Open Graph 分享頁', sharePages.length >= 20 && sharePages.every(p => fs.existsSync(p) && /og:image/.test(fs.readFileSync(p, 'utf8'))));
  ok('文章分享圖尺寸同檔案一致，並有 crawler 所需描述', Object.values(shareMeta).every(item => {
    const p = path.join(root, 'share', item.slug, 'index.html');
    const imagePath = path.join(root, item.image);
    if (!fs.existsSync(p)) return false;
    const html = fs.readFileSync(p, 'utf8');
    const size = jpegDimensions(imagePath);
    return !!size && html.includes(`property="og:image:width" content="${size.width}"`) &&
      html.includes(`property="og:image:height" content="${size.height}"`) &&
      /property="og:image:secure_url"/.test(html) && /property="og:image:alt"/.test(html);
  }));
  ok('行程分享可重新載入且有品牌預覽', fs.existsSync(path.join(root, 'share', 'itinerary', 'index.html')) && /decodeTripPayload/.test(src) && /shareAcreMilesTrip/.test(src));
  const earnOg = path.join(root, 'img', 'og-earn-plan.jpg');
  const redeemOg = path.join(root, 'img', 'og-redeem-itinerary.jpg');
  const planShare = fs.readFileSync(path.join(root, 'share', 'plan', 'index.html'), 'utf8');
  const tripShare = fs.readFileSync(path.join(root, 'share', 'itinerary', 'index.html'), 'utf8');
  ok('賺／換分享各有專屬 1200×675 JPEG',
    jpegDimensions(earnOg)?.width === 1200 && jpegDimensions(earnOg)?.height === 675 &&
    jpegDimensions(redeemOg)?.width === 1200 && jpegDimensions(redeemOg)?.height === 675 &&
    /og-earn-plan\.jpg/.test(planShare) && /og-redeem-itinerary\.jpg/.test(tripShare));
  ok('計算器／規劃器儲存清單使用同一套 compact card ＋安全操作選單',
    (src.match(/class="saved-main"/g) || []).length >= 2 &&
    (src.match(/class="saved-more"/g) || []).length >= 2 &&
    /data-plan-action="open"/.test(src) && /data-plan-action="share"/.test(src) &&
    /data-plan-action="rename"/.test(src) && /data-plan-action="pin"/.test(src) &&
    /data-plan-action="delete"/.test(src) && /window\.confirm\('刪除「'/.test(src) &&
    !/class="saved-action delete"/.test(src));
  ok('Outcome First 首頁先展示可理解結果再問金額',
    /每筆消費，都值得有回報。/.test(src) && /id="outcomeFeature"/.test(src) &&
    /HK\$8,000[\s\S]*?約 20,000 里[\s\S]*?台北經濟來回/.test(src) &&
    src.indexOf('id="outcomeFeature"') < src.indexOf('id="homeAmount"'));
  ok('首頁示範集中資料層並按核實及香港到期日過濾',
    /var SPEND_SCENARIOS\s*=\s*\[/.test(src) &&
    /SPEND_SCENARIOS\.filter\(function\(s\)\{ return s\.verified && \(!s\.expires \|\| s\.expires >= today\); \}\)/.test(src));
  ok('Bottom navigation 中間顯示首頁而且保留原 journey id',
    /<button data-tab="journey" class="on">[\s\S]*?<span>首頁<\/span><\/button>/.test(src));
  ok('計算器第一層只問金額，其他條件逐步顯示',
    /id="calcContinue"/.test(src) && /id="calcDetails"[^>]*hidden/.test(src) &&
    /id="calcAdvanced"/.test(src) && /calcDetails'\)\.hidden = false/.test(src));
  ok('計算結果緊接 summary 顯示可以換到乜',
    src.indexOf('id="redeemList"') > src.indexOf('id="totalMiles"') &&
    src.indexOf('id="redeemList"') < src.indexOf('id="passList"'));
  ok('pgO2 使用 outcome-first 多 tier 同三層 disclosure',
    (src.match(/class="outcome-tier"/g) || []).length >= 2 &&
    (src.match(/class="outcome-disclosure"/g) || []).length >= 3 &&
    /id="pgO2"[\s\S]*?資料更新：2026-07-16[\s\S]*?優惠期限：2026-07-31/.test(src));
  ok('規劃器有 Beginner／Advanced gateway，Beginner 只配對現有 template',
    /id="plannerBeginner"/.test(src) && /id="plannerAdvanced"/.test(src) &&
    /var BEGINNER_TEMPLATES\s*=\s*\[/.test(src) && /OW_ZONE_DEMOS\[templateKey\]/.test(src) &&
    /第一版只會配對現有路線模板，唔會假裝自由生成/.test(src));
  ok('v6.79 冇新增外部 AI API',
    !/api\.openai\.com|anthropic\.com\/v1|generativelanguage\.googleapis\.com/.test(src));
  ok('收藏列表有文章縮圖同過期灰階狀態', /class="fav-thumb/.test(src) && /已完結 · 保留作參考/.test(src) && /\.fav-thumb\.expired img/.test(src));
  ok('信用卡頁有官方原文、分享掣、canonical 同 Open Graph 圖', productCardPages.length === 9 && productCardPages.every(p => /銀行官方原文/.test(p) && /id="sharePage"/.test(p) && /rel="canonical"/.test(p) && /property="og:image"/.test(p) && /property="og:image:alt"/.test(p)));
  ok('靜態卡頁無過期人手註記', productCardPages.every(p => !/冇專屬官方文件|07-15 截|仲有 5 日|Robert 已 confirm/.test(p)));
  ok('service worker 有離線 navigation fallback', /request\.mode === 'navigate'[\s\S]*?caches\.match\('\.\/index\.html'\)/.test(sw));
})();

/* 4. 快照（唔 fail，眼睇；卡數據改咗要更新 engine-spec.md 基準） */
console.log('\n--- 快照（卡數據改動先會變）---');
console.log('  單人 168,888/6月/30萬 total = ' + Math.round(r1.total) + '（v2.1.3 基準 145,170）');
console.log('  家庭 300,000/6月/30萬+13萬 total = ' + Math.round(rf.total));
console.log('  卡數: ' + BM.DEFAULT_CARDS.length + '（含 pending ' + BM.DEFAULT_CARDS.filter(c => c.pending).length + ' 張）');
console.log('  DATA_AS_OF: ' + BM.DATA_AS_OF);

console.log(fails ? ('\n❌ ' + fails + ' 項 FAIL — 唔可以交付') : '\n✅ 全部 invariant 通過，可以交付');
process.exit(fails ? 1 : 0);
