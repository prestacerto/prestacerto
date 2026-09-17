const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function mount({ loaded = false, idleSupported = true, supported = true, environment = 'production' } = {}) {
  const handlers = new Map();
  const scheduled = new Map();
  const registrations = [];
  const state = [];
  let cleanup;
  let nextId = 1;
  const schedule = (callback) => { const id = nextId++; scheduled.set(id, callback); return id; };
  const window = {
    addEventListener: (event, callback) => handlers.set(event, callback),
    removeEventListener: (event, callback) => { if (handlers.get(event) === callback) handlers.delete(event); },
    setTimeout: schedule,
    clearTimeout: (id) => scheduled.delete(id),
    ...(idleSupported ? { requestIdleCallback: schedule, cancelIdleCallback: (id) => scheduled.delete(id) } : {}),
  };
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/components/pwa-installer.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, window, document: { readyState: loaded ? 'complete' : 'loading' }, console,
    process: { env: { NODE_ENV: environment } },
    navigator: supported ? { serviceWorker: { register: async (url) => { registrations.push(url); } } } : {},
    require(name) {
      if (name === 'react') return {
        useEffect: (effect) => { cleanup = effect(); },
        useState: (initial) => [initial, (value) => state.push(value)],
      };
      if (name === 'react/jsx-runtime') return { jsx() {}, jsxs() {} };
      if (name === 'lucide-react' || name === '@/components/ui/button') return {};
      throw new Error(name);
    },
  });
  module.exports.PWAInstaller();
  const flush = () => { for (const [id, callback] of scheduled) { scheduled.delete(id); callback(); } };
  return { handlers, scheduled, registrations, state, cleanup: () => cleanup?.(), flush };
}

test('development does not register a worker that caches changing asset URLs', () => {
  const app = mount({ loaded: true, environment: 'development' });
  app.flush();
  assert.deepEqual(app.registrations, []);
  assert.equal(app.handlers.size, 0);
  app.cleanup();
});

test('service worker waits for page load and idle while install events remain available', () => {
  const app = mount();
  assert.deepEqual(app.registrations, []);
  assert.equal(app.scheduled.size, 0);
  let prevented = false;
  const event = { preventDefault() { prevented = true; } };
  app.handlers.get('beforeinstallprompt')(event);
  assert.equal(prevented, true);
  assert.deepEqual(app.state, [event, true]);
  app.handlers.get('load')();
  assert.deepEqual(app.registrations, []);
  app.flush();
  assert.deepEqual(app.registrations, ['/service-worker.js']);
});

test('already loaded pages register asynchronously, including browsers without idle callbacks', () => {
  for (const idleSupported of [true, false]) {
    const app = mount({ loaded: true, idleSupported });
    assert.deepEqual(app.registrations, []);
    app.flush();
    assert.deepEqual(app.registrations, ['/service-worker.js']);
  }
});

test('unmount cancels pending registration and install listeners', () => {
  for (const loaded of [true, false]) {
    const app = mount({ loaded });
    app.cleanup();
    app.flush();
    assert.deepEqual(app.registrations, []);
    assert.equal(app.handlers.size, 0);
  }
});

test('unsupported browsers keep install handling without attempting service worker registration', () => {
  const app = mount({ supported: false, loaded: true });
  app.flush();
  assert.deepEqual(app.registrations, []);
  assert.equal(app.scheduled.size, 0);
});
