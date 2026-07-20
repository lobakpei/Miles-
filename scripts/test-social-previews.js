#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const shareMeta = require('../share-meta.js');

const root = path.resolve(__dirname, '..');
const base = (process.argv[2] || 'https://acremiles.app/').replace(/\/?$/, '/');
const userAgents = {
  Facebook: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  WhatsApp: 'WhatsApp/2.24.7'
};

function escRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function metaContent(html, key) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${escRe(key)}["'][^>]+content=["']([^"']*)["']`, 'i');
  const match = html.match(re);
  return match ? match[1] : '';
}

function jpegDimensions(data) {
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

function pagePaths() {
  const shares = Object.values(shareMeta).map(item => `share/${item.slug}/`);
  shares.push('share/itinerary/', 'share/plan/');
  const cards = fs.readdirSync(path.join(root, 'cards')).filter(name => name.endsWith('.html')).map(name =>
    name === 'index.html' ? 'cards/' : `cards/${name}`
  );
  return [...new Set([...shares, ...cards])].sort();
}

async function main() {
  const failures = [];
  const imageChecks = new Map();
  let pageChecks = 0;

  for (const pagePath of pagePaths()) {
    const pageUrl = new URL(pagePath, base).href;
    let firstMeta = null;
    for (const [crawler, userAgent] of Object.entries(userAgents)) {
      const response = await fetch(pageUrl, {headers: {'user-agent': userAgent}, redirect: 'follow'});
      const html = await response.text();
      pageChecks += 1;
      if (!response.ok) {
        failures.push(`${crawler} ${pagePath}: HTTP ${response.status}`);
        continue;
      }
      const values = Object.fromEntries(['og:title','og:description','og:image','og:image:width','og:image:height','og:url'].map(key => [key, metaContent(html, key)]));
      const missing = Object.entries(values).filter(([, value]) => !value).map(([key]) => key);
      if (missing.length) failures.push(`${crawler} ${pagePath}: 缺 ${missing.join(', ')}`);
      if (values['og:image'] && !/^https:\/\//.test(values['og:image'])) failures.push(`${crawler} ${pagePath}: og:image 唔係 HTTPS 絕對網址`);
      if (firstMeta && JSON.stringify(firstMeta) !== JSON.stringify(values)) failures.push(`${crawler} ${pagePath}: crawler 讀到嘅 OG 資料不一致`);
      firstMeta = values;
    }
    if (firstMeta && firstMeta['og:image']) imageChecks.set(pagePath, firstMeta);
  }

  for (const [pagePath, values] of imageChecks) {
    const response = await fetch(values['og:image'], {headers: {'user-agent': userAgents.Facebook}});
    if (!response.ok) {
      failures.push(`${pagePath}: 分享圖 HTTP ${response.status}`);
      continue;
    }
    const type = response.headers.get('content-type') || '';
    if (!/^image\//.test(type)) failures.push(`${pagePath}: 分享圖 Content-Type 係 ${type || '空白'}`);
    const data = Buffer.from(await response.arrayBuffer());
    const dimensions = jpegDimensions(data);
    if (!dimensions) {
      failures.push(`${pagePath}: 讀唔到 JPEG 尺寸`);
      continue;
    }
    if (String(dimensions.width) !== values['og:image:width'] || String(dimensions.height) !== values['og:image:height']) {
      failures.push(`${pagePath}: OG 寫 ${values['og:image:width']}×${values['og:image:height']}，實圖係 ${dimensions.width}×${dimensions.height}`);
    }
  }

  console.log(`Social preview crawler QA: ${pageChecks} 個頁面回應；${imageChecks.size} 張預覽圖`);
  failures.forEach(message => console.log(`❌ ${message}`));
  console.log(failures.length ? `結果：${failures.length} 個問題` : '結果：全部通過');
  if (failures.length) process.exitCode = 1;
}

main().catch(error => {
  console.error(`❌ Social preview QA 無法執行：${error.message}`);
  process.exitCode = 1;
});
