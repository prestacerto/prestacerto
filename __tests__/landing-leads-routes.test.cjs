const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const lead = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  journey: 'client',
  name: '  Maria Silva  ',
  email: 'MARIA@example.com',
  whatsapp: '(11) 99999-8888',
  categoryId: 12,
  service: 'Site para minha clínica',
  description: 'Preciso de um site com agendamento e contato por WhatsApp.',
  location: 'São Paulo, SP',
  privacyAccepted: true,
};
const secret = 'private-server-key-must-not-be-in-responses';

function setup(options = {}) {
  const state = {
    clients: 0, queries: [], insertAttempts: 0, updateAttempts: 0, updated: 0, records: new Map(), notifications: [], after: [], emails: [],
  };
  const cache = new Map();
  for (const record of options.records || []) state.records.set(record.id, record);
  const db = {
    from(table) {
      state.queries.push(table);
      const filters = {};
      let update;
      return {
        select() { return this; },
        eq(key, value) { filters[key] = value; return this; },
        like(key, value) { filters[key] = value; return this; },
        order() { return this; },
        update(values) { update = values; return this; },
        async maybeSingle() {
          if (update) {
            state.updateAttempts++;
            if (options.beforeUpdate) await options.beforeUpdate(state);
            if (options.updateError) return { data: null, error: { message: secret } };
            const current = state.records.get(filters.id);
            if (!current || current.message !== filters.message) return { data: null, error: null };
            state.records.set(filters.id, { ...current, ...update });
            state.updated++;
            return { data: { id: filters.id }, error: null };
          }
          if (table === 'categories') {
            return { data: options.unknownCategory ? null : { id: filters.id }, error: options.categoryError ? { message: secret } : null };
          }
          const record = state.records.get(filters.id);
          return { data: record ? { ...record } : null, error: options.readError ? { message: secret } : null };
        },
        async insert(record) {
          state.insertAttempts++;
          if (options.beforeInsert) await options.beforeInsert();
          if (options.storageError) return { error: { message: secret } };
          if (state.records.has(record.id)) return { error: { code: '23505' } };
          state.records.set(record.id, { ...record, created_at: '2026-09-11T12:00:00Z' });
          return { error: null };
        },
        async range(start, end) {
          state.range = [start, end];
          if (options.storageError) return { data: null, error: { message: secret } };
          const rows = [...state.records.values()].filter(row => row.subject.startsWith('[Landing PrestaCerto] '));
          return { data: rows.slice(start, end + 1), error: null };
        },
      };
    },
  };
  const mocks = {
    'server-only': {},
    'next/server': {
      NextResponse: { json: (body, init) => Response.json(body, init) },
      after(callback) { state.after.push(callback); },
    },
    '@/lib/supabase/service': {
      createServiceClient() { state.clients++; if (options.serviceError) throw new Error(secret); return db; },
    },
    '@/lib/auth/admin': { getAdminContext: async () => options.admin ?? null },
    '@/lib/rate-limit': {
      rateLimiters: { leads: {} }, getClientIP: () => '127.0.0.1',
      checkRateLimit: async () => ({ success: !options.rateLimited, reset: 60 }),
      rateLimitResponse: () => Response.json({ error: 'Tente novamente mais tarde.' }, { status: 429 }),
    },
    resend: {
      Resend: class { emails = { send: async (mail) => { state.emails.push(mail); return { error: null }; } }; },
    },
  };
  if (!options.realEmail) mocks['@/lib/email/resend'] = {
    sendContactNotificationEmail: async (message) => {
      state.notifications.push(message);
      if (options.notificationError) throw new Error('mail unavailable');
      return { sent: true };
    },
  };
  function load(name) {
    if (mocks[name]) return mocks[name];
    if (cache.has(name)) return cache.get(name);
    if (!name.startsWith('@/')) return require(name);
    const module = { exports: {} };
    cache.set(name, module.exports);
    const source = ts.transpileModule(fs.readFileSync(`src/${name.slice(2)}.ts`, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(source, {
      module, exports: module.exports, require: load, Buffer, URL, Request, Response,
      process: { env: { SUPABASE_SECRET_KEY: secret, RESEND_API_KEY: options.noResend ? undefined : 'test-key' } },
      console: { error() {} },
      fetch() { throw new Error('Unexpected real network request in lead test'); },
    });
    return module.exports;
  }
  function request(input, headers = {}) {
    return new Request('https://prestacerto.com.br/api/landing-leads', {
      method: 'POST', headers: { 'content-type': 'application/json', ...headers },
      body: typeof input === 'string' ? input : JSON.stringify(input),
    });
  }
  return {
    state, load, request,
    submit: (input = lead, headers) => load('@/app/api/landing-leads/route').POST(request(input, headers)),
    admin: (search = '') => load('@/app/api/admin/leads/route').GET({ nextUrl: new URL(`https://prestacerto.com.br/api/admin/leads${search}`) }),
    updateStatus: (input, headers) => load('@/app/api/admin/leads/route').PATCH(request(input, headers)),
    flushNotifications: async () => { for (const callback of state.after.splice(0)) await callback(); },
  };
}

test('invalid fields, missing consent and malformed categories never create a lead or notification', async () => {
  const invalid = [
    { id: 'invalid' }, { journey: 'other' }, { name: '' }, { email: 'invalid' },
    { service: '' }, { description: '' }, { location: '' },
    { privacyAccepted: false }, { privacyAccepted: 'true' }, { privacyAccepted: undefined },
    { categoryId: -1 }, { categoryId: 1.2 }, { categoryId: '12 OR 1=1' },
    { whatsapp: '+1 202 555 0140' }, { portfolio: 'javascript:alert(1)' },
  ];
  for (const patch of invalid) {
    const app = setup();
    const response = await app.submit({ ...lead, ...patch });
    assert.equal(response.status, 400, JSON.stringify(patch));
    assert.equal(app.state.clients, 0);
    assert.equal(app.state.insertAttempts, 0);
    assert.equal(app.state.after.length, 0);
  }
});

test('unknown categories and category lookup errors never persist a lead', async () => {
  for (const [options, expectedStatus] of [[{ unknownCategory: true }, 400], [{ categoryError: true }, 503]]) {
    const app = setup(options);
    assert.equal((await app.submit()).status, expectedStatus);
    assert.equal(app.state.insertAttempts, 0);
    assert.equal(app.state.after.length, 0);
  }
});

test('invalid JSON, unsupported content type, excessive body, cross-site and rate limited requests never touch storage', async () => {
  for (const [options, input, headers, status] of [
    [{}, '{', {}, 400], [{}, [], {}, 400], [{}, lead, { 'content-type': 'text/plain' }, 415],
    [{}, { ...lead, description: 'a'.repeat(13000) }, {}, 413],
    [{}, lead, { 'sec-fetch-site': 'cross-site' }, 403], [{ rateLimited: true }, lead, {}, 429],
  ]) {
    const app = setup(options);
    assert.equal((await app.submit(input, headers)).status, status);
    assert.equal(app.state.clients, 0);
    assert.equal(app.state.records.size, 0);
  }
});

test('success waits for persisted client data and schedules the notification afterward', async () => {
  let releaseInsert;
  let reachedInsert;
  const reached = new Promise(resolve => { reachedInsert = resolve; });
  const gate = new Promise(resolve => { releaseInsert = resolve; });
  const app = setup({ beforeInsert: () => { reachedInsert(); return gate; } });
  let finished = false;
  const pending = app.submit().then(response => { finished = true; return response; });
  await reached;
  assert.equal(finished, false);
  assert.equal(app.state.after.length, 0);
  releaseInsert();
  const response = await pending;
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { success: true });
  const saved = JSON.parse(app.state.records.get(lead.id).message);
  assert.equal(saved.kind, 'prestacerto-landing-lead');
  assert.equal(saved.lead.name, 'Maria Silva');
  assert.equal(saved.lead.email, 'maria@example.com');
  assert.equal(saved.lead.whatsapp, '5511999998888');
  assert.equal(saved.lead.description, lead.description);
  assert.equal(saved.lead.privacyAccepted, true);
  assert.equal(saved.privacyVersion, '2026-09-11');
  assert.equal(app.state.notifications.length, 0);
  await app.flushNotifications();
  assert.equal(app.state.notifications.length, 1);
});

test('provider journey persists portfolio and experience without requiring a client description or email delivery', async () => {
  const app = setup({ realEmail: true, noResend: true });
  const response = await app.submit({ ...lead, journey: 'provider', categoryId: undefined, description: undefined,
    portfolio: 'https://example.com/portfolio', experience: 'Atuo com sites institucionais.' });
  assert.equal(response.status, 201);
  await app.flushNotifications();
  assert.equal(app.state.records.size, 1);
  assert.equal(app.state.emails.length, 0);
  const saved = JSON.parse(app.state.records.get(lead.id).message);
  assert.equal(saved.lead.journey, 'provider');
  assert.equal(saved.lead.portfolio, 'https://example.com/portfolio');
  assert.equal(saved.lead.experience, 'Atuo com sites institucionais.');
});

test('retrying the same normalized UUID submission does not create another record or notification', async () => {
  const app = setup();
  assert.equal((await app.submit()).status, 201);
  await app.flushNotifications();
  assert.equal((await app.submit({ ...lead, name: 'Maria Silva', email: 'maria@example.com', whatsapp: '+55 11 99999-8888' })).status, 201);
  await app.flushNotifications();
  assert.equal(app.state.records.size, 1);
  assert.equal(app.state.notifications.length, 1);
});

test('simultaneous identical submissions remain one persisted lead and one notification', async () => {
  const app = setup();
  const responses = await Promise.all([app.submit(), app.submit()]);
  assert.deepEqual(responses.map(response => response.status), [201, 201]);
  await app.flushNotifications();
  assert.equal(app.state.records.size, 1);
  assert.equal(app.state.notifications.length, 1);
});

test('the same UUID with changed data returns conflict and preserves the original lead', async () => {
  const app = setup();
  await app.submit();
  const original = app.state.records.get(lead.id).message;
  const response = await app.submit({ ...lead, description: 'Outra solicitação com dados diferentes.' });
  assert.equal(response.status, 409);
  assert.equal(app.state.records.get(lead.id).message, original);
  await app.flushNotifications();
  assert.equal(app.state.notifications.length, 1);
});

test('storage failures return 503 without leaking credentials or reporting success', async () => {
  for (const options of [{ storageError: true }, { serviceError: true }]) {
    const app = setup(options);
    const response = await app.submit();
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.success, undefined);
    assert.ok(body.error);
    assert.ok(!JSON.stringify(body).includes(secret));
    assert.equal(app.state.records.size, 0);
    assert.equal(app.state.after.length, 0);
  }
});

