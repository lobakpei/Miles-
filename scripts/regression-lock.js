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
    fs.writeFileSync(coreFile, match[1]);
    delete require.cache[coreFile];
    return require(coreFile);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
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
    cards: fileRecords(['cards']),
    share: fileRecords(['share']),
    images: fileRecords(['img'])
  };
  return {
    schemaVersion: 1,
    baselineCommit: BASELINE_COMMIT,
    scope: ['index.html', 'sw.js', 'manifest.json', 'cards/**', 'share/**', 'img/**'],
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
  const resetMatch = html.match(/const keys=\[([^\]]+)\]/);
  const resetKeys = resetMatch ? [...resetMatch[1].matchAll(/['"](bm_[a-z0-9_]+)['"]/g)].map((match) => match[1]).sort() : [];
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
    for (const rel of ['index.html', 'share-meta.js', 'img', 'cards', 'share', 'scripts']) copyPath(rel, temp);
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
