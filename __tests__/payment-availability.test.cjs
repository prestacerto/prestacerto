/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { NextResponse } = require('next/server');

test('unavailable Assiny operations never charge or write data', async () => {
  for (const user of [null, { id: 'signed-in-user' }]) {
    const target = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync('src/lib/payments/availability.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(code, {
      module: target, exports: target.exports,
      require(name) {
        if (name === 'server-only') return {};
        if (name === 'next/server') return { NextResponse };
        if (name === '@/lib/auth/getUser') return { getAuthenticatedUser: async () => user };
        throw new Error('Unexpected external dependency: ' + name);
      },
    });
    const response = await target.exports.unavailableAssinyOperation();
    assert.equal(response.status, user ? 503 : 401);
    const body = await response.json();
    assert.ok(body.error);
    assert.notEqual(body.success, true);
  }
});

test('legacy paid activation endpoints cannot manufacture entitlements or revenue',async()=>{
  for(const route of ['business/subscribe','connects/buy','priority-queue/activate','monetization/featured-projects/activate','monetization/portfolio-premium/subscribe','monetization/verified-badge/subscribe','monetization/priority-support/subscribe']){
    const target={exports:{}};
    const code=ts.transpileModule(fs.readFileSync(`src/app/api/${route}/route.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    let guarded=false;
    vm.runInNewContext(code,{module:target,exports:target.exports,require(name){
      if(name==='@/lib/payments/availability')return {unavailableAssinyOperation:async()=>{guarded=true;return NextResponse.json({error:'unavailable'},{status:503})}};
      throw new Error('Legacy activation attempted external access: '+name);
    }});
    assert.equal((await target.exports.POST()).status,503,route);
    assert.equal(guarded,true,route);
  }
});

test('retired checkout screens redirect to real plans instead of simulating payment',()=>{
 for(const path of ['src/app/checkout/page.tsx','src/app/checkout/addons/page.tsx']){
  const target={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:target,exports:target.exports,require(name){if(name==='next/navigation')return {redirect:destination=>{throw Error('redirect:'+destination)}};throw Error('Unexpected checkout dependency: '+name)}});
  assert.throws(()=>target.exports.default(),/redirect:\/plans/);
 }
});
test('accepted project shows direct payment instructions without invoking retired gateway queries',async()=>{
 const target={exports:{}},project={id:'project',title:'Projeto',description:'Descrição',skills:[],status:'in_progress',client_id:'owner',client:{full_name:'Cliente'}};
 const query={getProjectById:async()=>project,hasSubmittedProposal:async()=>false,getAcceptedProposal:async()=>({freelancer_id:'provider'}),getProjectSharedFolder:async()=>null};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/(public)/projects/[id]/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:target,exports:target.exports,process:{env:{}},require(name){
  if(name==='react')return {cache:fn=>fn};if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
  if(name==='next/navigation')return {notFound(){throw Error('notFound')}};if(name==='next/link')return {default:'Link'};
  if(name==='@/lib/supabase/queries')return new Proxy(query,{get:(object,key)=>{if(!(key in object))throw Error('Unexpected query: '+String(key));return object[key]}});
  if(name==='@/lib/auth/getUser')return {getAuthenticatedUser:async()=>({id:'owner'})};
  if(name==='@/lib/seo/metadata')return {};if(name==='lucide-react')return {HardDrive:'Icon'};
  if(name==='@/lib/seo/discovery')return {indexingRobots:index=>({index,follow:true,googleBot:{index,follow:true}})};
  if(['@/components/ui/badge','@/components/ui/card','@/components/link-button','@/components/proposal-form','@/components/projects/project-review-section'].includes(name))return {Badge:'Badge',Card:'Card',LinkButton:'LinkButton',ProposalForm:'ProposalForm',ProjectReviewSection:'ProjectReviewSection'};
  throw Error('Unexpected payment component: '+name);
 }});
 const rendered=JSON.stringify(await target.exports.default({params:Promise.resolve({id:'project'})}));
 assert.match(rendered,/Pagamento combinado entre vocês/);assert.match(rendered,/não recebe nem retém/);assert.doesNotMatch(rendered,/Mercado Pago|Conecte sua conta|retido até/);
});