test('notification failure does not undo a persisted lead or cause duplicate delivery attempts on retry', async () => {
  const app = setup({ notificationError: true });
  assert.equal((await app.submit()).status, 201);
  await app.flushNotifications();
  assert.equal((await app.submit()).status, 201);
  await app.flushNotifications();
  assert.equal(app.state.records.size, 1);
  assert.equal(app.state.notifications.length, 1);
});

test('lead notification HTML escapes submitted name, email and free text', async () => {
  const app = setup({ realEmail: true });
  const response = await app.submit({ ...lead, name: 'Maria <img src=x> & "Equipe"', email: 'maria+<tag>@example.com',
    description: '<script>alert("teste")</script> & Uma página institucional.' });
  assert.equal(response.status, 201);
  await app.flushNotifications();
  assert.equal(app.state.emails.length, 1);
  const html = app.state.emails[0].html;
  assert.ok(html.includes('Maria &lt;img src=x&gt; &amp; &quot;Equipe&quot;'));
  assert.ok(html.includes('maria+&lt;tag&gt;@example.com'));
  assert.ok(html.includes('&lt;script&gt;alert(&quot;teste&quot;)&lt;/script&gt; &amp;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x>'));
});

test('anonymous and non-super-admin requests cannot query the inbox or access service credentials', async () => {
  for (const admin of [null, { role: 'admin' }, { role: 'client' }, { role: 'freelancer' }]) {
    const app = setup({ admin });
    const response = await app.admin();
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(app.state.clients, 0);
    assert.deepEqual(app.state.queries, []);
    assert.ok(!(await response.text()).includes(secret));
  }
});

