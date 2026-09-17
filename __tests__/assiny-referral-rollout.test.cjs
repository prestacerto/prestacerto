const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function setup(options={}) {
 const writes=[],rpc=[];
 const db={rpc:async(name,args)=>{rpc.push({name,args});return {error:options.code?{code:options.code}:null}},from(table){const query={};for(const method of ['select','eq','or','gte'])query[method]=()=>query;query.update=data=>{writes.push({table,data});return query};query.maybeSingle=async()=>({data:{id:'referral-id',referrer_id:'referrer-id'}});query.single=async()=>({data:{plan:options.plan||'free'}});query.then=resolve=>resolve({count:options.business&&table==='referrals'?5:1});return query}};
 const module={exports:{}};const code=ts.transpileModule(fs.readFileSync('src/lib/supabase/referrals.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,Date,Error,process:{env:{ASSINY_ACCESS_LIFECYCLE_ENABLED:options.enabled?'true':'false'}},require(name){if(name==='@/lib/supabase/service')return {createServiceClient:()=>db};if(name==='@/lib/supabase/server')return {createClient:async()=>db};throw Error(name)}});
 return {run:()=>module.exports.completeReferralIfFirstPayment('payer-id'),writes,rpc};
}
test('independent referral grant is used immediately after SQL exists, even before the read rollout flag',async()=>{
 for(const enabled of [false,true]){const s=setup({enabled,business:true});await s.run();assert.equal(s.rpc[0].name,'grant_non_assiny_plan');assert.equal(s.rpc[0].args.p_user_id,'referrer-id');assert.equal(s.rpc[0].args.p_plan,'business');assert.ok(!s.writes.some(w=>w.table==='profiles'));}
});
test('only missing RPC with rollout disabled retains legacy referral behavior',async()=>{
 const s=setup({code:'PGRST202'});await s.run();assert.ok(s.writes.some(w=>w.table==='profiles'&&w.data.plan==='pro'));
});
test('enabled rollout and all non-missing-function errors never fall back to a cache-only paid grant',async()=>{
 for(const options of [{enabled:true,code:'PGRST202'},{code:'42501'},{code:'PGRST301'},{code:'08006'}]){const s=setup(options);await assert.rejects(s.run,/referral_plan_grant_failed/);assert.ok(!s.writes.some(w=>w.table==='profiles'));}
});
