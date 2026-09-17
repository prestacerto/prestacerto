/* eslint-disable @typescript-eslint/no-require-imports -- Isolated component handlers, with no auth/network writes. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function setup(options = {}) {
  let cursor = 0;
  const states = [], refs = [], effects = [], timers = new Map(), listeners = new Map(), calls = [], navigations = [];
  const cache = new Map();
  let timerId = 0, fetchCount = 0;
  class Node {}
  class Element extends Node { closest() { return null; } }
  const react = {
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value; }]; },
    useRef(initial) { const i = cursor++; if (!(i in refs)) refs[i] = { current: initial }; return refs[i]; },
    useEffect(fn, deps) { const i = cursor++; const old = states[i]; if (!old || deps.some((value, n) => !Object.is(value, old[n]))) { states[i] = deps; effects.push(fn); } },
  };
  const searchParams = new URLSearchParams(options.query);
  const router = { push: value => navigations.push(value), refresh() {} };
  const formValues = { ...options.formValues }, formDirty = new Set(options.formDirty || []);
  const hookForm = {
    register: field => ({ value: formValues[field] || '', onChange: event => { formValues[field] = event.target.value; formDirty.add(field); } }),
    handleSubmit: fn => fn, formState: { errors: {} },
    getValues: field => formValues[field], getFieldState: field => ({ isDirty: formDirty.has(field), isTouched: false }),
    setValue: (field, value) => { formValues[field] = value; },
  };
  const toast = { error: (...args) => calls.push({ kind: 'error', args }), success() {}, info() {} };
  const mocks = {
    react,
    'next/link': { __esModule: true, default: 'a' },
    'next/navigation': { useSearchParams: () => searchParams, useRouter: () => router },
    'react-hook-form': { useForm: () => hookForm },
    '@hookform/resolvers/zod': { zodResolver() {} },
    sonner: { toast },
    '@/components/analytics': { trackRegistration() {}, trackAnalyticsEvent() {} },
    ...(options.realTracking ? {} : { '@/lib/landing-tracking': { trackLandingEvent: (event, journey) => calls.push({ kind: 'landing-event', event, journey }) } }),
    ...(options.realTracking ? {} : { '@/lib/funnel': { trackFunnelEvent: (event, journey) => calls.push({ kind: 'funnel-event', event, journey }), isProfileComplete: profile => ['full_name', 'headline', 'bio', 'city'].every(field => profile[field]?.trim()) } }),
    '@/components/ui/button': { Button: 'button' },
    '@/components/ui/input': { Input: 'input' },
    '@/components/ui/label': { Label: 'label' },
    '@/components/ui/textarea': { Textarea: 'textarea' },
    './avatar-upload': { AvatarUpload: 'avatar-upload' },
    '@/components/auth/google-auth-button': { GoogleAuthButton: 'google-auth' },
    '@/components/auth/auth-card': { AuthCard: 'auth-card' },
    '@/lib/supabase/client': { createClient: () => ({ auth: {
      async resetPasswordForEmail(email, data) { calls.push({ kind: 'recovery', email, ...data }); if (options.recoveryThrows) throw Error('offline'); return { error: options.authError || null }; },
      async updateUser(data) { calls.push({ kind: 'password', ...data }); return { error: options.authError || null }; },
    } }) },
  };
  function load(name, parent = path.join(process.cwd(), 'src/index.ts')) {
    if (mocks[name]) return mocks[name];
    if (!name.startsWith('@/') && !name.startsWith('.')) return require(name);
    const base = name.startsWith('@/') ? path.join(process.cwd(), 'src', name.slice(2)) : path.resolve(path.dirname(parent), name);
    const filename = ['.ts', '.tsx', ''].map(ext => base + ext).find(candidate => fs.existsSync(candidate));
    if (!filename) throw Error(`Missing ${name}`);
    if (cache.has(filename)) return cache.get(filename);
    const mod = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, {
      module: mod, exports: mod.exports, require: spec => load(spec, filename), URL, URLSearchParams, Date, Node, Element, console, AbortController,
      crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000071' },
      AbortSignal: { timeout: ms => { calls.push({ kind: 'timeout', ms }); return {}; } },
      process: { env: options.env || {} },
      window: { addEventListener() {}, removeEventListener() {}, location: { origin: 'https://prestacerto.com.br', hostname: 'prestacerto.com.br', pathname: '/para-clientes', search: options.query || '', assign: value => navigations.push(value) }, localStorage: options.localStorage, sessionStorage: options.sessionStorage, matchMedia: () => ({ matches: true }), gtag: (...args) => calls.push({ kind: 'gtag', args }) },
      document: { referrer: options.referrer || '', addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) },
      setTimeout: (fn, ms) => { calls.push({ kind: 'timeout', ms }); timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id),
      fetch: async (url, init) => { calls.push({ kind: 'fetch', url, body: JSON.parse(init.body), signal: init.signal }); const reply = options.responses?.[fetchCount++]; if (reply instanceof Error) throw reply; return { ok: !reply || reply.status < 400, status: reply?.status || 200, json: async () => reply?.body || ({ success: true, session: true }) }; },
    });
    cache.set(filename, mod.exports);
    return mod.exports;
  }
  return {
    load, calls, navigations, listeners, timers, Node,
    render(Component, props = {}) { cursor = 0; return Component(props); },
    runEffects() { return effects.splice(0).map(fn => fn()).filter(Boolean); },
    flushTimers() { const current = [...timers.values()]; timers.clear(); for (const fn of current) fn(); },
  };
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  const children = tree.props?.children;
  return [tree, ...(Array.isArray(children) ? children.flat(Infinity) : [children]).flatMap(nodes)];
}
const find = (tree, predicate) => nodes(tree).find(predicate);
const form = tree => find(tree, node => node.type === 'form');
const destination = '/plans?plan=business#continuar-assinatura';

test('recovery keeps publication and plan intent through login, email redirect and password reset', async () => {
  for (const next of ['/publicar-projeto', destination]) {
    const app = setup({ query: new URLSearchParams({ next }) });
    const login = app.render(app.load('@/components/auth/login-form').LoginForm);
    const forgot = find(login, node => node.type === 'a' && node.props.children === 'Esqueci minha senha');
    assert.equal(new URL(forgot.props.href, 'https://prestacerto.com.br').searchParams.get('next'), next);
    const page = await app.load('@/app/(auth)/forgot-password/page').default({ searchParams: Promise.resolve({ next }) });
    assert.equal(new URL(page.props.footer.href, 'https://prestacerto.com.br').searchParams.get('next'), next);
    assert.equal(page.props.children.props.destination, next);
    const recovery = setup();
    await form(recovery.render(recovery.load('@/components/auth/forgot-password-form').ForgotPasswordForm, { destination: next })).props.onSubmit({ email: 'person@example.invalid' });
    assert.equal(new URL(recovery.calls.find(call => call.kind === 'recovery').redirectTo).searchParams.get('next'), next);
    const reset = setup();
    const resetPage = await reset.load('@/app/(auth)/reset-password/page').default({ searchParams: Promise.resolve({ next }) });
    await form(reset.render(reset.load('@/components/auth/reset-password-form').ResetPasswordForm, resetPage.props.children.props)).props.onSubmit({ password: 'fixture-password' });
    assert.deepEqual(reset.navigations, [next]);
  }
});

test('recovery network failure releases the form for retry without claiming success', async () => {
  const app = setup({ recoveryThrows: true });
  const Component = app.load('@/components/auth/forgot-password-form').ForgotPasswordForm;
  await form(app.render(Component)).props.onSubmit({ email: 'person@example.invalid' });
  const tree = app.render(Component);
  assert.ok(form(tree), 'form must remain available');
  assert.equal(find(tree, node => node.type === 'button').props.disabled, false);
  assert.ok(app.calls.some(call => call.kind === 'error'));
});

test('registration honors legacy redirect and never accepts an external return URL', async () => {
  for (const [redirect, expected] of [[destination, destination], ['/publicar-projeto', '/publicar-projeto'], ['https://other.example', '/dashboard']]) {
    const app = setup({ query: new URLSearchParams({ redirect }) });
    const Component = app.load('@/components/auth/register-form').RegisterForm;
    await form(app.render(Component)).props.onSubmit({ fullName: 'Test Person', email: 'person@example.invalid', password: 'fixture-password' });
    assert.equal(app.calls.find(call => call.kind === 'fetch').body.next, expected);
    assert.equal(app.calls.find(call => call.kind === 'fetch').body.role, expected === '/publicar-projeto' ? 'client' : 'freelancer');
    assert.deepEqual(app.navigations, [expected]);
  }
});

test('password reset fails closed for external destinations and does not navigate on auth error', async () => {
  const app = setup();
  await form(app.render(app.load('@/components/auth/reset-password-form').ResetPasswordForm, { destination: '//other.example' })).props.onSubmit({ password: 'fixture-password' });
  assert.deepEqual(app.navigations, ['/dashboard']);
  const failure = setup({ authError: { message: 'expired' } });
  await form(failure.render(failure.load('@/components/auth/reset-password-form').ResetPasswordForm, { destination })).props.onSubmit({ password: 'fixture-password' });
  assert.deepEqual(failure.navigations, []);
});

test('mobile menu closes on outside touch or focus and keeps interaction inside available', () => {
  const app = setup();
  const tree = app.render(app.load('@/components/mobile-site-menu').MobileSiteMenu, { items: [], signedIn: false });
  const inside = new app.Node(), outside = new app.Node();
  let focused = false;
  tree.props.ref.current = { open: true, contains: node => node === inside, querySelector: () => ({ focus() { focused = true; } }) };
  const cleanup = app.runEffects();
  app.listeners.get('pointerdown')({ target: inside });
  assert.equal(tree.props.ref.current.open, true);
  app.listeners.get('pointerdown')({ target: outside });
  assert.equal(tree.props.ref.current.open, false);
  assert.equal(focused, false, 'outside interaction must not steal focus');
  tree.props.ref.current.open = true;
  app.listeners.get('focusin')({ target: outside });
  assert.equal(tree.props.ref.current.open, false);
  tree.props.ref.current.open = true;
  tree.props.onKeyDown({ key: 'Escape' });
  assert.equal(tree.props.ref.current.open, false);
  assert.equal(focused, true);
  cleanup.forEach(fn => fn());
  assert.equal(app.listeners.size, 0);
});

function storage(throws = false, initial = []) {
  const values = new Map(initial);
  return { values, getItem: key => values.get(key) || null, setItem(key, value) { if (throws) throw Error('Storage full'); values.set(key, value); }, removeItem: key => values.delete(key) };
}
const guestKey = 'prestacerto:project-draft:guest';
const draft = { version: 1, savedAt: Date.now() - 1000, idea: 'Preciso de um site com contato e agendamento.', step: 2, formData: { title: 'Site para minha clínica', description: 'Preciso de um site com contato e agendamento.', category: 'desenvolvimento', budget: '2500', deadline: '', skills: 'site, design' } };
function publication(app) {
  const Component = app.load('@/components/projects/publish-project-form').PublishProjectForm;
  app.render(Component); app.runEffects(); app.flushTimers();
  return { Component, tree: app.render(Component) };
}

test('publication uses session storage when persistent storage is full before leaving for registration', async () => {
  const local = storage(true, [[guestKey, JSON.stringify(draft)]]), session = storage();
  const app = setup({ localStorage: local, sessionStorage: session });
  const { tree } = publication(app);
  await form(tree).props.onSubmit({ preventDefault() {} });
  assert.equal(new URL(app.navigations[0], 'https://prestacerto.com.br').pathname, '/register');
  assert.deepEqual(JSON.parse(session.values.get(guestKey)).formData, draft.formData);
  const resumed = setup({ localStorage: local, sessionStorage: session });
  const restored = publication(resumed).tree;
  assert.ok(find(restored, node => node.type === 'input' && node.props.value === draft.formData.title));
});

test('publication stays on the filled form when every storage write fails, including the login link', async () => {
  const app = setup({ localStorage: storage(true, [[guestKey, JSON.stringify(draft)]]), sessionStorage: storage(true) });
  const { Component, tree } = publication(app);
  await form(tree).props.onSubmit({ preventDefault() {} });
  assert.deepEqual(app.navigations, []);
  const retry = app.render(Component);
  assert.ok(find(retry, node => node.props?.role === 'alert'));
  assert.ok(find(retry, node => node.type === 'input' && node.props.value === draft.formData.title));
  let prevented = false;
  find(retry, node => node.type === 'a' && String(node.props.href).startsWith('/login?')).props.onClick({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
});

test('saving an account draft removes visitor copies across stores only after a successful write', () => {
  const app = setup();
  const api = app.load('@/lib/projects/draft');
  const local = storage(false, [[guestKey, JSON.stringify(draft)]]), session = storage(false, [[guestKey, JSON.stringify(draft)]]);
  api.writeProjectDraftToStores([local, session], 'account-draft', draft, guestKey);
  assert.ok(local.values.has('account-draft'));
  assert.equal(local.values.has(guestKey), false);
  assert.equal(session.values.has(guestKey), false);
  const blocked = storage(true, [[guestKey, JSON.stringify(draft)]]);
  assert.throws(() => api.writeProjectDraftToStores([blocked], 'account-draft', draft, guestKey), /PROJECT_DRAFT_STORAGE_UNAVAILABLE/);
  assert.ok(blocked.values.has(guestKey));
});


const validLead = { id: '00000000-0000-4000-8000-000000000071', journey: 'client', name: ' Ana Silva ', email: ' ANA@example.invalid ', whatsapp: '(11) 98765-4321', categoryId: '2', service: 'Site institucional', description: 'Site para apresentar meus serviços.', location: 'São Paulo/SP', privacyAccepted: true };
test('landing lead validation normalizes contacts and keeps optional provider fields optional', () => {
  const api = setup().load('@/lib/landing-leads-validation');
  const valid = api.validateLandingLead(validLead);
  assert.equal(valid.success, true);
  assert.equal(valid.data.name, 'Ana Silva'); assert.equal(valid.data.email, 'ana@example.invalid');
  assert.equal(valid.data.whatsapp, '5511987654321'); assert.equal(valid.data.categoryId, 2);
  assert.equal(api.validateLandingLead({ ...validLead, whatsapp: '+55 (11) 98765-4321' }).data.whatsapp, valid.data.whatsapp);
  const provider = api.validateLandingLead({ ...validLead, journey: 'provider', description: '', whatsapp: '', categoryId: '' });
  assert.equal(provider.success, true); assert.equal(provider.data.description, undefined); assert.equal(provider.data.whatsapp, undefined);
});

test('landing validation rejects missing required fields, fake consent, unsafe links and malformed identifiers', () => {
  const api = setup().load('@/lib/landing-leads-validation');
  for (const [field, value] of [['id', 'fake'], ['journey', 'admin'], ['name', ' '], ['email', 'invalid'], ['service', ''], ['description', ''], ['location', ''], ['privacyAccepted', 'true'], ['whatsapp', '+1 212 555 1234'], ['whatsapp', 'invalid'], ['categoryId', '-1'], ['categoryId', true], ['portfolio', 'javascript:alert(1)'], ['portfolio', 'https://name:password@example.com'], ['portfolio', 'example.com']]) {
    const result = api.validateLandingLead({ ...validLead, [field]: value });
    assert.equal(result.success, false, field); assert.ok(result.errors[field], field);
  }
  assert.equal(api.validateLandingLead(null).success, false);
  assert.equal(api.validateLandingLead({ ...validLead, journey: 'provider', portfolio: 'https://example.com/work' }).success, true);
});

function fillLanding(app, Component, props, fields) {
  for (const [field, value] of Object.entries(fields)) {
    const tree = app.render(Component, props);
    const input = find(tree, node => node.props?.id === `${props.journey}-lead-${field}` && ['input', 'select', 'textarea'].includes(node.type));
    assert.ok(input, field);
    input.props.onChange({ target: { value, checked: value } });
  }
  return app.render(Component, props);
}
async function preparedLanding(app, journey = 'client') {
  const Component = app.load('@/components/landing/landing-lead-form').LandingLeadForm;
  const props = { journey, categories: [{ id: 2, name: 'Design', slug: 'design', sort_order: 1 }] };
  let tree = fillLanding(app, Component, props, { name: 'Ana Silva', email: 'ana@example.invalid', whatsapp: '' });
  await form(tree).props.onSubmit({ preventDefault() {} });
  tree = fillLanding(app, Component, props, { service: 'Design de identidade visual', location: 'Remoto', privacyAccepted: true, ...(journey === 'client' ? { description: 'Preciso criar a identidade visual da minha empresa.' } : {}) });
  return { Component, props, tree };
}

test('landing contact step displays inline errors and never sends a partial lead', async () => {
  const app = setup();
  const Component = app.load('@/components/landing/landing-lead-form').LandingLeadForm;
  const props = { journey: 'client', categories: [] };
  await form(app.render(Component, props)).props.onSubmit({ preventDefault() {} });
  const tree = app.render(Component, props);
  assert.equal(find(tree, node => node.props?.id === 'client-lead-email').props['aria-invalid'], true);
  assert.equal(app.calls.filter(call => call.kind === 'fetch').length, 0);
});

test('landing timeout and server failure preserve fields and reuse the request ID on retry', async () => {
  const app = setup({ responses: [new Error('timeout'), { status: 503, body: { error: 'Tente novamente.' } }, { status: 201, body: { success: true } }] });
  const { Component, props, tree } = await preparedLanding(app);
  let current = tree;
  for (let i = 0; i < 3; i++) {
    await form(current).props.onSubmit({ preventDefault() {} });
    current = app.render(Component, props);
    if (i < 2) assert.equal(find(current, node => node.props?.id === 'client-lead-service').props.value, 'Design de identidade visual');
  }
  const requests = app.calls.filter(call => call.kind === 'fetch');
  assert.equal(requests.length, 3);
  assert.equal(new Set(requests.map(call => call.body.id)).size, 1);
  assert.ok(requests.every(call => call.url === '/api/landing-leads'));
  const timeouts = app.calls.filter(call => call.kind === 'timeout');
  assert.equal(timeouts.length, 3);
  assert.ok(timeouts.every(call => call.ms === 25000));
  assert.ok(requests.every(call => call.signal instanceof AbortSignal));
  assert.equal(app.timers.size, 0, 'completed attempts clear their timeout');
  assert.ok(find(current, node => node.props?.role === 'status'));
  const next = find(current, node => node.type === 'a').props.href;
  assert.equal(new URL(next, 'https://prestacerto.com.br').searchParams.get('next'), '/publicar-projeto');
  assert.equal(app.calls.filter(call => call.kind === 'landing-event' && call.event === 'presta_certo_lead_success').length, 1);
});

test('provider lead prevents double submission and offers an existing registration destination', async () => {
  const app = setup();
  const { Component, props, tree } = await preparedLanding(app, 'provider');
  const pending = form(tree).props.onSubmit({ preventDefault() {} });
  await form(tree).props.onSubmit({ preventDefault() {} });
  await pending;
  assert.equal(app.calls.filter(call => call.kind === 'fetch').length, 1);
  const href = find(app.render(Component, props), node => node.type === 'a').props.href;
  const next = new URL(href, 'https://prestacerto.com.br');
  assert.equal(next.searchParams.get('role'), 'freelancer'); assert.equal(next.searchParams.get('next'), '/dashboard/profile');
});

test('server field errors return to contact without deleting previously entered details', async () => {
  const app = setup({ responses: [{ status: 400, body: { error: 'Revise o e-mail.', errors: { email: 'Informe outro e-mail.', unknownField: 'ignored' } } }] });
  const { Component, props, tree } = await preparedLanding(app);
  await form(tree).props.onSubmit({ preventDefault() {} });
  const contact = app.render(Component, props);
  assert.equal(find(contact, node => node.props?.id === 'client-lead-email').props['aria-invalid'], true);
  assert.equal(find(contact, node => node.props?.id === 'client-lead-name').props.value, 'Ana Silva');
  assert.equal(find(contact, node => node.props?.id === 'client-lead-unknownField-error'), undefined);
});

test('landing tracking requires consent and never forwards query strings, raw UTMs or personal fields', () => {
  for (const consent of ['denied', 'granted']) {
    const store = storage(false, [['prestacerto_tracking_consent', consent]]);
    const app = setup({ realTracking: true, localStorage: store, query: '?utm_medium=cpc&utm_campaign=ana@example.invalid&whatsapp=5511999999999', referrer: 'https://example.com/path?email=ana@example.invalid' });
    app.load('@/lib/landing-tracking').trackLandingEvent('presta_certo_lead_success', 'client');
    const events = app.calls.filter(call => call.kind === 'gtag');
    assert.equal(events.length, consent === 'granted' ? 1 : 0);
    if (events.length) {
      const data = events[0].args[2];
      assert.equal(data.source, 'paid_search'); assert.equal(data.device, 'mobile'); assert.equal(data.journey, 'client');
      assert.equal(data.page_location, 'https://prestacerto.com.br/para-clientes'); assert.equal(data.page_referrer, 'https://example.com');
      assert.doesNotMatch(JSON.stringify(data), /@|5511|utm_|\?/);
      assert.deepEqual(Object.keys(data).sort(), ['device', 'journey', 'page_location', 'page_referrer', 'source']);
    }
  }
  const blocked = setup({ realTracking: true, localStorage: { getItem() { throw Error('blocked'); } } });
  blocked.load('@/lib/landing-tracking').trackLandingEvent('presta_certo_form_start', 'provider');
  assert.equal(blocked.calls.length, 0);
});

test('lead handoff is tab-only, expires after 24 hours and cannot populate a different account', () => {
  const local = storage(), session = storage();
  const app = setup({ localStorage: local, sessionStorage: session });
  const api = app.load('@/lib/landing-handoff');
  const lead = app.load('@/lib/landing-leads-validation').validateLandingLead(validLead).data;
  assert.equal(api.saveLandingHandoff(lead, 'design-grafico'), true);
  assert.equal(local.values.size, 0);
  const saved = api.readLandingHandoff('client', 'ANA@example.invalid');
  assert.equal(saved.lead.name, 'Ana Silva');
  assert.equal(api.readLandingHandoff('provider'), null);
  assert.equal(api.readLandingHandoff('client', 'other@example.invalid'), null);
  assert.equal(api.readLandingHandoff('client', null), null);
  assert.equal(api.readLandingHandoff('client', undefined, saved.savedAt + 86400000), null);
  assert.equal(session.values.size, 0);
  session.setItem(api.LANDING_HANDOFF_KEY, '{invalid');
  assert.equal(api.readLandingHandoff(), null);
  const blocked = setup({ sessionStorage: storage(true) }).load('@/lib/landing-handoff');
  assert.equal(blocked.saveLandingHandoff(lead), false);
  assert.equal(blocked.readLandingHandoff(), null);
});

test('successful lead prefills registration without replacing a typed or deliberately cleared value', async () => {
  const session = storage();
  const landing = setup({ sessionStorage: session });
  const prepared = await preparedLanding(landing);
  await form(prepared.tree).props.onSubmit({ preventDefault() {} });
  const api = landing.load('@/lib/landing-handoff');
  assert.ok(session.values.has(api.LANDING_HANDOFF_KEY));
  for (const [formValues, formDirty, expectedName, expectedEmail] of [
    [{}, [], 'Ana Silva', 'ana@example.invalid'],
    [{ fullName: 'Nome editado', email: 'novo@example.invalid' }, [], 'Nome editado', 'novo@example.invalid'],
    [{ fullName: '', email: '' }, ['fullName', 'email'], '', ''],
  ]) {
    const app = setup({ sessionStorage: session, query: 'role=client&next=%2Fpublicar-projeto', formValues, formDirty });
    const Component = app.load('@/components/auth/register-form').RegisterForm;
    app.render(Component); app.runEffects();
    const tree = app.render(Component);
    assert.equal(find(tree, node => node.props?.id === 'fullName').props.value, expectedName);
    assert.equal(find(tree, node => node.props?.id === 'email').props.value, expectedEmail);
    assert.equal(app.calls.filter(call => call.kind === 'fetch').length, 0);
  }
});

test('client lead opens a reviewable project, preserves free-text deadline and never overwrites a real draft', () => {
  const session = storage();
  const seed = setup({ sessionStorage: session });
  const api = seed.load('@/lib/landing-handoff');
  const lead = seed.load('@/lib/landing-leads-validation').validateLandingLead({ ...validLead, deadline: 'Na próxima semana' }).data;
  api.saveLandingHandoff(lead, 'design-grafico');
  const app = setup({ sessionStorage: session, localStorage: storage() });
  const { Component, tree } = publication(app);
  assert.ok(form(tree));
  assert.ok(find(tree, node => node.type === 'input' && node.props.value === lead.service));
  const description = find(tree, node => node.type === 'textarea').props.value;
  assert.match(description, /Local do serviço: São Paulo\/SP/);
  assert.match(description, /Prazo informado: Na próxima semana/);
  assert.equal(find(tree, node => node.type === 'input' && node.props.type === 'number').props.value, '');
  assert.equal(find(tree, node => node.type === 'input' && node.props.type === 'date').props.value, '');
  app.render(Component); app.runEffects(); app.flushTimers();
  assert.ok(session.values.has(api.LANDING_HANDOFF_KEY), 'guest must keep contact data until registration');
  assert.equal(app.calls.filter(call => call.kind === 'fetch').length, 0);

  const existing = setup({ sessionStorage: session, localStorage: storage(false, [[guestKey, JSON.stringify(draft)]]) });
  assert.ok(find(publication(existing).tree, node => node.type === 'input' && node.props.value === draft.formData.title));
  const wrongAccount = setup({ sessionStorage: session, localStorage: storage() });
  const publish = wrongAccount.load('@/components/projects/publish-project-form').PublishProjectForm;
  const props = { userId: 'other-user', userEmail: 'other@example.invalid' };
  wrongAccount.render(publish, props); wrongAccount.runEffects(); wrongAccount.flushTimers();
  assert.equal(find(wrongAccount.render(publish, props), node => node.props?.id === 'project-idea').props.value, '');
});

const emptyProfile = { full_name: 'Ana Silva', headline: null, bio: null, city: null, state: null, avatar_url: null, resume_url: null };
function profileApp(options = {}, initialData = emptyProfile) {
  const session = storage();
  const app = setup({ sessionStorage: session, ...options });
  const handoff = app.load('@/lib/landing-handoff');
  const lead = app.load('@/lib/landing-leads-validation').validateLandingLead({ ...validLead, journey: 'provider', experience: 'Trabalho com projetos de marcas e identidades visuais.', portfolio: 'https://example.com/portfolio' }).data;
  handoff.saveLandingHandoff(lead);
  const Component = app.load('@/components/dashboard/profile-edit-form').ProfileEditForm;
  const props = { userId: 'user-ana', userEmail: 'ana@example.invalid', initialData };
  app.render(Component, props);
  return { app, session, handoff, Component, props };
}

test('provider handoff fills empty profile fields only and never treats a portfolio link as a resume', () => {
  const { app, Component, props } = profileApp({}, { ...emptyProfile, headline: 'Título existente' });
  app.runEffects(); app.flushTimers();
  const tree = app.render(Component, props);
  assert.equal(find(tree, node => node.props?.id === 'headline').props.value, 'Título existente');
  assert.equal(find(tree, node => node.props?.id === 'city').props.value, 'São Paulo');
  assert.equal(find(tree, node => node.props?.id === 'state').props.value, 'SP');
  assert.match(find(tree, node => node.props?.id === 'bio').props.value, /projetos de marcas/);
  assert.equal(app.calls.filter(call => call.kind === 'fetch').length, 0);
  assert.ok(find(tree, node => node.type === 'a' && node.props.href === 'https://example.com/portfolio'));

  const race = profileApp();
  const initial = race.app.render(race.Component, race.props);
  find(initial, node => node.props?.id === 'headline').props.onChange({ target: { value: '' } });
  race.app.runEffects(); race.app.flushTimers();
  assert.equal(find(race.app.render(race.Component, race.props), node => node.props?.id === 'headline').props.value, '');
  const helper = app.load('@/lib/landing-handoff');
  for (const location of ['Remoto', 'Todo o Brasil', 'São Paulo e região', 'Lisboa/PT']) {
    const suggestions = helper.landingProfileSuggestions({ ...validLead, location });
    assert.equal(suggestions.city, ''); assert.equal(suggestions.state, '');
  }
});

test('profile completion fires only after confirmed persistence, once per transition, with retry preserving data', async () => {
  const ctx = profileApp({ responses: [{ status: 503, body: { error: 'Tente novamente.' } }, { status: 200, body: { success: true, profileCompleted: true } }, { status: 200, body: { success: true, profileCompleted: true } }] });
  const { app, Component, props, session, handoff } = ctx;
  app.runEffects(); app.flushTimers();
  const save = () => find(app.render(Component, props), node => node.type === 'button' && node.props.children === 'Salvar perfil').props.onClick();
  await save();
  assert.equal(app.calls.filter(call => call.kind === 'funnel-event').length, 0);
  assert.ok(session.values.has(handoff.LANDING_HANDOFF_KEY));
  assert.ok(find(app.render(Component, props), node => node.props?.role === 'alert'));
  await save(); await save();
  const events = app.calls.filter(call => call.kind === 'funnel-event');
  assert.equal(events.length, 1); assert.equal(events[0].event, 'presta_certo_profile_completed');
  assert.equal(session.values.has(handoff.LANDING_HANDOFF_KEY), false);
  const requests = app.calls.filter(call => call.kind === 'fetch');
  assert.equal(requests[0].body.headline, requests[1].body.headline);
  assert.equal(requests[0].body.resume_url, null);
  assert.ok(find(app.render(Component, props), node => node.type === 'a' && node.props.href === '/projects'));
});

test('Google Ads lead conversion fires only after confirmed persistence and reuses the submission ID',async()=>{
 const env={NEXT_PUBLIC_GOOGLE_TAG_ID:'AW-123456789',NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL:'unit_lead',NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:'unit_purchase'};
 for(const status of [503,201]){
  const app=setup({realTracking:true,env,localStorage:storage(false,[['prestacerto_tracking_consent','granted']]),sessionStorage:storage(),responses:[{status,body:status===201?{success:true}:{error:'Unavailable'}}]});
  const {tree}=await preparedLanding(app);assert.equal(app.calls.filter(c=>c.kind==='gtag'&&c.args[1]==='conversion').length,0);
  await form(tree).props.onSubmit({preventDefault(){}});
  const conversions=app.calls.filter(c=>c.kind==='gtag'&&c.args[1]==='conversion');assert.equal(conversions.length,status===201?1:0);
  if(status===201){const payload=conversions[0].args[2];assert.equal(payload.send_to,'AW-123456789/unit_lead');assert.equal(payload.transaction_id,'lead:'+app.calls.find(c=>c.kind==='fetch').body.id);assert.deepEqual(Object.keys(payload).sort(),['send_to','transaction_id']);await form(tree).props.onSubmit({preventDefault(){}});assert.equal(app.calls.filter(c=>c.kind==='gtag'&&c.args[1]==='conversion').length,1);}
 }
});
