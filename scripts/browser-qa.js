#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const {chromium} = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'qa', 'screenshots');
const executablePath = process.env.CHROMIUM_PATH;
const fontRoot = process.env.QA_FONT_ROOT || '';
const axePath = process.env.AXE_PATH || '';
if (!executablePath || !fs.existsSync(executablePath)) {
  console.error('Set CHROMIUM_PATH to a working Chromium binary.');
  process.exit(2);
}

const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp'
};

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let pathname;
      try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
      catch (_) { res.writeHead(400).end('Bad request'); return; }
      const useFont = pathname.startsWith('/__qa_font__/') && fontRoot;
      const baseDir = useFont ? path.resolve(fontRoot) : root;
      const rel = useFont ? pathname.slice('/__qa_font__/'.length) : '.' + pathname;
      let file = path.resolve(baseDir, rel);
      if (!file.startsWith(baseDir)) { res.writeHead(403).end('Forbidden'); return; }
      try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); }
      catch (_) {}
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, {'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream'});
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({server, base:`http://127.0.0.1:${server.address().port}/`}));
  });
}

async function loadQaFonts(page, base) {
  if (!fontRoot) return;
  for (const weight of [400, 700, 800, 900]) await page.addStyleTag({url:`${base}__qa_font__/${weight}.css`});
  await page.evaluate(() => document.fonts && document.fonts.ready);
}

async function preparePage(context) {
  await context.addInitScript(() => {
    try {
      localStorage.setItem('bm_ok', JSON.stringify(true));
      localStorage.setItem('bm_consent', JSON.stringify({analytics:false, ts:Date.now()}));
      localStorage.setItem('bm_welcome_ts', JSON.stringify(Date.now()));
    } catch (_) {}
    try { Object.defineProperty(navigator, 'share', {configurable:true, value:async payload => { window.__lastShare = payload; }}); }
    catch (_) {}
  });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push('pageerror: ' + error.message));
  page.on('console', msg => { if (msg.type() === 'error') runtimeErrors.push('console: ' + msg.text()); });
  return {page, runtimeErrors};
}

