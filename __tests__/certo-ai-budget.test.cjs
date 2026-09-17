const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function setup(options={}) {
 const state={calls:0,fetches:0,settled:0,recorded:0};const cache={};
 const db={rpc:async(name,args)=>{
  if(name==='finish_certo_ai'){state.settled++;state.settlement=args;return {error:options.settlementError?{message:'offline'}:null};}
  state.calls++;
  if(options.dbError)return {error:{message:'offline'}};
  if(state.calls>3||options.denied)return {data:{allowed:false,reason:options.denied||'quota',plan:'free'},error:null};
  return {data:{allowed:true,id:`reservation-${state.calls}`,plan:options.plan||'free',remainingFree:3-state.calls},error:null};
 }};
 const env={OPENAI_API_KEY:'test-only',...options.env};
 const mocks={
  'server-only':{},'@/lib/supabase/service':{hasServiceCredentials:()=>!options.noCredentials,createServiceClient:()=>db},
  '@/lib/ai/metering':{openAiUsage:x=>x.usage,recordAiUsage:async()=>{state.recorded++;}},
  '@/lib/auth/getUser':{getAuthenticatedUser:async()=>options.unauthenticated?null:{id:'user'}},
  '@/lib/supabase/server':{createClient:async()=>({from:()=>({select(){return this},eq(){return this},maybeSingle:async()=>({data:{role:'freelancer'}})})})},
  '@/lib/rate-limit':{rateLimiters:{ai:{}},checkRateLimit:async()=>({success:true})},
  'next/server':{NextResponse:{json:(body,{status=200}={})=>({body,status})}}
 };
 function load(name){if(mocks[name])return mocks[name];if(cache[name])return cache[name];if(!name.startsWith('@/'))return require(name);
  const path='src/'+name.slice(2)+'.ts';const module={exports:{}};cache[name]=module.exports;
  const js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(js,{module,exports:module.exports,require:load,process:{env},Buffer,crypto:require('node:crypto').webcrypto,AbortSignal,console:{error(){}},fetch:async(url,init)=>{
   state.fetches++;state.lastFetch={url,init};if(options.timeout)throw Error('timeout');
   return {ok:!options.providerError,status:options.providerError||200,json:async()=>({id:`completion-${state.fetches}`,model:'gpt-4o-mini',usage:options.missingUsage?undefined:{prompt_tokens:1000,completion_tokens:400},choices:[{finish_reason:options.finishReason||'stop',message:{content:options.empty?'':options.content??'Texto aprimorado preservando os fatos.'}}]})};
  }});cache[name]=module.exports;return module.exports;
 }
 return {state,load};
}
const context={userId:'user',accountId:'user'};
test('all three rewrite routes share one allowance; fourth request never reaches provider',async()=>{
 const {load,state}=setup();
 for(const [route,body] of [
 ['@/app/api/ai/improve-proposal/route',{draft:'Proposta detalhada de teste.',projectTitle:'Projeto'}],
 ['@/app/api/certo-ai/rewrite-proposal/route',{proposalText:'Proposta detalhada de teste.'}],
 ['@/app/api/ai/optimize-proposal/route',{action:'optimize',proposal:'Proposta detalhada de teste.'}],
 ]){assert.equal((await load(route).POST({json:async()=>body})).status,200);}
 const result=await load('@/app/api/ai/improve-proposal/route').POST({json:async()=>({draft:'Quarta proposta de teste.',projectTitle:'Projeto'})});
 assert.equal(result.status,429);assert.equal(result.body.upgrade,true);assert.equal(state.fetches,3);assert.equal(state.settled,3);
});
test('missing credentials and database errors fail closed before paid calls',async()=>{
 for(const options of [{noCredentials:true},{env:{OPENAI_API_KEY:''}},{dbError:true}]){
  const {load,state}=setup(options);await assert.rejects(load('@/lib/ai/certo-ai').improveProposalDraft('Proposta detalhada','Projeto',context),e=>e.status===503);assert.equal(state.fetches,0);
 }
});
test('alternate provider or model cannot silently bypass reserved cost calculation',async()=>{
 for(const env of [{OPENAI_MODEL:'expensive-model'},{OPENAI_API_URL:'https://example.invalid'}]){const {load,state}=setup({env});await assert.rejects(load('@/lib/ai/certo-ai').improveProposalDraft('Proposta de teste','Projeto',context),e=>e.status===503);assert.equal(state.calls,0);assert.equal(state.fetches,0);}
});
test('oversized inputs consume neither quota nor provider calls',async()=>{
 const {load,state}=setup();await assert.rejects(load('@/lib/ai/certo-ai').improveProposalDraft('á'.repeat(24000),'Projeto',context),e=>e.status===400);assert.equal(state.calls,0);assert.equal(state.fetches,0);
});
test('unknown network outcome retains reservation, no retry or false success',async()=>{
 const {load,state}=setup({timeout:true});await assert.rejects(load('@/lib/ai/certo-ai').improveProposalDraft('Proposta detalhada','Projeto',context));assert.equal(state.calls,1);assert.equal(state.fetches,1);assert.equal(state.settled,0);assert.ok(state.lastFetch.init.signal instanceof AbortSignal);
});
test('empty output is an error even though provider tokens are accounted',async()=>{
 const {load,state}=setup({empty:true});await assert.rejects(load('@/lib/ai/certo-ai').improveProposalDraft('Proposta detalhada','Projeto',context));assert.equal(state.settled,1);
});
test('failed settlement preserves generated output and conservative reservation',async()=>{
 const {load,state}=setup({settlementError:true});assert.match(await load('@/lib/ai/certo-ai').improveProposalDraft('Proposta detalhada','Projeto',context),/aprimorado/);assert.equal(state.settled,1);
});
test('cost limits do not misleadingly ask a paid customer to upgrade',async()=>{
 for(const [reason,status] of [['budget',429],['global_budget',503]]){
 const {load}=setup({denied:reason});const r=await load('@/app/api/ai/improve-proposal/route').POST({json:async()=>({draft:'Proposta detalhada','projectTitle':'Projeto'})});assert.equal(r.status,status);assert.equal(r.body.upgrade,false);}
});
test('legacy compare/tips and demonstration cannot fabricate results or bill a provider',async()=>{
 const {load,state}=setup();for(const action of ['compare','tips']){assert.equal((await load('@/app/api/ai/optimize-proposal/route').POST({json:async()=>({action,proposal:'Proposta detalhada'})})).status,503);}
 assert.equal((await load('@/app/api/ai/optimize-proposal-demo/route').POST()).status,410);assert.equal(state.fetches,0);
});
test('brief route uses the same budget guard and validates size',async()=>{
 const {load,state}=setup({dbError:true});const route=load('@/app/api/ai/scope-project/route');assert.equal((await route.POST({json:async()=>({idea:'Um briefing detalhado'})})).status,503);assert.equal((await route.POST({json:async()=>({idea:'a'.repeat(5001)})})).status,400);assert.equal(state.fetches,0);
});

