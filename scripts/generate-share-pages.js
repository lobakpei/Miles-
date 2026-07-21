#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const meta = require('../share-meta.js');

const root = path.resolve(__dirname, '..');
const shareRoot = path.join(root, 'share');
const origin = 'https://acremiles.app/';

function hongKongToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Hong_Kong', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function jpegDimensions(relativePath) {
  const data = fs.readFileSync(path.join(root, relativePath));
  if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error(`分享圖唔係 JPEG：${relativePath}`);
  const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 8 < data.length) {
    if (data[offset] !== 0xff) { offset += 1; continue; }
    while (data[offset] === 0xff) offset += 1;
    const marker = data[offset++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= data.length) break;
    const length = data.readUInt16BE(offset);
    if (sof.has(marker)) {
      return {height: data.readUInt16BE(offset + 3), width: data.readUInt16BE(offset + 5)};
    }
    if (length < 2) break;
    offset += length;
  }
  throw new Error(`讀唔到分享圖尺寸：${relativePath}`);
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageHtml({title, description, image, canonical, target, dynamic, imageWidth, imageHeight, archived, expire}) {
  const imageUrl = new URL(image, origin).href;
  const redirectScript = dynamic
    ? `var token=location.hash.slice(1);var target='${target}'+(token?encodeURIComponent(token):'');location.replace(target);`
    : `location.replace('${target}');`;
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | AcreMiles</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex,follow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(imageUrl)}">
<meta property="og:image:secure_url" content="${esc(imageUrl)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="${imageWidth}">
<meta property="og:image:height" content="${imageHeight}">
<meta property="og:image:alt" content="${esc(title)}｜AcreMiles 分享縮圖">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="AcreMiles">
<meta property="og:locale" content="zh_HK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(imageUrl)}">
<meta name="twitter:image:alt" content="${esc(title)}｜AcreMiles 分享縮圖">
<link rel="canonical" href="${esc(canonical)}">
<style>body{margin:0;background:#eff2ee;color:#152520;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif}.box{max-width:620px;margin:12vh auto;padding:24px;text-align:center}.logo{width:74px;height:74px;border-radius:18px}.hero{display:block;width:100%;border-radius:18px;margin:18px 0;aspect-ratio:16/9;object-fit:cover}h1{font-size:23px;line-height:1.35}p{color:#5d6e66;line-height:1.65}.cta{display:inline-block;background:#087d88;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:800}.archive-note{background:#e1e4e2;border:2px solid #697670;border-radius:11px;color:#394640;font-weight:800;padding:9px 12px}.archive .hero{filter:grayscale(1);opacity:.58}</style>
<script>${redirectScript}</script>
</head>
<body class="${archived ? 'archive' : ''}"><main class="box"><img class="logo" src="${origin}icon-192.png" alt="AcreMiles">${archived ? `<p class="archive-note">歷史優惠｜已於 ${esc(expire)} 完結</p>` : ''}<img class="hero" src="${esc(imageUrl)}" alt=""><h1>${esc(title)}</h1><p>${esc(description)}</p><a class="cta" href="${esc(target)}">喺 AcreMiles 打開 →</a></main></body>
</html>
`;
}

fs.mkdirSync(shareRoot, {recursive: true});
let count = 0;
const today = hongKongToday();
for (const [pageId, item] of Object.entries(meta)) {
  const dir = path.join(shareRoot, item.slug);
  const canonical = new URL(`share/${item.slug}/`, origin).href;
  const target = `../../?open=${encodeURIComponent(pageId)}`;
  const dimensions = jpegDimensions(item.image);
  const archived = !!item.expire && item.expire < today;
  const publicItem = archived ? {
    ...item,
    title:`歷史優惠｜${item.title}`,
    description:`已於 ${item.expire} 完結；只保留作歷史參考，唔可以按舊優惠申請。`,
    archived:true
  } : item;
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml({...publicItem, canonical, target, dynamic: false, imageWidth: dimensions.width, imageHeight: dimensions.height}));
  count++;
}

const utilityPages = [
  {
    slug: 'itinerary',
    title: '我用 AcreMiles 砌咗條環球行程',
    description: '打開連結就可以載入路線，自己改站、計里數同逐段檢查。',
    image: 'img/og-redeem-itinerary.jpg',
    target: '../../?trip=',
    dynamic: true
  },
  {
    slug: 'plan',
    title: '我用 AcreMiles 計咗個里數計劃',
    description: '免費計大額消費可以點分卡、預計儲到幾多里。',
    image: 'img/og-earn-plan.jpg',
    target: '../../?start=earn',
    dynamic: false
  }
];

for (const item of utilityPages) {
  const dir = path.join(shareRoot, item.slug);
  const canonical = new URL(`share/${item.slug}/`, origin).href;
  const dimensions = jpegDimensions(item.image);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml({...item, canonical, imageWidth: dimensions.width, imageHeight: dimensions.height}));
  count++;
}

console.log(`Generated ${count} social share pages`);