async function main() {
  fs.mkdirSync(outDir, {recursive:true});
  const {server, base} = await startServer();
  const browser = await chromium.launch({
    executablePath,
    headless:true,
    args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  });
  const report = {date:new Date().toISOString(), viewports:[], checks:[], axe:[], errors:[]};
  function check(name, condition, detail) {
    report.checks.push({name, ok:!!condition, detail:detail || ''});
    if (!condition) report.errors.push(name + (detail ? ': ' + detail : ''));
  }
  async function runAxe(page, label) {
    if (!axePath || !fs.existsSync(axePath)) return;
    await page.addScriptTag({path:axePath});
    const result = await page.evaluate(async () => axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
    const severe = result.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    report.axe.push({label, violations:result.violations.map(v => ({id:v.id, impact:v.impact, help:v.help, nodes:v.nodes.map(n => ({target:n.target, html:n.html, failureSummary:n.failureSummary}))}))});
    check(`${label}: 無嚴重無障礙錯誤`, severe.length === 0, severe.map(v => `${v.id}(${v.nodes.length})`).join(', '));
  }
  try {
    const sizes = [
      {name:'mobile-360', width:360, height:800},
      {name:'tablet-768', width:768, height:1024},
      {name:'desktop-1440', width:1440, height:1000}
    ];
    for (const size of sizes) {
      const context = await browser.newContext({viewport:{width:size.width,height:size.height}, colorScheme:'light'});
      const {page, runtimeErrors} = await preparePage(context);
      await page.goto(base, {waitUntil:'domcontentloaded'});
      await loadQaFonts(page, base);
      await page.waitForTimeout(450);
      const planner = await page.locator('.planner-launch').boundingBox();
      const primary = await page.locator('.planner-primary').boundingBox();
      check(`${size.name}: 規劃器主入口可見`, !!planner && planner.width > 250 && planner.height > 150, JSON.stringify(planner));
      check(`${size.name}: 主按鈕可撳`, !!primary && primary.width > 120 && primary.height >= 40, JSON.stringify(primary));
      await page.screenshot({path:path.join(outDir, `${size.name}-home.png`), fullPage:true});
      if (size.name === 'mobile-360') await runAxe(page, 'mobile-360 首頁');
      report.viewports.push({...size, runtimeErrors:[...runtimeErrors]});
      check(`${size.name}: 開頁冇 JavaScript error`, runtimeErrors.length === 0, runtimeErrors.join(' | '));
      await context.close();
    }

    const context = await browser.newContext({viewport:{width:390,height:844}, colorScheme:'light'});
    const {page, runtimeErrors} = await preparePage(context);
    await page.goto(base, {waitUntil:'domcontentloaded'});
    await loadQaFonts(page, base);
    await page.waitForTimeout(350);

    await page.locator('.planner-primary').click();
    await page.waitForTimeout(150);
    check('主入口會打開環球票規劃器', await page.locator('#rsub-rtw').isVisible() && await page.locator('#owPanel').isVisible());
    await runAxe(page, 'mobile-390 規劃器');

    await page.goto(base + '?open=pgO1', {waitUntil:'domcontentloaded'});
    await loadQaFonts(page, base);
    await page.waitForTimeout(350);
    check('文章分享深連結會直接開文章', await page.locator('#pgO1').isVisible());
    const heroOk = await page.locator('#pgO1 img[src="img/pgO1-hero.jpg"]').evaluate(img => img.complete && img.naturalWidth >= 1000);
    check('pgO1 正確封面成功解碼', heroOk);
    await page.locator('#pgO1 [data-share-page="pgO1"]').click();
    const articleShare = await page.evaluate(() => window.__lastShare || null);
    check('文章分享使用獨立預覽網址', articleShare && /share\/standard-chartered-cathay-july-2026\/$/.test(articleShare.url), articleShare && articleShare.url);
    await page.screenshot({path:path.join(outDir, 'mobile-390-pgO1.png'), fullPage:false});
    await runAxe(page, 'mobile-390 pgO1 文章');

    await page.goto(base, {waitUntil:'domcontentloaded'});
    await loadQaFonts(page, base);
    await page.locator('#setBtn').click();
    await page.locator('#setSheet [data-open="pgPriv"]').click();
    check('私隱政策可以由更多選單打開', await page.locator('#pgPriv').isVisible());
    const privacyText = await page.locator('#pgPriv').innerText();
    check('私隱政策顯示英國個人營運者同 ICO 登記', privacyText.includes('Mrs HAU YING OU-YANG') && privacyText.includes('ZC174150'));
    check('私隱政策顯示一個曆月回覆期限', privacyText.includes('一個曆月'));
    check('私隱 email 連結正確', await page.locator('#pgPriv a[href="mailto:support@acremiles.app"]').count() === 1);
    check('ICO 投訴連結安全開新頁', await page.locator('#pgPriv a[href*="ico.org.uk/make-a-complaint"][target="_blank"][rel~="noopener"]').count() === 1);
    const privacyCoversHome = await page.evaluate(() => {
      const homeButton = document.getElementById('obGo');
      const privacyPage = document.getElementById('pgPriv');
      if (!homeButton || !privacyPage) return false;
      const rect = homeButton.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, rect.top + Math.min(rect.height / 2, innerHeight - rect.top - 1)));
      return privacyPage.contains(document.elementFromPoint(x, y));
    });
    check('私隱政策完整蓋住首頁操作', privacyCoversHome);
    /* .page 係 fixed viewport；fullPage 會將底層 document 拼入同一張圖，造成假 overlay。 */
    await page.screenshot({path:path.join(outDir, 'mobile-390-privacy.png'), fullPage:false});
    await runAxe(page, 'mobile-390 私隱政策');

    await page.goto(base, {waitUntil:'domcontentloaded'});
    await loadQaFonts(page, base);
    await page.locator('.tabs button[data-tab="opt"]').click();
    await page.locator('#cardLibToggle').click();
    await page.locator('#cardList .lib-card').first().click();
    check('信用卡詳情有分享掣', await page.locator('#cardDetail [data-share-card]').isVisible());
    await page.locator('#cardDetail [data-share-card]').click();
    const cardShare = await page.evaluate(() => window.__lastShare || null);
    check('信用卡分享使用獨立卡頁', cardShare && /cards\/scb-cathay-mastercard\.html$/.test(cardShare.url), cardShare && cardShare.url);
    check('信用卡詳情有銀行官方原文', await page.locator('#cardDetail a[href*="sc.com"]').count() >= 2);

    const token = Buffer.from(JSON.stringify({v:1,c:'j',s:[['HKG','CTS','CX','stop'],['CTS','FUK','JL','open'],['HND','SYD','JL','stop'],['SYD','MEL','QF','stop'],['MEL','SIN','QF','open'],['KUL','BKK','MH','stop'],['BKK','HKG','CX','stop']]})).toString('base64url');
    await page.goto(base + '?trip=' + token, {waitUntil:'domcontentloaded'});
    await loadQaFonts(page, base);
    await page.waitForTimeout(350);
    const fromValues = await page.locator('#owSegs input[data-owf="from"]').evaluateAll(nodes => nodes.map(n => n.value));
    check('朋友分享行程可以重新載入', fromValues.join(',') === 'HKG,CTS,HND,SYD,MEL,KUL,BKK', fromValues.join(','));
    const routeStatus = await page.evaluate(() => ({
      correct: BM.owRouteStatus(BM.owAirport('HND'), BM.owAirport('SYD'), 'JL'),
      old: BM.owRouteStatus(BM.owAirport('NRT'), BM.owAirport('SYD'), 'JL')
    }));
    check('精確機場核實會放行 HND→SYD、拒絕舊 NRT→SYD', routeStatus.correct === 'verified' && routeStatus.old === 'unverified', JSON.stringify(routeStatus));
    check('載入後網址會清走行程資料', !(await page.evaluate(() => location.search)));
    await page.locator('#owSharePlan').click();
    const tripShare = await page.evaluate(() => window.__lastShare || null);
    check('行程分享網址帶可重載資料', tripShare && /share\/itinerary\/#/.test(tripShare.url), tripShare && tripShare.url);
    await page.screenshot({path:path.join(outDir, 'mobile-390-shared-itinerary.png'), fullPage:true});
    await runAxe(page, 'mobile-390 分享行程');
    check('互動流程冇 JavaScript error', runtimeErrors.length === 0, runtimeErrors.join(' | '));
    await context.close();
  } finally {
    await browser.close();
    server.close();
  }

  const reportPath = path.join(root, 'qa', 'browser-qa.json');
  fs.mkdirSync(path.dirname(reportPath), {recursive:true});
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  for (const item of report.checks) console.log((item.ok ? '✓ ' : '❌ ') + item.name + (item.detail ? ` — ${item.detail}` : ''));
  console.log(`Browser QA: ${report.checks.filter(x => x.ok).length}/${report.checks.length} checks passed`);
  if (report.errors.length) process.exit(1);
}

main().catch(error => { console.error(error); process.exit(1); });
