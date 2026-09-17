const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const lead = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Maria Silva', email: 'maria@example.com',
  createdAt: '2026-09-11T12:00:00Z', status: 'novo', journey: 'client', service: 'Site', whatsapp: '',
  location: 'São Paulo', description: 'Um site institucional.', deadline: '', portfolio: '', experience: '' };
const flush = () => new Promise(resolve => setImmediate(resolve));
function descendants(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(descendants)];
}
function labelText(node) {
  if (typeof node === 'string') return node;
  return [node?.props?.children].flat(Infinity).map(child => typeof child === 'string' ? child : labelText(child)).join('');
}

async function mount(patch) {
  const slots = [];
  const effects = [];
  const requests = [];
  let cursor = 0;
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/components/admin/admin-leads.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, AbortController, AbortSignal, Error,
    fetch: async (url, init) => {
      requests.push({ url, init });
      return init?.method === 'PATCH' ? patch(init) : Response.json({ leads: [lead], hasNext: false });
    },
    require(name) {
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      if (name === 'next/link') return { default: 'a' };
      if (name === 'react') return {
        useState(initial) {
          const index = cursor++;
          if (!(index in slots)) slots[index] = initial;
          return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
        },
        useRef(initial) {
          const index = cursor++;
          if (!(index in slots)) slots[index] = { current: initial };
          return slots[index];
        },
        useEffect(callback, deps) {
          const index = cursor++;
          const previous = slots[index];
          if (!previous || deps.some((value, position) => value !== previous[position])) effects.push(callback);
          slots[index] = deps;
        },
      };
      throw new Error(name);
    },
  });
  const render = () => {
    cursor = 0;
    const tree = module.exports.AdminLeads();
    for (const effect of effects.splice(0)) effect();
    return descendants(tree);
  };
  render();
  await flush();
  return { render, requests };
}

test('status selector is labelled, stays on the saved value while loading and changes only after persistence succeeds', async () => {
  let finish;
  const gate = new Promise(resolve => { finish = resolve; });
  const app = await mount(() => gate);
  let nodes = app.render();
  let select = nodes.find(node => node.type === 'select');
  const label = nodes.find(node => node.type === 'label' && node.props.htmlFor === select.props.id);
  assert.match(labelText(label), /Maria Silva/);
  assert.ok(nodes.some(node => node.props?.id === select.props['aria-describedby']));
  assert.equal(select.props.value, 'novo');
  select.props.onChange({ target: { value: 'em_atendimento' } });
  // A second event before React rerenders must not create another request.
  select.props.onChange({ target: { value: 'convertido' } });
  nodes = app.render();
  select = nodes.find(node => node.type === 'select');
  assert.equal(select.props.value, 'novo');
  assert.equal(select.props.disabled, true);
  assert.equal(select.props['aria-busy'], true);
  assert.ok(nodes.some(node => node.props?.role === 'status' && labelText(node) === 'Salvando status…'));
  const refresh = nodes.find(node => node.type === 'button' && labelText(node) === 'Atualizar');
  assert.equal(refresh.props.disabled, true);
  refresh.props.onClick();
  assert.equal(app.requests.length, 2);
  const payload = JSON.parse(app.requests[1].init.body);
  assert.deepEqual(payload, { id: lead.id, status: 'em_atendimento', expectedStatus: 'novo' });
  finish(Response.json({ success: true, id: lead.id, status: 'em_atendimento' }));
  await flush();
  select = app.render().find(node => node.type === 'select');
  assert.equal(select.props.value, 'em_atendimento');
  assert.equal(select.props.disabled, false);
});

test('failed or conflicting status updates preserve the previous selection and display an accessible error', async () => {
  for (const status of [409, 503]) {
    const app = await mount(() => Response.json({ error: 'Atualize a lista antes de tentar novamente.' }, { status }));
    app.render().find(node => node.type === 'select').props.onChange({ target: { value: 'convertido' } });
    await flush();
    const nodes = app.render();
    const select = nodes.find(node => node.type === 'select');
    assert.equal(select.props.value, 'novo');
    assert.equal(select.props.disabled, false);
    const alert = nodes.find(node => node.props?.role === 'alert');
    assert.match(labelText(alert), /Atualize a lista/);
    assert.equal(select.props['aria-describedby'], alert.props.id);
  }
});

test('an invalid success response cannot falsely change the displayed lead status', async () => {
  const app = await mount(() => Response.json({ success: true, id: 'another-lead', status: 'convertido' }));
  app.render().find(node => node.type === 'select').props.onChange({ target: { value: 'convertido' } });
  await flush();
  const nodes = app.render();
  assert.equal(nodes.find(node => node.type === 'select').props.value, 'novo');
  assert.ok(nodes.some(node => node.props?.role === 'alert'));
});
