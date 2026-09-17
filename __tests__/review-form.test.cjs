const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const flush = () => new Promise(resolve => setImmediate(resolve));
const nodes = node => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)];
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : !node || typeof node !== 'object' ? '' : [node.props?.children].flat(Infinity).map(text).join('');

function mount(path, exportName, response) {
  const slots = [], pendingEffects = [], cleanups = [], requests = [], timers = new Map();
  let cursor = 0, timerId = 0, unmounted = false, writesAfterUnmount = 0;
  const module = { exports: {} }, cache = {};
  const dependencies = {
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'next/link': { default: 'a' },
    'next/navigation': { useRouter: () => ({ refresh: () => { app.refreshed = true; } }) },
    'react-hook-form': { useForm: () => ({ register: name => ({ name }), handleSubmit: submit => submit, formState: { errors: {} } }) },
    '@hookform/resolvers/zod': { zodResolver: () => null },
    react: {
      useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { if (unmounted) writesAfterUnmount++; slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
      useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
      useEffect(callback, deps) { const i = cursor++; if (!slots[i] || deps.some((d, j) => slots[i][j] !== d)) pendingEffects.push(callback); slots[i] = deps; },
    },
  };
  function load(name) {
    if (dependencies[name]) return dependencies[name];
    if (name === 'lucide-react' || name.startsWith('@/components/ui/') || name === '@/components/link-button') return new Proxy({}, { get: (_, key) => key });
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const mod = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/${name.slice(2)}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module: mod, exports: mod.exports, require: load });
    return cache[name] = mod.exports;
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module, exports: module.exports, require: load, AbortController, Error, console,
    setTimeout: (callback, ms) => { const id = ++timerId; timers.set(id, { callback, ms }); return id; }, clearTimeout: id => timers.delete(id),
    fetch: (url, init) => { requests.push({ url, init }); return response(url, init); },
    navigator: { clipboard: { writeText: async value => { app.copied = value; } } },
  });
  const app = {
    requests, timers, copied: null,
    render() { cursor = 0; const tree = module.exports[exportName]({ projectId: "test-project" }); for (const effect of pendingEffects.splice(0)) { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); } return nodes(tree); },
    unmount() { unmounted = true; for (const cleanup of cleanups) cleanup(); },
    writesAfterUnmount: () => writesAfterUnmount,
    expire() { for (const timer of [...timers.values()]) timer.callback(); },
  };
  app.render(); return app;
}
const review = response => mount('src/components/review-form.tsx', 'ReviewForm', response);
function prepare(app) {
  app.render().find(n => n.type === 'input' && n.props.value === 1).props.onChange();
  app.render().find(n => n.type === 'Textarea').props.onChange({ target: { value: 'Minha opinião sobre a entrega.' } });
  return app.render().find(n => n.type === 'form');
}
const submit = app => prepare(app).props.onSubmit({ preventDefault() {} });
const pendingRequest = (_, init) => new Promise((resolve, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));
test('review form publishes any valid rating only after server persistence, blocking duplicate submission', async () => {
  let finish; const app = review(() => new Promise(resolve => { finish = resolve; }));
  const form = prepare(app); form.props.onSubmit({preventDefault(){}}); form.props.onSubmit({preventDefault(){}});
  assert.equal(app.requests.length, 1); assert.equal(JSON.parse(app.requests[0].init.body).rating, 1);
  assert.equal(app.render().find(n => n.type === 'Button').props.disabled, true);
  finish(Response.json({success:true,review:{id:'persisted'}})); await flush();
  assert.match(text(app.render().find(n=>n.props.role==='status')), /publicada/);
  assert.equal(app.refreshed,true); assert.equal(app.timers.size,0);
});
test('review form keeps the draft and rating on invalid success, duplicates, unavailable DB and connection failure', async () => {
  for (const response of [()=>Response.json({success:true}),()=>Response.json({}),()=>Response.json({error:'Já avaliado.'},{status:409}),()=>Response.json({error:'Indisponível.'},{status:503}),()=>Promise.reject(new Error('offline'))]) {
    const app=review(response);await submit(app);const tree=app.render();
    assert.equal(tree.find(n=>n.type==='Textarea').props.value,'Minha opinião sobre a entrega.');
    assert.equal(tree.find(n=>n.type==='input'&&n.props.value===1).props.checked,true);
    assert.equal(tree.find(n=>n.type==='Button').props.disabled,false);
    assert.ok(tree.some(n=>n.props.role==='alert'));assert.ok(!app.refreshed);
  }
});
test('review timeout recovers and unmount cancels without state writes; controls declare public content and keyboard rating', async () => {
  const app=review(pendingRequest);submit(app);assert.equal([...app.timers.values()][0].ms,30000);app.expire();await flush();
  assert.match(text(app.render().find(n=>n.props.role==='alert')),/mantidos/);
  assert.equal(app.render().find(n=>n.type==='Button').props.disabled,false);
  const removed=review(pendingRequest);submit(removed);removed.unmount();await flush();
  assert.equal(removed.requests[0].init.signal.aborted,true);assert.equal(removed.writesAfterUnmount(),0);
  const initial=review(()=>Response.json({}));const tree=initial.render();
  assert.equal(tree.filter(n=>n.type==='input'&&n.props.type==='radio'&&n.props.required&&n.props['aria-label']).length,5);
  assert.equal(tree.find(n=>n.type==='Textarea').props.maxLength,2000);
  assert.ok(tree.some(n=>text(n).includes('Não inclua telefone, e-mail')));
});