const validBrief={
 title:'Site para clínica',
 description:'Criar um site para a clínica com agendamento e contato por WhatsApp.',
 skills:['Desenvolvimento web'],
 budget_min:null,
 budget_max:null,
 deadline_days:null,
};
async function generateBrief(load,idea='Preciso de um site para minha clínica com agendamento e contato por WhatsApp.') {
 return load('@/app/api/ai/scope-project/route').POST({json:async()=>({idea})});
}
test('briefing returns actual provider fields and preserves unspecified budget and deadline',async()=>{
 const {load,state}=setup({content:JSON.stringify(validBrief)});
 const result=await generateBrief(load);
 assert.equal(result.status,200);
 assert.deepEqual(JSON.parse(JSON.stringify(result.body)),validBrief);
 assert.equal(state.fetches,1);assert.equal(state.settled,1);assert.equal(state.recorded,1);
 assert.equal(state.settlement.p_input,1000);assert.equal(state.settlement.p_output,400);
});
test('briefing preserves valid amounts and deadline supplied by the customer',async()=>{
 const expected={...validBrief,budget_min:1000,budget_max:2500.50,deadline_days:14};
 const {load}=setup({content:JSON.stringify(expected)});
 const result=await generateBrief(load,'Preciso de um site para a clínica, entre R$ 1.000 e R$ 2.500,50 em 14 dias.');
 assert.equal(result.status,200);
 assert.deepEqual(JSON.parse(JSON.stringify(result.body)),expected);
});
test('invalid provider briefings fail without disguising the original idea as AI output',async()=>{
 const invalidContent=[
  '', 'Não consegui gerar JSON.', 'null', '{}', '[]',
  JSON.stringify({...validBrief,title:'  '}),
  JSON.stringify({...validBrief,description:'  '}),
  JSON.stringify({...validBrief,skills:['Design',42]}),
  JSON.stringify({...validBrief,budget_min:-100}),
  JSON.stringify({...validBrief,budget_max:'2500'}),
  JSON.stringify({...validBrief,budget_min:2500,budget_max:1000}),
  JSON.stringify({...validBrief,deadline_days:0}),
  JSON.stringify({...validBrief,deadline_days:1.5}),
  JSON.stringify({...validBrief,deadline_days:731}),
  JSON.stringify({...validBrief,budget_max:999999999999}),
  JSON.stringify(validBrief).replace('"budget_min":null','"budget_min":1e400'),
 ];
 for(const content of invalidContent){
  const {load,state}=setup({content});
  const result=await generateBrief(load);
  assert.equal(result.status,502,content);
  assert.ok(result.body.error);assert.equal(result.body.description,undefined);
  assert.equal(state.fetches,1);assert.equal(state.settled,1);assert.equal(state.recorded,1);
 }
});
test('truncated and filtered provider answers are never reported as successful proposals or briefings',async()=>{
 for(const finishReason of ['length','content_filter']){
  const {load,state}=setup({finishReason,content:JSON.stringify(validBrief)});
  const brief=await generateBrief(load);
  const proposal=await load('@/app/api/ai/improve-proposal/route').POST({json:async()=>({draft:'Proposta detalhada para um site da clínica.',projectTitle:'Site para clínica'})});
  assert.equal(brief.status,502);assert.equal(proposal.status,502);
  assert.equal(state.fetches,2);assert.equal(state.settled,2);assert.equal(state.recorded,2);
 }
});
test('provider rejection retains reservation and is reported as an error without automatic retry',async()=>{
 const {load,state}=setup({providerError:429});
 const result=await generateBrief(load);
 assert.equal(result.status,502);assert.equal(state.calls,1);assert.equal(state.fetches,1);assert.equal(state.settled,0);
});
test('missing usage never settles a paid response at zero cost',async()=>{
 const {load,state}=setup({missingUsage:true});
 assert.match(await load('@/lib/ai/certo-ai').improveProposalDraft('Proposta detalhada','Projeto',context),/aprimorado/);
 assert.equal(state.calls,1);assert.equal(state.fetches,1);assert.equal(state.settled,0);
});
