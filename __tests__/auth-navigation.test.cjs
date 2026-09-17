/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function compile(file, scope) {
  const loaded = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText, { module: loaded, exports: loaded.exports, Response, AbortController, ...scope });
  return loaded.exports;
}
function api(options = {}) {
  const calls = [];
  const db = { auth: { async getUser() {
    calls.push('verified-user');
    if (options.throws) throw Error('private credentials');
    return { data: { user: options.user || null }, error: options.authError || null };
  } }, from(table) {
    calls.push(table);
    return { select(fields) { calls.push(fields); return this; }, eq(key, value) { calls.push([key, value]); return this; },
      async maybeSingle() { return { data: options.profile || null, error: options.profileError || null }; } };
  } };
  const loaded = compile('src/app/api/auth/navigation/route.ts', { require(name) {
    assert.equal(name, '@/lib/supabase/server'); return { createClient: async () => db };
  } });
  return { ...loaded, calls };
}
test('navigation API verifies auth and returns only signedIn/allowed role with private no-store', async () => {
  for (const role of ['client', 'freelancer', 'both', 'admin', 'private@example.com']) {
    const s = api({ user: { id: 'verified-owner', email: 'private@example.com', user_metadata: { role: 'both' } }, profile: { role } });
    const response = await s.GET();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('vary'), 'Cookie');
    assert.deepEqual(await response.json(), { signedIn: true, role: ['client', 'freelancer', 'both'].includes(role) ? role : null });
    assert.deepEqual(s.calls, ['verified-user', 'profiles', 'role', ['id', 'verified-owner']]);
  }
  const fallback = api({ user: { id: 'owner', user_metadata: { role: 'client' } } });
  assert.deepEqual(await (await fallback.GET()).json(), { signedIn: true, role: 'client' });
});
test('anonymous navigation needs no profile query; failures expose no credentials or false signed-in state', async () => {
  for (const options of [{}, { authError: { name: 'AuthSessionMissingError' } }]) {
    const s = api(options); const response = await s.GET();
    assert.deepEqual(await response.json(), { signedIn: false, role: null });
    assert.deepEqual(s.calls, ['verified-user']);
  }
  for (const options of [{ throws: true }, { authError: { name: 'AuthRetryableFetchError', message: 'secret' } }, { user: { id: 'owner' }, profileError: { message: 'secret' } }]) {
    const response = await api(options).GET();
    assert.equal(response.status, 503); assert.match(response.headers.get('cache-control'), /private.*no-store/);
    assert.deepEqual(await response.json(), { error: 'navigation_unavailable' });
  }
});

function browser(options = {}) {
  let pathname = options.path || '/', cursor = 0;
  const states = [], pendingEffects = [], cleanups = [], listeners = new Map(), timers = new Map(), calls = [];
  let timerId = 0;
  const react = {
    createContext(value) { const context = { value }; context.Provider = { context }; return context; },
    useContext(context) { return context.value; },
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; },
    useEffect(fn, deps) { const i = cursor++; const old = states[i]; if (!old || deps.some((v, n) => v !== old[n])) { states[i] = deps; pendingEffects.push(() => { cleanups[i]?.(); cleanups[i] = fn(); }); } },
  };
  const jsx = (type, props) => { if (type?.context) type.context.value = props.value; return { type, props }; };
  const window = { addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); }, removeEventListener(name, fn) { listeners.get(name)?.delete(fn); } };
  let loaded;
  const requireModule = name => {
    if (name === 'react') return react;
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (name === 'next/navigation') return { usePathname: () => pathname };
    if (name === 'next/link') return { default: 'a' };
    if (name === 'next/dynamic') return { default: () => 'LogoutButton' };
    if (name === 'lucide-react') return new Proxy({}, { get: (_target, key) => key });
    if (name === '@/components/logo') return { Logo: 'Logo' };
    if (name === '@/components/mobile-site-menu') return { MobileSiteMenu: 'MobileSiteMenu' };
    if (name === '@/components/auth/auth-navigation') return loaded;
    throw Error('Unexpected client dependency: ' + name);
  };
  const scope = { require: requireModule, window,
    fetch: async (url, init) => { calls.push({ url, init }); return options.fetch ? options.fetch(url, init) : Response.json({ signedIn: true, role: 'client' }); },
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout(id) { timers.delete(id); },
  };
  loaded = compile('src/components/auth/auth-navigation.tsx', scope);
  return { ...loaded, calls, timers, states,
    render() { cursor = 0; return loaded.AuthNavigationProvider({ children: ['header', 'footer'] }); },
    flush() { pendingEffects.splice(0).forEach(fn => fn()); }, path(value) { pathname = value; },
    emit(name, event = {}) { for (const fn of listeners.get(name) || []) fn(event); },
    cleanup() { cleanups.forEach(fn => fn?.()); },
    component(file, name) { return compile(file, scope)[name](); },
  };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
