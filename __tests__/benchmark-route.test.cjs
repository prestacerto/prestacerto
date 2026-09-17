const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(options = {}) {
  const calls = [], cache = {};
  const now = new Date().toISOString();
  const defaultRows = [1000, 1200, 1400, 1800].map(proposed_price => ({ proposed_price, city: 'São Paulo', state: 'SP', category: 1, status: 'accepted', created_at: now }));
  const database = {
    from(table) {
      calls.push(table); const filters = [];
      const query = {
        select() { return query; },
        eq(column, value) { filters.push([column, value]); return query; },
        ilike(column, value) { filters.push([column, value]); return query; },
        gt() { return query; }, gte(column, value) { filters.push([column, value]); return query; }, order() { return query; }, limit() { return query; },
        maybeSingle: async () => ({ data: options.missingCategory ? null : { id: 1 }, error: options.categoryError ? { message: 'offline' } : null }),
        then(resolve, reject) {
          const data = (options.rows ?? defaultRows).filter(row => filters.every(([column, value]) => {
            if (column === 'created_at') return row.created_at >= value;
            const key = { status: 'status', 'projects.category_id': 'category', 'freelancer.city': 'city', 'freelancer.state': 'state' }[column];
            return !key || String(row[key]).toLowerCase() === String(value).toLowerCase();
          }));
          return Promise.resolve({ data, error: options.queryError ? { message: 'query failed' } : null }).then(resolve, reject);
        },
      }; return query;
    },
  };
  function load(name) {
    if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
    if (name === '@/lib/supabase/service') return { createServiceClient() { calls.push('client'); if (options.noCredentials) throw new Error('missing'); return database; } };
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/${name.slice(2)}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module, exports: module.exports, require: load, Response, Request, Buffer, console: { error() {} } });
    return cache[name] = module.exports;
  }
  const route = load('@/app/api/benchmark/route');
  const { CATEGORIAS } = load('@/lib/data/landing-data');
  const body = { categoria: Object.keys(CATEGORIAS)[0], cidade: 'sao-paulo', seuPreco: 1500 };
  const post = value => route.POST(new Request('http://localhost/api/benchmark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) }));
  return { post, route, body, calls, rows: defaultRows };
}

test('benchmark validates malformed and unsupported inputs before touching storage', async () => {
  const { post, route, body, calls } = setup();
  for (const input of [null, [], {}, { ...body, categoria: '__proto__' }, { ...body, cidade: 'unknown' }, ...[0, -1, null, '1500', 1e20].map(seuPreco => ({ ...body, seuPreco }))]) assert.equal((await post(input)).status, 400);
  assert.equal((await route.POST(new Request('http://localhost/api/benchmark', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.deepEqual(calls, []);
});
test('zero, one or two accepted proposals return insufficient data with no synthetic price statistics', async () => {
  const baseline = setup();
  for (const rows of [[], baseline.rows.slice(0, 1), baseline.rows.slice(0, 2)]) {
    const { post, body } = setup({ rows }); const response = await post(body);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { available: false, sampleSize: rows.length, minSampleSize: 3 });
  }
});
test('benchmark uses accepted proposals from the selected city and state, without leaking individual records', async () => {
  const baseline = setup();
  const unrelated = [
    { ...baseline.rows[0], city: 'Rio de Janeiro' }, { ...baseline.rows[0], state: 'PR' },
    { ...baseline.rows[0], status: 'pending' }, { ...baseline.rows[0], category: 2 },
    { ...baseline.rows[0], created_at: '2020-01-01T00:00:00Z' },
  ].map(row => ({ ...row, proposed_price: 90000 }));
  const { post, body } = setup({ rows: [...baseline.rows, ...unrelated] });
  const response = await post(body); assert.equal(response.status, 200);
  const result = await response.json();
  assert.deepEqual(result, { available: true, sampleSize: 4, mediana: 1300, p25: 1200, p75: 1800, comparacao: ((1500 - 1300) / 1300) * 100 });
});
test('database failures and missing credentials return unavailable, never fabricated estimates', async () => {
  for (const options of [{ categoryError: true }, { queryError: true }, { noCredentials: true }]) {
    const { post, body } = setup(options); const response = await post(body);
    assert.equal(response.status, 503); const result = await response.json(); assert.match(result.error, /Não foi possível/); assert.equal(result.mediana, undefined);
  }
});
test('a category with no records has no fabricated benchmark', async () => {
  const { post, body } = setup({ missingCategory: true });
  assert.deepEqual(await (await post(body)).json(), { available: false, sampleSize: 0, minSampleSize: 3 });
});
