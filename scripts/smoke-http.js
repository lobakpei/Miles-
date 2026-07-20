'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const base = new URL(process.argv[2] || 'http://127.0.0.1:4173/');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const targets = new Set(['./', './index.html', './share-meta.js', './manifest.json', './sw.js', './robots.txt', './sitemap.xml']);

function collect(text, regex) {
  let match;
  while ((match = regex.exec(text))) targets.add(match[1]);
}

collect(index, /(?:src|href)=["']((?:\.\/)?(?:img\/|cards\/|share\/|share-meta\.js|manifest\.json|icon-[^"']+|apple-touch-icon\.png)[^"']*)["']/g);
collect(index, /\bimg\s*:\s*["']((?:\.\/)?img\/[^"']+)["']/g);
collect(sw, /["']((?:\.\/)?(?:img\/|share\/|share-meta\.js|manifest\.json|icon-[^"']+|apple-touch-icon\.png)[^"']*)["']/g);

for (const name of fs.readdirSync(path.join(root, 'cards')).filter(n => n.endsWith('.html'))) {
  targets.add('./cards/' + name);
}

for (const dir of fs.readdirSync(path.join(root, 'share'))) {
  if (fs.existsSync(path.join(root, 'share', dir, 'index.html'))) targets.add('./share/' + dir + '/');
}

(async () => {
  const failures = [];
  for (const target of targets) {
    const url = new URL(target, base);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) failures.push(`${response.status} ${url.pathname}`);
      else await response.arrayBuffer();
    } catch (error) {
      failures.push(`${url.pathname}: ${error.message}`);
    }
  }
  console.log(`HTTP smoke: ${targets.size - failures.length}/${targets.size} paths OK`);
  if (failures.length) {
    failures.forEach(failure => console.error('FAIL ' + failure));
    process.exit(1);
  }
})();
