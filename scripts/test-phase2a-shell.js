'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let failures = 0;

function check(ok, label) {
  if (ok) console.log('✓ ' + label);
  else {
    failures += 1;
    console.error('✗ ' + label);
  }
}

function fragment(start, end) {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from);
  return from >= 0 && to > from ? html.slice(from, to) : '';
}

const welcome = fragment('<div id="welcome"', '<!-- 免責聲明');
check(welcome.includes('每筆消費，都值得有回報'), 'Welcome uses the canonical slogan');
check(!welcome.includes('畝・里') && !welcome.includes('香港里數優化') && !welcome.includes('誠・里'), 'legacy Welcome copy is absent');
check(/setTimeout\(function\(\)\{[\s\S]*__acremilesWelcomeDismiss\(false\)[\s\S]*\}, 900\)/.test(html), 'normal Welcome dismissal starts at 900ms');
check(/__acremilesWelcomeDismiss\(false\); \}, 1600\)/.test(html), 'independent 1600ms Welcome fallback exists');
check(/prefers-reduced-motion:reduce[\s\S]*#welcome/.test(html), 'reduced-motion handling covers Welcome');

const consent = fragment('<div class="modal-bg" id="disclaimer"', '<div class="modal-bg" id="cardDetail"');
check(/role="dialog"[\s\S]*aria-modal="true"[\s\S]*aria-labelledby="dc-title"[\s\S]*aria-describedby="dc-summary"/.test(consent), 'Consent has dialog name and description');
['工具性質', '官方條款會變', '信貸及還款風險', '私隱選擇'].forEach((text) => {
  check(consent.includes(text), 'Consent first layer includes ' + text);
});
check(consent.includes('接受匿名改善並開始') && consent.includes('只限必要'), 'both explicit consent choices remain');
check(html.includes("AcreMilesOverlayScroll.lock('consent')") && html.includes("AcreMilesOverlayScroll.unlock('consent')"), 'Consent uses shared scroll lock');
check(!/closeButton\s*=\s*\{[^}]*disclaimer/.test(html), 'Escape cannot bypass first-run Consent');
check(/#disclaimer\{z-index:1000/.test(html), 'reopened Consent stays above article pages');
check(consent.includes('tabindex="-1"') && html.includes("dialog.focus({preventScroll:true})"), 'Consent focus enters the dialog without moving its scroll position');

const header = fragment('<header class="hdr"', '<nav class="tabs"');
check((header.match(/id="setBtn"/g) || []).length === 1 && header.includes('profile-btn'), 'Header exposes one generic Profile control');
check(header.includes('id="robotBtn"') && header.includes('hidden'), 'FAQ runtime trigger stays hidden from Header');

const hub = fragment('<section class="sheet profile-sheet" id="setSheet"', '<!-- v6.79：儲存計劃');
const orderedHubLabels = ['我的信用卡', '我的旅程', '我的收藏', '跨裝置同步', 'FAQ／小助手', '設定'];
let cursor = -1;
orderedHubLabels.forEach((label) => {
  const next = hub.indexOf(label, cursor + 1);
  check(next > cursor, 'Profile Hub order includes ' + label);
  cursor = next;
});
check(hub.includes('即將推出') && hub.includes('可選功能；現時資料仍只存本機'), 'sync is accurately marked coming soon and local-only');
check(html.includes("AcreMilesOverlayScroll.lock('profile')") && html.includes("AcreMilesOverlayScroll.unlock('profile')"), 'Profile Hub uses shared scroll lock');

const nav = fragment('<nav class="tabs"', '</nav>');
const navLabels = [...nav.matchAll(/data-tab="([^"]+)"[\s\S]*?<span>([^<]+)<\/span>/g)].map((m) => [m[1], m[2]]);
check(JSON.stringify(navLabels) === JSON.stringify([
  ['opt', '點賺'],
  ['redeem', '點用'],
  ['journey', '首頁'],
  ['articles', '優惠'],
  ['guides', '攻略']
]), 'Bottom Navigation IDs, order and labels match canonical mapping');
check(html.includes("setAttribute('aria-current', 'page')"), 'active Bottom Navigation state exposes aria-current');

if (failures) {
  console.error('\nPhase 2A shell checks failed: ' + failures);
  process.exit(1);
}
console.log('\nPhase 2A shell checks passed.');
