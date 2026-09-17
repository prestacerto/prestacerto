const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const userId = 'a3b6c537-bbe3-4d7f-91bc-6b2979174914';
const secret = 'test-only-signing-key-not-for-production';
function setup(options = {}) {
  const mocks = {
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: options.anonymous ? null : { id: userId } } }) } }) },
    '@/lib/payments/assiny-readiness': { isAssinyCheckoutReady: () => !options.disabled },
    '@/lib/rate-limit': {
      rateLimiters: { checkout: {} }, checkRateLimit: async (_limiter, key) => { assert.equal(key, userId); return { success: !options.limited, reset: 1 }; },
      rateLimitResponse: () => Response.json({}, { status: 429 }),
    },
    '@/lib/plans-data': { PLANS: [{ id: 'pro' }, { id: 'business' }], getCheckoutUrl: () => options.url || 'https://pay.assiny.com.br/ba2d4a/node/rtlXli' },
  };
  const cache = {};
  function load(name) {
    if (mocks[name]) return mocks[name];
    if (cache[name]) return cache[name];
    if (!name.startsWith('@/')) return require(name);
    const module = { exports: {} };
    const source = fs.readFileSync('src/' + name.slice(2) + '.ts', 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(js, { module, exports: module.exports, require: load, Response, Buffer, URL, Date, process: { env: { ASSINY_WEBHOOK_SECRET: secret } } });
    return cache[name] = module.exports;
  }
  return { load, api: load('@/app/api/payments/assiny-checkout/route') };
}
const request = (body = { plan: 'pro' }) => new Request('https://prestacerto.com.br/api/payments/assiny-checkout', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});
test('checkout requires authenticated account, configured integration and available quota', async () => {
  for (const [options, status] of [[{ anonymous: true }, 401], [{ disabled: true }, 503], [{ limited: true }, 429]]) {
    assert.equal((await setup(options).api.POST(request())).status, status);
  }
});
test('checkout reference uses the server-verified account, never a submitted user or price', async () => {
  const { api, load } = setup();
  const response = await api.POST(request({ plan: 'pro', user_id: 'someone-else', amount: 1 }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  const url = new URL((await response.json()).url);
  assert.equal(url.origin, 'https://pay.assiny.com.br');
  const reference = url.searchParams.get('utm_content');
  assert.equal(load('@/lib/payments/checkout-reference').verifyCheckoutReference(reference, 'pro', secret, new Date().toISOString()), userId);
});
test('unknown plans, malformed bodies and untrusted payment destinations are rejected', async () => {
  for (const body of [{ plan: 'free' }, { plan: 'unknown' }, null, [], { plan: 'pro', padding: 'x'.repeat(3000) }]) {
    assert.ok((await setup().api.POST(request(body))).status >= 400);
  }
  for (const url of ['https://evil.example/checkout', 'http://pay.assiny.com.br/checkout', 'https://name:secret@pay.assiny.com.br/checkout']) {
    assert.equal((await setup({ url }).api.POST(request())).status, 503);
  }
});
