'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '..', 'index.html');
const version = process.argv[2];
const buildDate = process.argv[3];
const summary = process.argv.slice(4).join(' ');

if (!/^v\d+\.\d+\.\d+$/.test(version || '') || !/^\d{4}-\d{2}-\d{2}$/.test(buildDate || '') || !summary) {
  console.error('Usage: node scripts/update-build-marker.js vX.Y.Z YYYY-MM-DD "summary"');
  process.exit(1);
}

const source = fs.readFileSync(indexPath, 'utf8');
const firstBreak = source.indexOf('\n');
if (firstBreak < 0 || !source.startsWith('<!-- build:')) {
  console.error('index.html build marker not found on first line');
  process.exit(1);
}

const marker = `<!-- build: ${buildDate} UK — ${version}：${summary} -->`;
fs.writeFileSync(indexPath, marker + source.slice(firstBreak), 'utf8');
console.log(marker);
