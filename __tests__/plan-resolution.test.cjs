const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function load(plan,options={}){const calls=[];const module={exports:{}};const db={rpc:async(name,args)=>{calls.push([name,args]);return {data:options.effectivePlan,error:options.error?{}:null}},from(table){calls.push(table);return {select(){return this},eq(){return this},maybeSingle:async()=>({data:{plan}})}}};const js=ts.transpileModule(fs.readFileSync('src/lib/plans/features.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(js,{exports:module.exports,module,process:{env:{ASSINY_ACCESS_LIFECYCLE_ENABLED:options.enabled?'true':'false'}},require(name){if(name==='@/lib/supabase/server')return {createClient:async()=>db};throw Error(name)}});return {...module.exports,calls};}
test('Business uses the profile updated by the payment webhook',async()=>{const api=load('business');assert.equal(await api.getUserPlan('user'),'business');assert.equal((await api.getUserFeatures('user')).priority,true);assert.equal(await api.canAccessFeature('user','projects'),true);assert.ok(api.calls.every(t=>t==='profiles'));});
test('Free and Pro are resolved without a second subscription database',async()=>{for(const p of ['free','pro'])assert.equal(await load(p).getUserPlan('user'),p)});
test('Unknown and legacy plan names never grant paid access',async()=>{for(const p of [null,undefined,'premium','admin','business_fake'])assert.equal(await load(p).getUserPlan('user'),'free')});

test('enabled expiry uses the effective tier instead of the cached profile plan',async()=>{
 const api=load('business',{enabled:true,effectivePlan:'free'});assert.equal(await api.getUserPlan('user'),'free');assert.equal(api.calls[0][0],'get_effective_plan');assert.equal(api.calls[0][1].p_user_id,'user');
 assert.equal(await load('free',{enabled:true,effectivePlan:'pro'}).getUserPlan('user'),'pro');
});
test('enabled expiry fails closed if its RPC fails or returns an invalid plan',async()=>{
 for(const options of [{error:true,effectivePlan:'business'},{effectivePlan:null},{effectivePlan:'premium'}])assert.equal(await load('business',{enabled:true,...options}).getUserPlan('user'),'free');
});
