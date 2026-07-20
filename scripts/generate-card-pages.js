'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cardsDir = path.join(root, 'cards');
const origin = 'https://acremiles.app/';
const dataDate = '2026-07-20';

const fileById = {
  'sc-cathay': 'scb-cathay-mastercard.html',
  'hsbc-everymile': 'hsbc-everymile.html',
  'citi-pm': 'citi-premiermiles.html',
  'citi-prestige': 'citi-prestige.html',
  'dbs-black': 'dbs-black-world-mastercard.html',
  'amex-explorer': 'ae-explorer.html',
  'amex-platinum': 'ae-platinum-card.html',
  'dahsing-ba': 'dahsing-ba-platinum.html',
  'hsbc-visasig': 'hsbc-visa-signature.html'
};

const imageById = {
  'sc-cathay': 'img/pgO1-hero.jpg',
  'hsbc-everymile': 'img/pgO2-hero.jpg',
  'amex-platinum': 'img/pgO3-hero.jpg',
  'amex-explorer': 'img/pgO4-hero.jpg'
};

function esc(value) {
  return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function fmt(value) {
  return Math.round(Number(value) || 0).toLocaleString('en-US');
}

function loadCards() {
  const html = fs.readFileSync(indexPath, 'utf8');
  const match = html.match(/<script id="bm-core">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('bm-core script not found');
  const context = {console};
  vm.createContext(context);
  vm.runInContext(match[1], context, {filename: 'bm-core.js'});
  if (!context.BM || !Array.isArray(context.BM.DEFAULT_CARDS)) throw new Error('card data not found');
  return context.BM.DEFAULT_CARDS.filter(card => fileById[card.id]);
}

function programName(program) {
  return program === 'am' ? 'Asia Miles' : (program === 'avios' ? 'Avios' : '彈性里數計劃');
}

function welcomeHtml(card) {
  const w = card.welcome || {};
  if (w.expired) {
    return `<p class="notice amber"><b>迎新暫停計算。</b>${esc(w.expiredNote || '上一期已完，等銀行公布新一期正式條款。')}</p>`;
  }
  if (w.type === 'feePurchase') {
    return `<p class="notice"><b>交年費形式：</b>首年年費 HK$${fmt(w.fee)}，按現有條款可得約 ${fmt(w.miles)} 里；唔當成免費迎新。</p>`;
  }
  if (!Array.isArray(w.tiers) || !w.tiers.length) return '<p>暫時冇可計入嘅迎新。</p>';
  const rows = w.tiers.map((tier, index) => `<tr><td>第 ${index + 1} 級</td><td>累積簽 HK$${fmt(tier.spend)}</td><td>${fmt(tier.miles)} 里</td></tr>`).join('');
  return `<table><thead><tr><th>級別</th><th>達標條件</th><th>累積里數</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="small">限期：批卡後 ${esc(w.months)} 個月${w.deadline ? `；申請截止 ${esc(w.deadline)}` : ''}。</p>
    ${w.prereq ? `<p class="notice amber"><b>重要條件：</b>${esc(w.prereq)}</p>` : ''}`;
}

function rateRows(card) {
  const rows = [
    ['本地一般簽賬', card.rateLocal, ''],
    ['網上簽賬', card.rateOnline, '']
  ];
  const overseas = card.cat && card.cat.overseas;
  if (overseas && typeof overseas === 'object') {
    rows.push(['外幣優惠率', overseas.rate, `每月首 HK$${fmt(overseas.capMonthly)}；之後 HK$${fmt(overseas.excessRate)}/里`]);
  } else {
    rows.push(['外幣簽賬', card.rateOverseas, '']);
  }
  const labels = {dining: '食肆', groceries: '超市', transport: '交通', online: '網購'};
  Object.keys(card.cat || {}).forEach(key => {
    if (key === 'overseas') return;
    const value = card.cat[key];
    const rate = typeof value === 'object' ? value.rate : value;
    const condition = typeof value === 'object' && value.capMonthly ? `每月首 HK$${fmt(value.capMonthly)}` : '';
    rows.push([labels[key] || key, rate, condition]);
  });
  return rows.map(([label, rate, condition]) => `<tr><td>${esc(label)}</td><td><b>HK$${fmt(rate)}/里</b></td><td>${esc(condition || '—')}</td></tr>`).join('');
}

function sourcesHtml(card) {
  const docs = Array.isArray(card.sourceDocs) ? card.sourceDocs : [];
  return docs.map(doc => `<a href="${esc(doc.url)}" target="_blank" rel="noopener">${esc(doc.label)} ↗</a>`).join('');
}

function renderCard(card) {
  const file = fileById[card.id];
  const canonical = new URL(`cards/${file}`, origin).href;
  const image = new URL(imageById[card.id] || 'img/pgG2-cards.jpg', origin).href;
  const title = `${card.name}｜迎新、賺里率、年費｜AcreMiles`;
  const desc = `${card.name} 官方資料快覽：迎新、賺里率、年費、申請門檻同銀行原文連結。`;
  const firstFee = card.annualFeeFirst || 0;
  const status = card.verified
    ? '<span class="badge good">✓ 可進入推薦</span>'
    : '<span class="badge warn">⚠ 只供參考，暫不進入推薦</span>';
  const capNotes = [];
  if (card.capMonthly) capNotes.push(`每月優惠簽賬上限 HK$${fmt(card.capMonthly)}`);
  if (card.capQuarterly) capNotes.push(`每季優惠簽賬上限 HK$${fmt(card.capQuarterly)}`);
  if (card.capTotal) capNotes.push(`計劃期優惠簽賬上限 HK$${fmt(card.capTotal)}`);

  return `<!doctype html>
<html lang="zh-Hant-HK">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(desc)}">
<title>${esc(title)}</title>
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1280"><meta property="og:image:height" content="720">
<meta property="og:type" content="article"><meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="AcreMiles"><meta property="og:locale" content="zh_HK">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(image)}">
<style>
:root{--jade:#0e6e85;--jade-dark:#075768;--gold:#795100;--ink:#14231f;--mut:#586961;--paper:#f2f5f2;--card:#fff;--line:#d6ded8;--soft:#e4f2f3;--amber:#fff4d5}
*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"PingFang HK","Microsoft JhengHei",sans-serif;background:var(--paper);color:var(--ink);margin:0;line-height:1.65}header{background:linear-gradient(145deg,#063640,var(--jade-dark));color:#fff;padding:22px 16px}header div,main,footer{max-width:760px;margin:auto}header a{color:#d9eff2;text-decoration:none}h1{font-size:clamp(24px,6vw,34px);line-height:1.25;margin:12px 0 5px}.sub{color:#cfe4e6;margin:0}.badge{display:inline-block;border-radius:999px;font-size:12px;font-weight:800;padding:5px 9px;margin-top:12px}.good{background:#d9f3e9;color:#07573f}.warn{background:#fff0c7;color:#704a00}main{padding:18px 14px 34px}section{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:15px;margin:0 0 14px}h2{font-size:18px;color:var(--jade-dark);margin:0 0 10px}table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}th{background:var(--soft)}.facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.fact{background:var(--soft);border-radius:10px;padding:9px 10px}.fact small{display:block;color:var(--mut)}.notice{background:var(--soft);border-radius:10px;padding:10px 12px}.amber{background:var(--amber)}.small{font-size:12.5px;color:var(--mut)}.links{display:flex;flex-wrap:wrap;gap:8px}.links a{border:1px solid var(--jade);border-radius:999px;color:var(--jade-dark);font-size:12.5px;font-weight:800;padding:6px 10px;text-decoration:none}.share{width:100%;border:0;border-radius:12px;background:var(--jade);color:#fff;font:inherit;font-weight:850;padding:12px;cursor:pointer;margin-bottom:14px}.share:focus-visible,a:focus-visible{outline:3px solid #ffcb45;outline-offset:2px}footer{padding:0 16px 30px;color:var(--mut);font-size:12px;text-align:center}@media(max-width:520px){.facts{grid-template-columns:1fr}table{font-size:12.5px}section{padding:13px;overflow-x:auto}}
</style>
</head>
<body>
<header><div><a href="../">← 返回 AcreMiles 規劃器</a><h1>${esc(card.name)}</h1><p class="sub">${esc(card.bank)} · ${esc(programName(card.program))} · 官方資料快覽</p>${status}</div></header>
<main>
<button class="share" id="sharePage" type="button">分享呢份卡資料</button>
<section><h2>一眼睇重點</h2><div class="facts">
<div class="fact"><small>最低年薪</small><b>HK$${fmt(card.minIncome)}</b>${card.incomeVerified ? '' : '（待完整核實）'}</div>
<div class="fact"><small>首年年費</small><b>${firstFee ? `HK$${fmt(firstFee)}` : '豁免'}</b></div>
<div class="fact"><small>其後年費</small><b>HK$${fmt(card.feeRenewal)}</b></div>
<div class="fact"><small>批核時間估算</small><b>約 ${fmt(card.applyWeeks)} 星期</b></div>
</div>${capNotes.length ? `<p class="small">${esc(capNotes.join('；'))}。超過優惠上限會按基本率計。</p>` : ''}</section>
<section><h2>迎新</h2>${welcomeHtml(card)}</section>
<section><h2>賺里率</h2><table><thead><tr><th>類別</th><th>每里所需簽賬</th><th>主要上限／條件</th></tr></thead><tbody>${rateRows(card)}</tbody></table></section>
<section><h2>年費與提醒</h2><p>${esc(card.waiveNote || (card.feeWaivable ? '年費有機會豁免，請向銀行確認。' : '年費不可豁免。'))}</p><p>${esc(card.note || '')}</p></section>
<section><h2>銀行官方原文</h2><div class="links">${sourcesHtml(card)}</div><p class="small">AcreMiles 最後核對：${esc(card.sourceVerifiedAt || dataDate)}。限時迎新、商戶名單同條款會變，申請當日請再開銀行頁確認。</p></section>
</main>
<footer>資料只供比較，唔係財務建議。借定唔借？還得到先好借！AcreMiles 暫時冇 referral 收益。</footer>
<script>(function(){var b=document.getElementById('sharePage');function copy(v){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(function(){b.textContent='已複製連結 ✓';setTimeout(function(){b.textContent='分享呢份卡資料';},1800);},function(){window.prompt('複製呢條連結：',v);});}else window.prompt('複製呢條連結：',v);}b.addEventListener('click',function(){var v={title:document.title,text:'AcreMiles 信用卡官方資料快覽；申請前記得再對銀行最新條款。',url:location.href.split('#')[0]};if(navigator.share){navigator.share(v).catch(function(e){if(!e||e.name!=='AbortError')copy(v.text+' '+v.url);});}else copy(v.text+' '+v.url);});})();</script>
</body></html>`;
}

function renderIndex(cards) {
  const items = cards.map(card => `<li><a href="./${esc(fileById[card.id])}">${esc(card.name)}</a><span>${card.verified ? '可進入推薦' : '只供參考'}</span></li>`).join('');
  return `<!doctype html><html lang="zh-Hant-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="香港主流里數信用卡官方資料快覽。"><title>AcreMiles 信用卡資料庫</title><link rel="canonical" href="${origin}cards/"><meta property="og:title" content="AcreMiles 信用卡資料庫"><meta property="og:description" content="香港主流里數信用卡迎新、賺里率、年費同銀行官方原文。"><meta property="og:image" content="${origin}img/pgG2-cards.jpg"><meta property="og:type" content="website"><meta property="og:url" content="${origin}cards/"><meta name="twitter:card" content="summary_large_image"><style>body{font-family:-apple-system,BlinkMacSystemFont,"PingFang HK","Microsoft JhengHei",sans-serif;background:#f2f5f2;color:#14231f;margin:0;line-height:1.6}header{background:#075768;color:#fff;padding:22px 16px}header div,main,footer{max-width:720px;margin:auto}header a{color:#d9eff2;text-decoration:none}h1{margin:10px 0 3px}main{padding:18px 14px}ul{list-style:none;padding:0}li{display:flex;justify-content:space-between;gap:12px;background:#fff;border:1px solid #d6ded8;border-radius:12px;padding:12px 14px;margin-bottom:9px}li a{color:#075768;font-weight:800}li span{color:#586961;font-size:12px;white-space:nowrap}footer{color:#586961;font-size:12px;padding:0 16px 30px;text-align:center}</style></head><body><header><div><a href="../">← 返回 AcreMiles 規劃器</a><h1>AcreMiles 信用卡資料庫</h1><p>由主卡庫產生，避免 App 同分享頁各自一套數。</p></div></header><main><ul>${items}</ul><p>銀行優惠變得快；每張卡頁都有產品頁、KFS 同條款原文，申請當日請再確認。</p></main><footer>更新：${dataDate}。借定唔借？還得到先好借！</footer></body></html>`;
}

const cards = loadCards();
fs.mkdirSync(cardsDir, {recursive: true});
cards.forEach(card => fs.writeFileSync(path.join(cardsDir, fileById[card.id]), renderCard(card), 'utf8'));
fs.writeFileSync(path.join(cardsDir, 'index.html'), renderIndex(cards), 'utf8');
console.log(`Generated ${cards.length} card pages and card index from bm-core`);
