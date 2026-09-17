/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const { NextRequest, NextResponse } = require('next/server');

function setup(env = {}) {
  const target = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('src/app/api/whatsapp/webhook/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module: target, exports: target.exports, process: { env }, console: { log() {}, error() {} },
    require(name) {
      if (name === 'next/server') return { NextResponse };
      if (name === 'crypto') return crypto;
      if (name.startsWith('@/lib/whatsapp/')) return new Proxy({}, { get() {
        return () => { throw new Error('External operations must not run in validation tests'); };
      } });
      throw new Error('Unexpected dependency');
    },
  });
  return target.exports;
}

test('WhatsApp verification requires a configured matching token', async () => {
  const request = new NextRequest('https://example.test/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=challenge');
  assert.equal((await setup().GET(request)).status, 500);
  assert.equal((await setup({ WHATSAPP_VERIFY_TOKEN: 'different' }).GET(request)).status, 403);
  const verified = await setup({ WHATSAPP_VERIFY_TOKEN: 'test-token' }).GET(request);
  assert.equal(verified.status, 200);
  assert.equal(await verified.text(), 'challenge');
});

test('WhatsApp rejects unsigned and forged payloads before external processing', async () => {
  for (const signature of ['', 'sha256=forged']) {
    const request = new NextRequest('https://example.test/api/whatsapp/webhook', {
      method: 'POST', headers: { 'x-hub-signature-256': signature }, body: '{}',
    });
    assert.equal((await setup({ WHATSAPP_APP_SECRET: 'test-secret' }).POST(request)).status, 403);
  }
});

test('WhatsApp accepts a correctly signed notification without messages', async () => {
  const body = '{"entry":[]}';
  const signature = 'sha256=' + crypto.createHmac('sha256', 'test-secret').update(body).digest('hex');
  const request = new NextRequest('https://example.test/api/whatsapp/webhook', {
    method: 'POST', headers: { 'x-hub-signature-256': signature }, body,
  });
  const response = await setup({ WHATSAPP_APP_SECRET: 'test-secret' }).POST(request);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});
