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
    render() { cursor = 0; const tree = module.exports[exportName](); for (const effect of pendingEffects.splice(0)) { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); } return nodes(tree); },
    unmount() { unmounted = true; for (const cleanup of cleanups) cleanup(); },
    writesAfterUnmount: () => writesAfterUnmount,
    expire() { for (const timer of [...timers.values()]) timer.callback(); },
  };
  app.render(); return app;
}
const ai = response => mount('src/components/proposal/certo-ai-optimizer.tsx', 'CertoAIOptimizer', response);
function prepareAi(app) {
  app.render().find(n => n.type === 'textarea').props.onChange({ target: { value: 'Minha proposta original com escopo e prazo.' } });
  return app.render().find(n => n.type === 'button' && text(n).includes('Melhorar'));
}
const pendingRequest = (_, init) => new Promise((resolve, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));

test('Certo AI blocks duplicate requests, presents a valid suggestion and copies the actual returned text', async () => {
  let finish; const app = ai(() => new Promise(resolve => { finish = resolve; }));
  const button = prepareAi(app); button.props.onClick(); button.props.onClick();
  assert.equal(app.requests.length, 1);
  assert.equal(app.render().find(n => n.type === 'textarea').props.disabled, true);
  finish(Response.json({ improved: '  Sugestão recebida e pronta para revisão.  ', remainingFree: 2 })); await flush();
  const copy = app.render().find(n => n.type === 'button' && text(n).includes('Copiar sugestão'));
  await copy.props.onClick(); assert.equal(app.copied, 'Sugestão recebida e pronta para revisão.');
  assert.ok(app.render().some(n => text(n).includes('restantes neste mês: 2')));
  assert.equal(app.timers.size, 0);
});
test('Certo AI preserves the draft and displays an error for invalid 200 responses, HTTP errors and offline requests', async () => {
  for (const response of [() => Response.json({}), () => Response.json({ improved: ' ' }), () => Response.json({ improved: { text: 'Wrong type' } }), () => new Response('<html>error</html>'), () => Response.json({ error: 'Cota esgotada.', upgrade: true }, { status: 429 }), () => Promise.reject(new TypeError('Failed to fetch'))]) {
    const app = ai(response); prepareAi(app).props.onClick(); await flush(); const tree = app.render();
    assert.equal(tree.find(n => n.type === 'textarea').props.value, 'Minha proposta original com escopo e prazo.');
    assert.equal(tree.find(n => n.type === 'button').props.disabled, false);
    assert.ok(tree.some(n => n.props.role === 'alert'));
    assert.ok(!tree.some(n => n.type === 'button' && text(n).includes('Copiar sugestão')));
  }
});
test('Certo AI timeout releases the form, and unmount cancels the request without updating removed UI', async () => {
  const app = ai(pendingRequest); prepareAi(app).props.onClick();
  assert.equal([...app.timers.values()][0].ms, 35000); app.expire(); await flush();
  assert.match(text(app.render().find(n => n.props.role === 'alert')), /demorou.*preservado/);
  assert.equal(app.render().find(n => n.type === 'button').props.disabled, false);
  const removed = ai(pendingRequest); prepareAi(removed).props.onClick(); removed.unmount(); await flush();
  assert.equal(removed.requests[0].init.signal.aborted, true); assert.equal(removed.writesAfterUnmount(), 0);
});
const benchmark = response => mount('src/app/(public)/ferramentas/benchmark/page.tsx', 'default', response);
function prepareBenchmark(app) {
  for (const [id, value] of [['benchmark-category', 'design-grafico'], ['benchmark-city', 'sao-paulo']]) app.render().find(n => n.props.id === id).props.onChange({ target: { value } });
  return app.render().find(n => n.type === 'button');
}
test('benchmark renders insufficient-data state without invented prices, and clears the result when criteria change', async () => {
  const app = benchmark(() => Response.json({ available: false, sampleSize: 2, minSampleSize: 3 }));
  prepareBenchmark(app).props.onClick(); await flush(); const tree = app.render();
  assert.match(text(tree.find(n => n.props.role === 'status')), /não há dados suficientes/);
  assert.ok(!tree.some(n => text(n).includes('Mediana do mercado')));
  tree.find(n => n.props.id === 'benchmark-city').props.onChange({ target: { value: 'rio-de-janeiro' } });
  assert.ok(!app.render().some(n => n.props.role === 'status'));
});
test('benchmark shows sample provenance only for a valid response; HTTP and malformed results produce visible errors', async () => {
  const good = benchmark(() => Response.json({ available: true, sampleSize: 3, mediana: 1200, p25: 1000, p75: 1400, comparacao: 25 }));
  prepareBenchmark(good).props.onClick(); await flush();
  assert.ok(good.render().some(n => text(n).includes('3 propostas aceitas')));
  for (const response of [() => Response.json({ available: true, sampleSize: 3 }), () => Response.json({ error: 'Referências indisponíveis.' }, { status: 503 }), () => Promise.reject(new TypeError('Offline'))]) {
    const app = benchmark(response); prepareBenchmark(app).props.onClick(); await flush();
    assert.ok(app.render().some(n => n.props.role === 'alert'));
    assert.equal(app.render().find(n => n.props.id === 'benchmark-price').props.value, 1500);
    assert.equal(app.render().find(n => n.type === 'button').props.disabled, false);
  }
});
const contact = response => mount('src/components/contact-form.tsx', 'ContactForm', response);
const contactValues = { name: 'Pessoa Teste', email: 'test@example.com', subject: 'Teste', message: 'Mensagem de teste sem envio externo.' };
test('contact form recovers from a network failure and does not report success for malformed HTTP 200', async () => {
  for (const response of [() => Promise.reject(new TypeError('Offline')), () => Response.json({}), () => Response.json({ error: 'Tente novamente.' }, { status: 503 })]) {
    const app = contact(response); app.render().find(n => n.type === 'form').props.onSubmit(contactValues); await flush();
    assert.ok(app.render().some(n => n.props.role === 'alert'));
    assert.ok(app.render().some(n => n.type === 'form'));
    assert.equal(app.render().find(n => n.type === 'Button').props.disabled, false);
    assert.deepEqual(JSON.parse(app.requests[0].init.body), contactValues);
  }
});
test('contact form confirms actual successful response and rejects duplicate submissions while pending', async () => {
  let finish; const app = contact(() => new Promise(resolve => { finish = resolve; }));
  const form = app.render().find(n => n.type === 'form'); form.props.onSubmit(contactValues); form.props.onSubmit(contactValues);
  assert.equal(app.requests.length, 1); finish(Response.json({ success: true }, { status: 201 })); await flush();
  assert.match(text(app.render().find(n => n.props.role === 'status')), /Mensagem recebida/);
});
