/* eslint-disable @typescript-eslint/no-require-imports -- This CommonJS test loads the route with mocked dependencies. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');
const origin = 'https://prestacerto.com.br';

function setup({ error = null, throws = false } = {}) {
  const calls = [];
  const routeModule = { exports: {} };
  const source = fs.readFileSync('src/app/api/auth/logout/route.ts', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, {
    module: routeModule, exports: routeModule.exports, URL,
    require(name) {
      if (name === 'next/server') return { NextResponse };
      if (name === '@/lib/supabase/config') return { SUPABASE_URL: 'https://project.supabase.co', SUPABASE_ANON_KEY: 'public-key' };
      if (name === '@supabase/ssr') return { createServerClient(_url, _key, options) {
        calls.push({ operation: 'client', cookies: options.cookies.getAll() });
        return { auth: { async signOut(arg) {
          calls.push({ operation: 'signOut', scope: arg.scope });
          if (throws) throw new Error('Network failed');
          if (!error) options.cookies.setAll([{ name: 'sb-project-auth-token.0', value: '', options: { maxAge: 0, path: '/', sameSite: 'lax' } }, { name: 'sb-project-auth-token.1', value: '', options: { maxAge: 0, path: '/', sameSite: 'lax' } }]);
          return { error };
        } } };
      } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return { handlers: routeModule.exports, calls };
}

function request(headers = { origin, 'sec-fetch-site': 'same-origin' }) {
  return { url: `${origin}/api/auth/logout`, headers: new Headers(headers), cookies: { getAll: () => [{ name: 'sb-project-auth-token.0', value: 'test-session' }, { name: 'consent', value: 'denied' }] } };
}

test('same-origin POST signs out only the local session and forwards SDK cookie deletion', async () => {
  const { handlers, calls } = setup();
  const response = await handlers.POST(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(calls.filter(call => call.operation === 'signOut').length, 1);
  assert.equal(calls.find(call => call.operation === 'signOut').scope, 'local');
  assert.equal(response.cookies.get('sb-project-auth-token.0').maxAge, 0);
  assert.equal(response.cookies.get('sb-project-auth-token.1').maxAge, 0);
  assert.equal(response.cookies.get('consent'), undefined, 'unrelated cookies must remain untouched');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('GET does not initialize the SDK or sign anyone out', async () => {
  const { handlers, calls } = setup();
  const response = handlers.GET();
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
  assert.deepEqual(calls, []);
  assert.equal(response.headers.get('set-cookie'), null);
});

test('missing, null, cross-origin and cross-site requests never reach auth', async () => {
  for (const headers of [{}, { origin: 'null' }, { origin: 'https://evil.example' }, { origin: 'http://prestacerto.com.br' }, { origin, 'sec-fetch-site': 'cross-site' }]) {
    const { handlers, calls } = setup();
    assert.equal((await handlers.POST(request(headers))).status, 403);
    assert.deepEqual(calls, []);
  }
});

test('failed sign-out reports a failure without claiming the session was cleared', async () => {
  for (const failure of [{ error: { message: 'Unavailable' } }, { throws: true }]) {
    const { handlers } = setup(failure);
    const response = await handlers.POST(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, undefined);
    assert.equal(response.headers.get('set-cookie'), null);
  }
});