test('super admin inbox reads persisted lead fields without exposing internal payload or unrelated contacts', async () => {
  const app = setup({ admin: { role: 'super_admin' }, records: [
    { id: 'ordinary', subject: 'Contato comum', message: secret, email: 'other@example.com', name: 'Outro' },
  ] });
  await app.submit();
  const stored = app.state.records.get(lead.id);
  const payload = JSON.parse(stored.message);
  payload.lead.internalSecret = secret;
  stored.message = JSON.stringify(payload);
  const response = await app.admin();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  const body = await response.json();
  assert.equal(body.leads.length, 1);
  assert.equal(body.leads[0].name, 'Maria Silva');
  assert.equal(body.leads[0].email, 'maria@example.com');
  assert.equal(body.leads[0].description, lead.description);
  assert.equal(body.leads[0].message, undefined);
  assert.equal(body.leads[0].requestHash, undefined);
  assert.equal(body.leads[0].internalSecret, undefined);
  assert.ok(!JSON.stringify(body).includes(secret));
});

test('admin inbox caps responses at 50 and requests the next bounded page', async () => {
  const records = Array.from({ length: 51 }, (_, index) => ({
    id: `lead-${index}`, subject: '[Landing PrestaCerto] Cliente', name: 'Maria', email: 'maria@example.com',
    message: JSON.stringify({ kind: 'prestacerto-landing-lead', lead: { journey: 'client', service: 'Site' } }),
  }));
  const app = setup({ admin: { role: 'super_admin' }, records });
  const first = await (await app.admin()).json();
  assert.equal(first.leads.length, 50);
  assert.equal(first.hasNext, true);
  const second = await (await app.admin('?page=2')).json();
  assert.equal(second.leads.length, 1);
  assert.equal(second.hasNext, false);
  assert.deepEqual(app.state.range, [50, 100]);
  await app.admin('?page=99999999999999');
  assert.deepEqual(app.state.range, [499950, 500000]);
});

