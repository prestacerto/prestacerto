/* eslint-disable @typescript-eslint/no-require-imports -- Local mocked handlers; no remote data. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const id = '11111111-1111-4111-8111-111111111111';
const owner = '22222222-2222-4222-8222-222222222222';
const actionsPath = '@/app/(protected)/dashboard/services/actions';
function setup(options = {}) {
  const calls = [], rows = new Map(options.rows || []), cache = new Map(), state = [], effects = [];
  let cursor = 0, networkIndex = 0;
  const user = options.user === undefined ? { id: owner } : options.user;
  class HTMLElement { focus() { calls.push(['focus']); } }
  const react = {
    useState(value) { const key = cursor++; if (!(key in state)) state[key] = value; return [state[key], next => { state[key] = typeof next === 'function' ? next(state[key]) : next; }]; },
    useRef(value) { const key = cursor++; if (!(key in state)) state[key] = { current: value }; return state[key]; },
    useEffect(fn) { effects.push(fn); },
  };
  function result(query) {
    calls.push(['query', query]);
    if (options.dbError) return { data: null, error: { message: 'private database error' } };
    if (query.mode === 'insert') { rows.set(id, { id, is_active: true, ...query.payload }); return { data: { id }, error: null }; }
    const row = rows.get(query.filters.id);
    if (query.mode === 'select' && !query.filters.id) return { data: [...rows.values()].filter(item => item.freelancer_id === query.filters.freelancer_id), error: null };
    if (!row || row.freelancer_id !== query.filters.freelancer_id) return { data: null, error: null };
    if (query.mode === 'delete') rows.delete(id);
    if (query.mode === 'update') rows.set(id, { ...row, ...query.payload });
    return { data: query.mode === 'select' ? row : { id }, error: null };
  }
  const db = { from(table) {
    const query = { table, mode: 'select', filters: {} };
    const q = { insert(payload) { Object.assign(query, { mode: 'insert', payload }); return q; }, update(payload) { Object.assign(query, { mode: 'update', payload }); return q; }, delete() { query.mode = 'delete'; return q; }, eq(key, value) { query.filters[key] = value; return q; }, select() { return q; }, order() { return q; }, maybeSingle: async () => result(query), then(ok, fail) { return Promise.resolve(result(query)).then(ok, fail); } };
    return q;
  } };
  const navigation = { push: value => calls.push(['push', value]), refresh: () => calls.push(['refresh']) };
  const mocks = {
    react,
    'next/cache': { revalidatePath: value => calls.push(['revalidate', value]) },
    'next/navigation': { useRouter: () => navigation, redirect: value => { throw Error(`REDIRECT:${value}`); }, notFound: () => { throw Error('NOT_FOUND'); } },
    'next/link': { __esModule: true, default: 'a' },
    '@/lib/auth/getUser': { getAuthenticatedUser: async () => user },
    '@/lib/supabase/server': { createClient: async () => db },
    '@/lib/supabase/queries': { getCategories: async () => [] },
    '@/lib/seo/metadata': { getNoIndexMetadata: title => ({ title, robots: { index: false } }) },
    '@/components/auth/auth-card': { AuthCard: 'auth-card' },
    '@/components/auth/login-form': { LoginForm: 'login-form' },
    '@/components/auth/register-form': { RegisterForm: 'register-form' },
    '@/components/ui/button': { Button: 'button' },
    '@/components/ui/textarea': { Textarea: 'textarea' },
    sonner: { toast: { error: (...args) => calls.push(['toast-error', ...args]) } },
    ...(options.action ? { [actionsPath]: { createServiceAction: values => { calls.push(['action', values]); return options.action(); }, updateServiceAction: (serviceId, values) => { calls.push(['action', values, serviceId]); return options.action(); }, deleteServiceAction: serviceId => { calls.push(['delete', serviceId]); return options.action(); }, toggleServiceActiveAction: (serviceId, active) => { calls.push(['toggle', serviceId, active]); return options.action(); } } } : {}),
  };
  function load(name) {
    if (mocks[name]) return mocks[name];
    if (!name.startsWith('@/')) return require(name);
    const base = path.join(process.cwd(), 'src', name.slice(2));
    const file = ['.ts', '.tsx'].map(ext => base + ext).find(candidate => fs.existsSync(candidate));
    if (cache.has(file)) return cache.get(file);
    const mod = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    vm.runInNewContext(code, { module: mod, exports: mod.exports, require: load, URL, URLSearchParams, console, HTMLElement, FormData: class { constructor(form) { return form.values; } }, fetch: async (url, init) => { calls.push(['fetch', url, JSON.parse(init.body)]); const response = options.responses?.[networkIndex++]; if (response instanceof Error) throw response; return { ok: response?.ok ?? true, json: async () => response?.body || { message: { id } } }; } });
    cache.set(file, mod.exports); return mod.exports;
  }
  return { load, calls, rows, render(Component, props) { cursor = 0; return Component(props); }, runEffects() { effects.splice(0).forEach(fn => fn()); } };
}
const values = overrides => { const form = new FormData(); Object.entries({ title: ' Serviço de design ', description: 'Criação de identidade visual com revisão e entrega dos arquivos.', categoryId: '', skills: 'design, marca, design', priceHour: '', deliveryDays: '', ...overrides }).forEach(([key, value]) => form.set(key, value)); return form; };
const nodes = tree => tree && typeof tree === 'object' ? [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)] : [];
const find = (tree, predicate) => nodes(tree).find(predicate);

test('fractional cents cannot become a free service after currency rounding', async () => {
  const app = setup();
  assert.equal((await app.load(actionsPath).createServiceAction(values({ priceHour: '0.001' }))).success, false);
  assert.equal(app.rows.size, 0);
  assert.equal((await app.load(actionsPath).createServiceAction(values({ priceHour: '0.01' }))).success, true);
  assert.equal(app.rows.get(id).price_hour, 0.01);
});

test('service lifecycle writes only the authenticated owner and confirms each affected row', async () => {
  const app = setup(), action = app.load(actionsPath);
  assert.equal((await action.createServiceAction(values({ freelancer_id: 'attacker', priceHour: '123.45', deliveryDays: '10' }))).success, true);
  assert.equal(app.rows.get(id).freelancer_id, owner);
  assert.equal(app.rows.get(id).title, 'Serviço de design');
  assert.equal(app.rows.get(id).skills.join(','), 'design,marca');
  assert.equal((await action.updateServiceAction(id, values())).success, true);
  assert.equal(app.rows.get(id).price_hour, null);
  assert.equal((await action.toggleServiceActiveAction(id, false)).success, true);
  assert.equal(app.rows.get(id).is_active, false);
  assert.equal((await action.toggleServiceActiveAction(id, true)).success, true);
  assert.equal((await action.deleteServiceAction(id)).success, true);
  assert.equal(app.rows.size, 0);
  for (const [, query] of app.calls.filter(call => call[0] === 'query' && call[1].mode !== 'insert')) assert.equal(query.filters.freelancer_id, owner);
});
test('visitors, malformed values and forged ownership never get successful mutations', async () => {
  const visitor = setup({ user: null });
  assert.equal((await visitor.load(actionsPath).createServiceAction(values())).success, false);
  assert.equal(visitor.calls.length, 0);
  for (const invalid of [{ title: 'x' }, { description: 'short' }, { categoryId: '-1' }, { priceHour: '-5' }, { deliveryDays: '0' }, { skills: 'x'.repeat(81) }]) {
    const app = setup();
    assert.equal((await app.load(actionsPath).createServiceAction(values(invalid))).success, false);
    assert.equal(app.rows.size, 0);
  }
  const app = setup({ rows: [[id, { id, freelancer_id: 'another-user', title: 'Other service' }]] });
  const action = app.load(actionsPath);
  for (const result of [await action.updateServiceAction(id, values()), await action.toggleServiceActiveAction(id, false), await action.deleteServiceAction(id)]) assert.equal(result.success, false);
  assert.equal(app.rows.get(id).title, 'Other service');
  assert.equal(app.calls.filter(call => call[0] === 'revalidate').length, 0);
});
test('database errors and zero affected rows are displayed as failure, including pause and delete', async () => {
  for (const options of [{ dbError: true }, {}]) {
    const app = setup(options), action = app.load(actionsPath);
    assert.equal((await action.updateServiceAction(id, values())).success, false);
    assert.equal((await action.toggleServiceActiveAction(id, false)).success, false);
    assert.equal((await action.deleteServiceAction(id)).success, false);
    assert.equal(app.calls.filter(call => call[0] === 'revalidate').length, 0);
  }
});
test('restored pages redirect visitors with destination and deny editing another persons service', async () => {
  for (const route of ['/page', '/new/page', `/${'[id]'}/edit/page`]) {
    const app = setup({ user: null });
    await assert.rejects(app.load(`@/app/(protected)/dashboard/services${route}`).default({ params: Promise.resolve({ id }) }), /REDIRECT:\/login\?next=/);
  }
  const app = setup({ rows: [[id, { id, freelancer_id: 'other' }]] });
  await assert.rejects(app.load('@/app/(protected)/dashboard/services/[id]/edit/page').default({ params: Promise.resolve({ id }) }), /NOT_FOUND/);
});
test('service form prevents duplicate submit, retains fields after failure and navigates only after success', async () => {
  let finish;
  const app = setup({ action: () => new Promise(resolve => { finish = resolve; }) });
  const Component = app.load('@/components/services/service-form').ServiceForm;
  const props = { categories: [] };
  const element = { values: values(), elements: { namedItem: () => null }, reset() { assert.fail('must retain user fields'); } };
  const tree = app.render(Component, props);
  const submit = find(tree, node => node.type === 'form').props.onSubmit;
  const event = { preventDefault() {}, currentTarget: element };
  const first = submit(event); await submit(event);
  assert.equal(app.calls.filter(call => call[0] === 'action').length, 1);
  finish({ success: false, error: 'Tente novamente.', errors: { title: 'Confira o título.' } }); await first;
  assert.ok(find(app.render(Component, props), node => node.props?.role === 'alert'));
  assert.equal(app.calls.filter(call => call[0] === 'push').length, 0);
  const retry = find(app.render(Component, props), node => node.type === 'form').props.onSubmit(event);
  finish({ success: true, id }); await retry;
  assert.deepEqual(app.calls.find(call => call[0] === 'push'), ['push', '/dashboard/services']);
});
test('delete requires an explicit second click and failure remains visible', async () => {
  const app = setup({ action: async () => ({ success: false, error: 'Não foi excluído.' }) });
  const Component = app.load('@/components/services/service-controls').ServiceControls, props = { id, active: true };
  find(app.render(Component, props), node => node.type === 'button' && node.props.children === 'Excluir').props.onClick();
  assert.equal(app.calls.length, 0);
  await find(app.render(Component, props), node => node.type === 'button' && node.props.children === 'Confirmar exclusão').props.onClick();
  assert.equal(app.calls.filter(call => call[0] === 'delete').length, 1);
  assert.ok(find(app.render(Component, props), node => node.props?.role === 'alert'));
});
test('authenticated login and register preserve next and avoid redirect loops', async () => {
  for (const mode of ['login', 'register']) {
    for (const [next, expected] of [['/dashboard/services/new', '/dashboard/services/new'], ['/publicar-projeto', '/publicar-projeto'], ['/login?next=%2Fregister', '/dashboard'], ['https://other.example', '/dashboard']]) {
      const page = setup().load(`@/app/(auth)/${mode}/page`).default;
      await assert.rejects(page({ searchParams: Promise.resolve({ next }) }), error => error.message === `REDIRECT:${expected}`);
    }
  }
});
test('message Enter cannot duplicate an in-flight request and unknown persistence keeps the draft', async () => {
  const app = setup({ responses: [{ body: { success: true } }, { body: { message: { id } } }] });
  const Component = app.load('@/components/message-thread').MessageThread, props = { proposalId: id, messages: [], currentUserId: owner };
  find(app.render(Component, props), node => node.type === 'textarea').props.onChange({ target: { value: 'Mensagem preservada' } });
  let tree = app.render(Component, props);
  const first = find(tree, node => node.type === 'button').props.onClick();
  find(tree, node => node.type === 'textarea').props.onKeyDown({ key: 'Enter', preventDefault() {} });
  await first;
  assert.equal(app.calls.filter(call => call[0] === 'fetch').length, 1);
  assert.equal(app.calls.find(call => call[0] === 'fetch')[1], `/api/proposals/${id}/messages`);
  tree = app.render(Component, props);
  assert.equal(find(tree, node => node.type === 'textarea').props.value, 'Mensagem preservada');
  await find(tree, node => node.type === 'button').props.onClick();
  assert.equal(find(app.render(Component, props), node => node.type === 'textarea').props.value, '');
});
