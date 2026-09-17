const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function setup(reviewResult, reject = false) {
  const freelancer = { id: 'freelancer', full_name: 'Profissional de teste', role: 'freelancer', plan: 'free' };
  const service = { id: 'service', freelancer_id: freelancer.id, title: 'Serviço de teste', description: 'Descrição do serviço.', skills: [], freelancer };
  const database = { from(table) {
    const query = {
      select() { return query; }, eq() { return query; }, then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); },
      single: async () => ({ data: table === 'profiles' ? freelancer : service, error: null }),
      maybeSingle: async () => table === 'reviews' ? reviewResult : ({ data: null, error: null }),
      order() { return query; },
      limit: async () => { if (table === 'reviews') { if (reject) throw new Error('network unavailable'); return reviewResult; } return { data: [], error: null }; },
    }; return query;
  } };
  const cache = {};
  const block = ({ children, ...props }) => React.createElement('div', props, children);
  const mocks = {
    'react': { ...React, cache: fn => fn },
    'next/navigation': { notFound: () => { throw new Error('Not found'); } },
    '@/lib/supabase/server': { createClient: async () => database },
    '@/lib/supabase/categories': { getPublicCategories: async () => [] },
    '@/lib/supabase/service': { createServiceClient: () => database }, '@/lib/search-pagination': {},
    '@/lib/auth/getUser': { getAuthenticatedUser: async () => null },
    '@/lib/auth/destination': { authDestination: () => '/register' },
    '@/lib/seo/metadata': { getPageMetadata: () => ({}), describePage: () => '' },
    '@/lib/seo/discovery': { indexingRobots: index => ({ index, follow: true }) },
    '@/components/ui/badge': { Badge: block }, '@/components/ui/card': { Card: block },
    '@/components/link-button': { LinkButton: ({ children, ...props }) => React.createElement('a', props, children) },
    'lucide-react': { Star: () => null, BadgeCheck: () => null },
  };
  function load(name) {
    if (mocks[name]) return mocks[name];
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const base = `src/${name.slice(2)}`, path = fs.existsSync(base + '.tsx') ? base + '.tsx' : base + '.ts';
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, { module, exports: module.exports, require: load, console: { error() {} } });
    return cache[name] = module.exports;
  }
  return {
    query: load('@/lib/supabase/queries'),
    render: async () => renderToStaticMarkup(await load('@/app/(public)/services/[id]/page').default({ params: Promise.resolve({ id: 'service' }) })),
  };
}

test('missing reviews table and network failures remain unavailable, not zero reviews', async () => {
  for (const [result, reject] of [[{ data: null, error: { code: 'PGRST205' } }, false], [null, true]]) {
    const app = setup(result, reject);
    assert.equal(await app.query.getReviewsForProfile('freelancer'), null);
    assert.equal((await app.query.getPublicProfile('freelancer')).reviews, null);
    const html = await app.render();
    assert.match(html, /Avaliações indisponíveis no momento/);
    assert.doesNotMatch(html, /Avaliações \(0\)|Ainda sem avaliações/);
  }
});
test('a successful empty query still displays a real zero-review state', async () => {
  const app = setup({ data: [], error: null });
  assert.equal((await app.query.getReviewsForProfile('freelancer')).length, 0);
  const html = await app.render();
  assert.match(html, /Avaliações \(0\)/); assert.match(html, /Ainda sem avaliações/);
  assert.doesNotMatch(html, /indisponíveis/);
});
test('public review projection preserves opinions without exposing author or relationship data', async () => {
  const reviews = [{ id: 'review', rating: 5, comment: 'Entrega de teste concluída. <script>alert(1)</script>', created_at: '2026-09-11', author: { full_name: 'Cliente privado' }, author_id: 'private-author-id', project_id: 'private-project-id', contact_email: 'private@example.test' }];
  const app = setup({ data: reviews, error: null });
  const projection = await app.query.getReviewsForProfile('freelancer');
  assert.deepEqual(Object.keys(projection[0]).sort(), ['comment', 'created_at', 'id', 'rating']);
  const html = await app.render();
  assert.match(html, /Avaliações \(1\)/); assert.match(html, /Cliente do projeto/); assert.doesNotMatch(html, /Cliente privado|private-author|private-project|private@example/); assert.match(html, /Entrega de teste concluída/);
  assert.doesNotMatch(html, /indisponíveis|Ainda sem avaliações|<script>/); assert.match(html, /&lt;script&gt;/);
});

test('own review state distinguishes lookup failure from a successful absence', async () => {
  assert.equal(await setup({ data: null, error: { code: 'PGRST205' } }).query.getMyReviewForProject('project','client'), null);
  assert.equal(await setup({ data: null, error: null }).query.getMyReviewForProject('project','client'), false);
  assert.equal(await setup({ data: { id: 'saved' }, error: null }).query.getMyReviewForProject('project','client'), true);
});