test('admin storage errors return a private 503 without leaking the service error', async () => {
  const app = setup({ admin: { role: 'super_admin' }, storageError: true });
  const response = await app.admin();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.ok(!(await response.text()).includes(secret));
});

const statusChange = { id: lead.id, status: 'em_atendimento', expectedStatus: 'novo' };
function storedLead(extra = {}) {
  return { id: lead.id, name: lead.name, email: lead.email, subject: '[Landing PrestaCerto] Cliente',
    message: JSON.stringify({ kind: 'prestacerto-landing-lead', version: 1, lead, requestHash: 'original-request-hash',
      privacyVersion: '2026-09-11', attribution: { utm_source: 'original', nested: ['keep', 2] }, ...extra }) };
}

test('manual status defaults to novo and preserves the full original lead envelope on update', async () => {
  const original = storedLead();
  const app = setup({ admin: { role: 'super_admin' }, records: [original] });
  assert.equal((await (await app.admin()).json()).leads[0].status, 'novo');
  const response = await app.updateStatus({ ...statusChange, lead: { name: 'Do not replace' }, requestHash: 'Do not replace' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.deepEqual(await response.json(), { success: true, id: lead.id, status: 'em_atendimento' });
  const saved = JSON.parse(app.state.records.get(lead.id).message);
  assert.deepEqual(saved, { ...JSON.parse(original.message), status: 'em_atendimento' });
  assert.equal((await (await app.admin()).json()).leads[0].status, 'em_atendimento');
  assert.equal(app.state.updated, 1);
  assert.equal(app.state.after.length, 0);
});

test('all three allowed statuses are manual transitions and remain separate from the lead payload', async () => {
  const app = setup({ admin: { role: 'super_admin' }, records: [storedLead()] });
  let expectedStatus = 'novo';
  for (const status of ['em_atendimento', 'convertido', 'novo']) {
    assert.equal((await app.updateStatus({ id: lead.id, status, expectedStatus })).status, 200);
    const saved = JSON.parse(app.state.records.get(lead.id).message);
    assert.equal(saved.status, status);
    assert.deepEqual(saved.lead, lead);
    assert.equal(saved.requestHash, 'original-request-hash');
    expectedStatus = status;
  }
});

test('public submission retries preserve a later manual status and do not notify again', async () => {
  const app = setup({ admin: { role: 'super_admin' } });
  assert.equal((await app.submit()).status, 201);
  await app.flushNotifications();
  assert.equal((await app.updateStatus({ ...statusChange, status: 'convertido' })).status, 200);
  assert.equal((await app.submit()).status, 201);
  await app.flushNotifications();
  assert.equal(JSON.parse(app.state.records.get(lead.id).message).status, 'convertido');
  assert.equal(app.state.records.size, 1);
  assert.equal(app.state.notifications.length, 1);
});

test('status updates reject anonymous and non-super-admin callers before touching service storage', async () => {
  for (const admin of [null, { role: 'admin' }, { role: 'client' }]) {
    const app = setup({ admin });
    const response = await app.updateStatus(statusChange);
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(app.state.clients, 0);
    assert.equal(app.state.updateAttempts, 0);
  }
});

test('malformed status changes and cross-site requests never query or update a lead', async () => {
  for (const [input, headers, status] of [
    ['{', {}, 400], [[], {}, 400], [statusChange, { 'content-type': 'text/plain' }, 415],
    [{ ...statusChange, id: 'invalid' }, {}, 400], [{ ...statusChange, status: 'deleted' }, {}, 400],
    [{ ...statusChange, status: { value: 'novo' } }, {}, 400], [{ ...statusChange, expectedStatus: undefined }, {}, 400],
    [{ ...statusChange, expectedStatus: 'unknown' }, {}, 400], [{ ...statusChange, extra: 'a'.repeat(2500) }, {}, 413],
    [statusChange, { 'sec-fetch-site': 'cross-site' }, 403],
  ]) {
    const app = setup({ admin: { role: 'super_admin' } });
    const response = await app.updateStatus(input, headers);
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(app.state.clients, 0);
    assert.equal(app.state.updateAttempts, 0);
  }
});

test('missing leads and unrelated or malformed contact messages cannot be turned into leads by PATCH', async () => {
  for (const message of [null, 'plain contact text', '{', JSON.stringify({ kind: 'other', lead }), JSON.stringify({ kind: 'prestacerto-landing-lead', lead: [] })]) {
    const app = setup({ admin: { role: 'super_admin' }, records: message === null ? [] : [{ ...storedLead(), message }] });
    assert.equal((await app.updateStatus(statusChange)).status, 404);
    assert.equal(app.state.updateAttempts, 0);
  }
});

test('a stale status selection returns 409 without overwriting the newer manual status', async () => {
  const app = setup({ admin: { role: 'super_admin' }, records: [storedLead({ status: 'convertido' })] });
  const original = app.state.records.get(lead.id).message;
  assert.equal((await app.updateStatus(statusChange)).status, 409);
  assert.equal(app.state.records.get(lead.id).message, original);
  assert.equal(app.state.updateAttempts, 0);
});

test('concurrent administrators updating the same previous status commit once and return one conflict', async () => {
  const app = setup({ admin: { role: 'super_admin' }, records: [storedLead()] });
  const responses = await Promise.all([
    app.updateStatus(statusChange),
    app.updateStatus({ ...statusChange, status: 'convertido' }),
  ]);
  assert.deepEqual(responses.map(response => response.status).sort(), [200, 409]);
  assert.equal(app.state.updated, 1);
  const winning = await responses.find(response => response.status === 200).json();
  assert.equal(JSON.parse(app.state.records.get(lead.id).message).status, winning.status);
});

test('a concurrent change elsewhere in the JSON envelope is preserved even when status has not changed', async () => {
  const app = setup({ admin: { role: 'super_admin' }, records: [storedLead()], beforeUpdate(state) {
    const current = state.records.get(lead.id);
    state.records.set(lead.id, { ...current, message: JSON.stringify({ ...JSON.parse(current.message), attribution: { utm_source: 'concurrent-update' } }) });
  } });
  assert.equal((await app.updateStatus(statusChange)).status, 409);
  const saved = JSON.parse(app.state.records.get(lead.id).message);
  assert.equal(saved.attribution.utm_source, 'concurrent-update');
  assert.equal(saved.status, undefined);
  assert.equal(app.state.updated, 0);
});

test('status read or write failures return a private 503 and keep the stored record intact', async () => {
  for (const failure of [{ readError: true }, { updateError: true }, { serviceError: true }]) {
    const original = storedLead();
    const app = setup({ admin: { role: 'super_admin' }, records: [original], ...failure });
    const response = await app.updateStatus(statusChange);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.ok(!(await response.text()).includes(secret));
    assert.equal(app.state.records.get(lead.id).message, original.message);
    assert.equal(app.state.updated, 0);
  }
});
