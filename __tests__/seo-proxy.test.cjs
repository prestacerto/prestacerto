/* eslint-disable @typescript-eslint/no-require-imports -- Loads the real proxy in isolation to verify redirect boundaries. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { NextRequest, NextResponse } = require('next/server');
test('one proxy entry is colocated with the active Next app to prevent shadowing', () => {
  const { appDir } = require('next/dist/lib/find-pages-dir').findPagesDir(process.cwd());
  const expected = path.join(path.dirname(appDir), 'proxy.ts');
  const entries = ['proxy.ts', 'src/proxy.ts'].map(p => path.resolve(p)).filter(p => fs.existsSync(p));
  assert.deepEqual(entries, [expected]);
});
function setup() {
  const delegated = [];
  const proxyModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('src/proxy.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { module: proxyModule, exports: proxyModule.exports, require(name) {
    if (name === 'next/server') return { NextResponse };
    if (name === '@/lib/supabase/session') return { updateSession(request) { delegated.push(request); return NextResponse.next(); } };
    throw new Error(`Unexpected dependency: ${name}`);
  } });
  return { proxy: proxyModule.exports.proxy, delegated };
}
test('www navigation redirects permanently to the apex with path and query preserved', () => {
  for (const method of ['GET', 'HEAD']) {
    const { proxy, delegated } = setup();
    const response = proxy(new NextRequest('https://www.prestacerto.com.br/contratar/mobile?cidade=sao-paulo&utm_source=teste', { method }));
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://prestacerto.com.br/contratar/mobile?cidade=sao-paulo&utm_source=teste');
    assert.equal(delegated.length, 0);
  }
});
test('mutations, the apex, preview deployments and similar hostnames keep the existing session behavior', () => {
  for (const [url, method] of [
    ['https://www.prestacerto.com.br/api/auth/logout', 'POST'],
    ['https://www.prestacerto.com.br/api/webhooks/assiny', 'POST'],
    ['https://www.prestacerto.com.br/api/example', 'DELETE'],
    ['https://prestacerto.com.br/login?next=%2Fdashboard', 'GET'],
    ['https://prestacerto-preview.vercel.app/', 'GET'],
    ['https://www.prestacerto.com.br.evil.example/', 'GET'],
  ]) {
    const { proxy, delegated } = setup();
    const request = new NextRequest(url, { method });
    const response = proxy(request);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
    assert.equal(delegated[0], request);
  }
});

test('service rewrites retain canonical navigation using the external forwarded host', () => {
  for (const headers of [{ 'x-forwarded-host': 'www.prestacerto.com.br', host: 'internal.vercel.app' }, { host: 'www.prestacerto.com.br:443' }]) {
    const { proxy, delegated } = setup();
    const request = new NextRequest('https://internal.vercel.app/services?q=design', { headers });
    const response = proxy(request);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://prestacerto.com.br/services?q=design');
    assert.equal(delegated.length, 0);
  }
  const { proxy, delegated } = setup();
  const response = proxy(new NextRequest('https://internal.vercel.app/api/auth/logout', { method: 'POST', headers: { 'x-forwarded-host': 'www.prestacerto.com.br' } }));
  assert.equal(response.status, 200);
  assert.equal(delegated.length, 1);
});
