const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(results) {
  const calls = [];
  const module = { exports: {} };
  const context = {
    module, exports: module.exports, AbortSignal, console: { error() {} },
    require(name) {
      if (name === 'server-only') return {};
      if (name === './config') return { SUPABASE_URL: 'https://catalogue.example.test' };
      if (name === 'next/cache') return { unstable_cache(fn, key, options) {
        calls.push({ key, options });
        let stored;
        return async () => stored ?? (stored = await fn());
      } };
      if (name === './public') return { createPublicClient() {
        calls.push('anonymous client');
        const q = {
          from(value) { calls.push(['from', value]); return q; },
          select(value) { calls.push(['select', value]); return q; },
          order() { return q; },
          abortSignal(signal) { assert.ok(signal instanceof AbortSignal); return Promise.resolve(results.shift()); },
        };
        return q;
      } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  };
  const source = ts.transpileModule(fs.readFileSync('src/lib/supabase/categories.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, context);
  return { get: module.exports.getPublicCategories, calls };
}

test('shared catalogue uses only anonymous public fields and a bounded project-specific cache', async () => {
  const data = [{ id: 1, slug: 'design', name: 'Design', sort_order: 1 }];
  const app = setup([{ data, error: null }]);
  assert.equal(await app.get(), data);
  assert.equal(await app.get(), data);
  assert.equal(app.calls.filter(v => v === 'anonymous client').length, 1);
  assert.equal(app.calls[0].options.revalidate, 300);
  assert.ok(app.calls[0].key.includes('https://catalogue.example.test'));
  assert.deepEqual(app.calls.find(v => Array.isArray(v) && v[0] === 'select'), ['select', 'id, slug, name, sort_order']);
});

test('a database failure does not poison the successful category cache', async () => {
  const data = [{ id: 2, slug: 'web', name: 'Web', sort_order: 2 }];
  const app = setup([{ data: null, error: { code: 'timeout' } }, { data, error: null }]);
  assert.equal((await app.get()).length, 0);
  assert.equal(await app.get(), data);
  assert.equal(await app.get(), data);
  assert.equal(app.calls.filter(v => v === 'anonymous client').length, 2);
});
