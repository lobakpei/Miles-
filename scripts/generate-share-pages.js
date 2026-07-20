#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const meta = require('../share-meta.js');

const root = path.resolve(__dirname, '..');
const shareRoot = path.join(root, 'share');
const origin = 'https://acremiles.app/';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pageHtml({title, description, image, canonical, target, dynamic}) {
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
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="720">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:site_name" content="AcreMiles">
<meta property="og:locale" content="zh_HK">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(imageUrl)}">
<link rel="canonical" href="${esc(canonical)}">
<style>body{margin:0;background:#eff2ee;color:#152520;font-family:-apple-system,BlinkMacSystemFont,"PingFang HK",sans-serif}.box{max-width:620px;margin:12vh auto;padding:24px;text-align:center}.logo{width:74px;height:74px;border-radius:18px}.hero{display:block;width:100%;border-radius:18px;margin:18px 0;aspect-ratio:16/9;object-fit:cover}h1{font-size:23px;line-height:1.35}p{color:#5d6e66;line-height:1.65}.cta{display:inline-block;background:#087d88;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:800}</style>
<script>${redirectScript}</script>
</head>
<body><main class="box"><img class="logo" src="${origin}icon-192.png" alt="AcreMiles"><img class="hero" src="${esc(imageUrl)}" alt=""><h1>${esc(title)}</h1><p>${esc(description)}</p><a class="cta" href="${esc(target)}">喺 AcreMiles 打開 →</a></main></body>
</html>
`;
}

fs.mkdirSync(shareRoot, {recursive: true});
let count = 0;
for (const [pageId, item] of Object.entries(meta)) {
  const dir = path.join(shareRoot, item.slug);
  const canonical = new URL(`share/${item.slug}/`, origin).href;
  const target = `../../?open=${encodeURIComponent(pageId)}`;
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml({...item, canonical, target, dynamic: false}));
  count++;
}

const utilityPages = [
  {
    slug: 'itinerary',
    title: '我用 AcreMiles 砌咗條環球行程',
    description: '打開連結就可以載入路線，自己改站、計里數同逐段檢查。',
    image: 'img/pgW0-hero.jpg',
    target: '../../?trip=',
    dynamic: true
  },
  {
    slug: 'plan',
    title: '我用 AcreMiles 計咗個里數計劃',
    description: '免費計大額消費可以點分卡、預計儲到幾多里。',
    image: 'img/pgG2-cards.jpg',
    target: '../../?start=earn',
    dynamic: false
  }
];

for (const item of utilityPages) {
  const dir = path.join(shareRoot, item.slug);
  const canonical = new URL(`share/${item.slug}/`, origin).href;
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'index.html'), pageHtml({...item, canonical}));
  count++;
}

console.log(`Generated ${count} social share pages`);
