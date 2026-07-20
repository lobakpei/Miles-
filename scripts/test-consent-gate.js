'use strict';

const fs = require('fs');
const vm = require('vm');

const file = process.argv[2] || 'index.html';
const source = fs.readFileSync(file, 'utf8');
const scripts = [...source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map(match => match[2]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function storage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

function testSentry() {
  const block = scripts.find(script => script.includes('var SENTRY_DSN'));
  assert(block, 'Sentry block not found');
  const appended = [];
  const localStorage = storage();
  const context = {
    localStorage,
    location: { hostname: 'acremiles.app', protocol: 'https:' },
    document: {
      getElementById: () => null,
      createElement: () => ({}),
      head: { appendChild: element => appended.push(element) }
    }
  };
  context.window = context;
  vm.runInNewContext(block, context);
  assert(appended.length === 0, 'Sentry loaded without consent');

  localStorage.setItem('bm_consent', JSON.stringify({ analytics: true }));
  context.loadAcreMilesDiagnostics();
  assert(appended.length === 1 && /sentry-cdn\.com/.test(appended[0].src), 'Sentry did not load after consent');

  let options = null;
  let closed = false;
  context.Sentry = {
    init: value => { options = value; },
    close: () => { closed = true; }
  };
  appended[0].onload();
  assert(options && options.sendDefaultPii === false && typeof options.beforeSend === 'function', 'Sentry privacy options missing');
  localStorage.setItem('bm_consent', JSON.stringify({ analytics: false }));
  assert(options.beforeSend({ request: {} }) === null, 'Sentry event allowed after consent revoked');
  context.disableAcreMilesDiagnostics();
  assert(closed, 'Sentry client was not closed');
}

function testGA() {
  const ui = scripts.find(script => script.includes("var GA_ID = 'G-"));
  assert(ui, 'GA block not found');
  const start = ui.indexOf('var GA_ID');
  const end = ui.indexOf('function syncAna', start);
  assert(start >= 0 && end > start, 'GA functions could not be extracted');
  const snippet = ui.slice(start, end);
  const appended = [];
  let consent = null;
  let diagnosticsStopped = false;
  const context = {
    Date,
    store: { get: key => key === 'bm_consent' ? consent : null },
    document: {
      createElement: () => ({}),
      head: { appendChild: element => appended.push(element) }
    },
    disableAcreMilesDiagnostics: () => { diagnosticsStopped = true; }
  };
  context.window = context;
  vm.runInNewContext(snippet, context);
  context.loadGA();
  assert(appended.length === 0, 'GA loaded without consent');

  consent = { analytics: true };
  context.loadGA();
  assert(appended.length === 1 && /googletagmanager\.com/.test(appended[0].src), 'GA did not load after consent');
  context.stopDiagnostics();
  const calls = context.dataLayer.map(args => Array.from(args));
  assert(calls.some(call => call[0] === 'consent' && call[1] === 'update' && call[2].analytics_storage === 'denied'), 'GA denied update missing');
  assert(diagnosticsStopped, 'Sentry stop hook missing from shared stop function');

  context.loadGA();
  const updated = context.dataLayer.map(args => Array.from(args));
  assert(updated.some(call => call[0] === 'consent' && call[1] === 'update' && call[2].analytics_storage === 'granted'), 'GA did not re-enable in same session');
}

testSentry();
testGA();
console.log('Consent gate runtime tests: OK');