const plain = value => JSON.parse(JSON.stringify(value));
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
test('public SSR and hydration match; one deferred request serves both header and footer', async () => {
  const s = browser();
  assert.deepEqual(plain(s.render().props.value), { signedIn: false, role: null, status: 'loading' });
  assert.deepEqual(plain(s.render().props.value), { signedIn: false, role: null, status: 'loading' });
  s.useAuthNavigation(); s.useAuthNavigation(); assert.equal(s.calls.length, 0);
  s.flush(); assert.equal(s.calls.length, 1); await tick(); s.render();
  assert.deepEqual(plain(s.useAuthNavigation()), { signedIn: true, role: 'client', status: 'ready' });
  assert.equal(s.calls[0].url, '/api/auth/navigation');
  assert.equal(s.calls[0].init.credentials, 'same-origin'); assert.equal(s.calls[0].init.cache, 'no-store');
  s.emit('pageshow', { persisted: false }); assert.equal(s.calls.length, 1);
  s.cleanup();
});
test('campaign pages do not fetch a session; navigation resets state and rechecks the current account', async () => {
  for (const path of ['/para-clientes', '/para-prestadores']) {
    const s = browser({ path }); s.render(); s.flush(); assert.equal(s.calls.length, 0);
    s.path('/dashboard'); s.render(); s.flush(); await tick(); s.render(); assert.equal(s.useAuthNavigation().signedIn, true);
    s.path('/services'); assert.equal(s.render().props.value.signedIn, false); s.flush(); await tick(); s.render(); assert.equal(s.calls.length, 2);
    s.path(path); s.render(); s.flush(); assert.equal(s.useAuthNavigation().signedIn, false); assert.equal(s.calls.length, 2); s.cleanup();
  }
});
test('cleanup aborts requests and ignores stale responses after a route change', async () => {
  const resolvers = []; const s = browser({ fetch: () => new Promise(resolve => resolvers.push(resolve)) });
  s.render(); s.flush(); s.path('/services'); s.render(); s.flush();
  assert.equal(s.calls[0].init.signal.aborted, true);
  resolvers[1](Response.json({ signedIn: false, role: null })); await tick(); s.render();
  resolvers[0](Response.json({ signedIn: true, role: 'client' })); await tick(); s.render();
  assert.equal(s.useAuthNavigation().signedIn, false);
  s.emit('focus'); assert.equal(s.calls.length, 3); s.cleanup(); assert.equal(s.calls[2].init.signal.aborted, true);
  resolvers[2](Response.json({ signedIn: true, role: 'client' })); await tick(); s.render(); assert.equal(s.useAuthNavigation().signedIn, false);
});
test('an unresponsive navigation request times out without blocking the public shell', async () => {
  const s = browser({ fetch: (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(Error('aborted')));
  }) });
  assert.deepEqual(plain(s.render().props.children), ['header', 'footer']); s.flush();
  for (const timeout of s.timers.values()) timeout(); await tick(); s.render();
  assert.equal(s.calls[0].init.signal.aborted, true); assert.equal(s.useAuthNavigation().status, 'error'); s.cleanup();
});
test('network errors preserve recoverable account navigation and verified clients get the client footer', async () => {
  for (const fetch of [async () => { throw Error('offline'); }, async () => Response.json({}, { status: 503 }), async () => Response.json({ signedIn: 'true' })]) {
    const s = browser({ fetch }); s.render(); s.flush(); await tick(); s.render();
    assert.equal(s.useAuthNavigation().status, 'error');
    const header = nodes(s.component('src/components/site-header.tsx', 'SiteHeader'));
    assert.ok(header.some(node => node.props?.href === '/dashboard' && node.props.children === 'Minha conta'));
    assert.ok(header.some(node => node.type === 'MobileSiteMenu' && node.props.signedIn === true));
    assert.ok(!header.some(node => node.type === 'LogoutButton')); s.cleanup();
  }
  const s = browser(); s.render();
  const publicFooter = s.component('src/components/site-footer.tsx', 'SiteFooter');
  assert.match(JSON.stringify(publicFooter), /Para freelancers/);
  s.flush(); await tick(); s.render();
  const clientFooter = s.component('src/components/site-footer.tsx', 'SiteFooter');
  assert.doesNotMatch(JSON.stringify(clientFooter), /Para freelancers|\/certo-ai/);
  const header = nodes(s.component('src/components/site-header.tsx', 'SiteHeader'));
  assert.ok(header.some(node => node.props?.href === '/dashboard' && node.props.children === 'Meu painel'));
  assert.ok(header.some(node => node.type === 'LogoutButton')); s.cleanup();
});
test('the shared shell has no server auth/cookie or browser Supabase dependency', () => {
  for (const file of ['src/app/layout.tsx', 'src/components/site-header.tsx', 'src/components/site-footer.tsx', 'src/components/auth/auth-navigation.tsx']) {
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /from\s+['"](?:next\/headers|@\/lib\/auth\/getUser|@\/lib\/supabase\/|@supabase\/)/, file);
  }
});
