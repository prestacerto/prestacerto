const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const projectId = '00000000-0000-4000-8000-000000000010';
const clientId = '00000000-0000-4000-8000-000000000001';
const providerId = '00000000-0000-4000-8000-000000000002';
function setup(options = {}) {
  const calls = [], inserts = [], cache = {};
  const results = {
    projects: { data: { id: projectId, client_id: clientId, status: 'closed' }, error: null },
    proposals: { data: { freelancer_id: providerId }, error: null },
    reviews: { data: { id: 'persisted-review' }, error: null },
    ...options.results,
  };
  const database = { from(table) {
    calls.push(table);
    const query = {
      select() { return query; }, eq() { return query; },
      insert(row) { inserts.push(row); return query; },
      maybeSingle: async () => results[table], single: async () => results[table],
    }; return query;
  } };
  const mocks = {
    'next/server': { NextResponse: Response },
    '@/lib/auth/getUser': { getAuthenticatedUser: async () => options.user === undefined ? { id: clientId } : options.user },
    '@/lib/supabase/server': { createClient: async () => { if (options.throwDatabase) throw new Error('private database detail'); return database; } },
  };
  function load(name) {
    if (mocks[name]) return mocks[name];
    if (!name.startsWith('@/')) return require(name);
    if (cache[name]) return cache[name];
    const module = { exports: {} };
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/${name.slice(2)}.ts`,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { module, exports: module.exports, require: load, Response, Buffer, console });
    return cache[name] = module.exports;
  }
  const post = load('@/app/api/reviews/route').POST;
  return { calls, inserts, post: (body = { projectId, rating: 5, comment: '  Entrega real.  ' }) => post(new Request('https://example.test/api/reviews', { method:'POST',headers:{'content-type':'application/json'},body: typeof body === 'string' ? body : JSON.stringify(body) })) };
}
test('review input is strictly validated before database access', async () => {
  for (const body of [null, [], '{broken', {projectId,rating:'5'}, {projectId,rating:2.5}, {projectId,rating:0}, {projectId,rating:6}, {projectId:'wrong',rating:5}, {projectId,rating:5,comment:{}}, {projectId,rating:5,comment:'x'.repeat(2001)}, {projectId,rating:5,target_id:clientId}, {projectId,rating:5,author_id:providerId}]) {
    const app = setup(); assert.equal((await app.post(body)).status,400); assert.equal(app.calls.length,0); assert.equal(app.inserts.length,0);
  }
  const tooLarge=setup(); assert.equal((await tooLarge.post({projectId,rating:5,comment:'x'.repeat(13000)})).status,413); assert.equal(tooLarge.calls.length,0);
});
test('only the authenticated project client may review a closed project with accepted provider', async () => {
  const anonymous = setup({user:null}); assert.equal((await anonymous.post()).status,401); assert.equal(anonymous.calls.length,0);
  for (const user of [{id:providerId},{id:'stranger'}]) {const app=setup({user});assert.equal((await app.post()).status,403);assert.equal(app.inserts.length,0);}
  for (const status of ['open','in_progress','cancelled']) {
    const app=setup({results:{projects:{data:{id:projectId,client_id:clientId,status},error:null}}});assert.equal((await app.post()).status,409);assert.equal(app.inserts.length,0);
  }
  for (const proposal of [null,{freelancer_id:clientId}]) {const app=setup({results:{proposals:{data:proposal,error:null}}}); assert.equal((await app.post()).status,409);assert.equal(app.inserts.length,0);}
});
test('success requires a persisted row and derives immutable parties from server data', async () => {
  const app=setup(); const response=await app.post(); assert.equal(response.status,201); assert.deepEqual(await response.json(),{success:true,review:{id:'persisted-review'}});
  assert.deepEqual(JSON.parse(JSON.stringify(app.inserts)),[{project_id:projectId,author_id:clientId,target_id:providerId,rating:5,comment:'Entrega real.'}]);
  const missing=setup({results:{reviews:{data:null,error:null}}}); assert.equal((await missing.post()).status,503);
  const emptyComment=setup();await emptyComment.post({projectId,rating:1,comment:'   '});assert.equal(emptyComment.inserts[0].comment,null);
});
test('duplicates and state changes never become success; database failures remain recoverable and private', async () => {
  for (const [code,status] of [['23505',409],['42501',403],['PGRST205',503],['XX000',503]]) {
    const app=setup({results:{reviews:{data:null,error:{code,message:'SECRET internal SQL'}}}}); const response=await app.post(); assert.equal(response.status,status);assert.doesNotMatch(await response.text(),/SECRET|success/);
  }
  for (const table of ['projects','proposals']) {
    const app=setup({results:{[table]:{data:null,error:{message:'SECRET schema'}}}});assert.equal((await app.post()).status,503);assert.equal(app.inserts.length,0);
  }
  assert.equal((await setup({throwDatabase:true}).post()).status,503);
  assert.equal((await setup({results:{projects:{data:null,error:null}}}).post()).status,404);
});

function reviewSection(state) {
  let calls=0; const module={exports:{}};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/projects/project-review-section.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText, {
    module,exports:module.exports,require(name) {
      if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
      if(name==='next/link')return {default:'a'};
      if(name==='@/components/review-form')return {ReviewForm:'ReviewForm'};
      if(name==='@/lib/supabase/queries')return {getMyReviewForProject:async()=>{calls++;return state;}};
      throw new Error(name);
    },
  });
  return {calls:()=>calls,render:props=>module.exports.ProjectReviewSection({projectId,clientId,status:'closed',acceptedFreelancerId:providerId,userId:clientId,...props})};
}
const descendants=node=>!node||typeof node!=='object'?[]:[node,...[node.props?.children].flat(Infinity).flatMap(descendants)];
test('project review UI is available only to the legitimate client after completion and accepted proposal', async()=>{
  for(const props of [{userId:undefined},{userId:providerId},{userId:'stranger'},{status:'in_progress'},{acceptedFreelancerId:null},{acceptedFreelancerId:clientId}]){
    const app=reviewSection(false);assert.equal(await app.render(props),null);assert.equal(app.calls(),0);
  }
  const app=reviewSection(false);const tree=descendants(await app.render());assert.ok(tree.some(n=>n.type==='ReviewForm'));assert.equal(app.calls(),1);
});
test('project review UI shows unavailable or already reviewed instead of inviting unsafe duplicate writes', async()=>{
  for(const state of [null,true]) {
    const app=reviewSection(state);const tree=descendants(await app.render());assert.ok(!tree.some(n=>n.type==='ReviewForm'));assert.ok(tree.some(n=>n.props.role==='status'));
    if(state===true)assert.ok(tree.some(n=>n.props.href===`/perfil/${providerId}#avaliacoes`));
  }
});
