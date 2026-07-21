const { spawn } = require('child_process');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'qa', 'v6.79.0-draft');
fs.mkdirSync(out, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await wait(700);
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  for (const test of [
    { name: 'mobile-360-light', width: 360, height: 800, colorScheme: 'light' },
    { name: 'mobile-390-dark', width: 390, height: 844, colorScheme: 'dark' },
    { name: 'mobile-430-light', width: 430, height: 932, colorScheme: 'light' },
    { name: 'tablet-768-light', width: 768, height: 1024, colorScheme: 'light' },
    { name: 'desktop-1440-light', width: 1440, height: 1000, colorScheme: 'light' }
  ]) {
    const context = await browser.newContext({ viewport: { width: test.width, height: test.height }, colorScheme: test.colorScheme });
    await context.addInitScript(() => {
      localStorage.setItem('bm_consent', JSON.stringify({ necessary: true, analytics: false, decided: true, ts: Date.now() }));
      localStorage.setItem('bm_welcome_ts', String(Date.now()));
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`${test.name}: ${e.message}`));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) errors.push(`${test.name}: horizontal overflow`);
    await page.screenshot({ path: path.join(out, `${test.name}-home.png`), fullPage: true });
    if (test.name === 'mobile-390-dark') {
      await page.click('[data-prefill="8000"]');
      await page.click('#calcProgressive summary');
      await page.screenshot({ path: path.join(out, 'mobile-390-dark-calculator.png'), fullPage: true });
      await page.click('.tabs button[data-tab="redeem"]');
      await page.click('#openBeginner');
      await page.click('#beginnerDest [data-bdest="europe"]');
      await page.click('#matchTemplates');
      await page.screenshot({ path: path.join(out, 'mobile-390-dark-beginner.png'), fullPage: true });
    }
    await context.close();
  }
  await browser.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Outcome-first browser QA: 5 viewports, light/dark, calculator and beginner planner OK');
})().finally(() => server.kill('SIGTERM')).catch(err => { console.error(err.stack || err); process.exitCode = 1; });
