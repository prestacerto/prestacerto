const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
const payload={event_id:'event-test',occurred_at:'2026-09-01T12:00:00Z',event:'subscription.paid',customer:{email:'USER@example.invalid'},plan:{name:'PrestaCerto Pro'},subscription:{id:'sub-test'}};
function setup(options={}){
 const calls=[];const cache={};const env={ASSINY_WEBHOOK_SECRET:'test-secret',...options.env};
 const service={rpc:async(name,args)=>{calls.push({name,args});return options.dbError||(name==='bind_verified_assiny_subscription'&&options.bindError)?{error:{code:'offline'}}:{data:{outcome:options.outcome||'pending_binding',originalOutcome:options.originalOutcome}};},from(table){assert.equal(table,'assiny_events');return {select(){return this;},eq(){return this;},async maybeSingle(){return {data:options.purchase||null,error:options.lookupError?{code:'offline'}:null};}};}};
 const mocks={'server-only':{},'@/lib/supabase/service':{hasServiceCredentials:()=>!options.noCredentials,createServiceClient:()=>service},'next/server':{NextResponse:{json:(body,{status=200}={})=>({body,status})}}};
 function load(name){if(mocks[name])return mocks[name];if(cache[name])return cache[name];if(!name.startsWith('@/'))return require(name);const mod={exports:{}};const src=fs.readFileSync('src/'+name.slice(2)+'.ts','utf8');const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(js,{exports:mod.exports,module:mod,require:load,process:{env},Buffer,Date,Response,console:{error(){}}});cache[name]=mod.exports;return mod.exports;}
 const request=(body=payload,token=options.env?.ASSINY_WEBHOOK_SECRET||'test-secret')=>new Request('https://example.invalid/api/webhooks/assiny?secret=test-secret',{method:'POST',headers:{'content-type':'application/json',...(token?{'x-assiny-token':token}:{})},body:typeof body==='string'?body:JSON.stringify(body)});
 return {load,request,calls};
}
test('parser requires event identity, timezone timestamp, supported product and subscription',()=>{
 const {load}=setup();const {parseAssinyEvent}=load('@/lib/payments/assiny');const valid=parseAssinyEvent(payload);assert.equal(valid.kind,'subscription');assert.equal(valid.email,'user@example.invalid');assert.equal(valid.occurredAt,'2026-09-01T12:00:00.000Z');
 for(const p of [{...payload,event_id:undefined},{...payload,occurred_at:undefined},{...payload,occurred_at:'2026-09-01'},{...payload,occurred_at:'2026-02-30T12:00:00Z'},{...payload,occurred_at:'2099-01-01T00:00:00Z'},{...payload,plan:'premium'},{...payload,subscription:{id:'x'.repeat(201)}}])assert.equal(parseAssinyEvent(p).kind,'invalid');
});
test('semantic event hash ignores key order, email case and unrelated delivery fields',()=>{
 const {load}=setup();const {parseAssinyEvent,assinyEventHash}=load('@/lib/payments/assiny');const a=parseAssinyEvent(payload);const b=parseAssinyEvent({subscription:payload.subscription,plan:'pro',customer:{email:'user@example.invalid'},event:payload.event,occurred_at:payload.occurred_at,event_id:payload.event_id,delivery_attempt:2});assert.equal(assinyEventHash(a),assinyEventHash(b));const c=parseAssinyEvent({...payload,plan:'business'});assert.notEqual(assinyEventHash(a),assinyEventHash(c));
});
test('missing configuration, wrong tokens and URL-only secrets never touch database',async()=>{
 for(const options of [{noCredentials:true},{env:{ASSINY_WEBHOOK_SECRET:''}}]){const {load,request,calls}=setup(options);assert.equal((await load('@/app/api/webhooks/assinify/route').POST(request())).status,503);assert.equal(calls.length,0);}
 const {load,request,calls}=setup();const api=load('@/app/api/webhooks/assinify/route');for(const token of ['wrong',null])assert.equal((await api.POST(request(payload,token))).status,401);assert.equal(calls.length,0);
});
test('malformed, unsupported and oversized deliveries cannot mutate subscriptions',async()=>{
 const {load,request,calls}=setup();const api=load('@/app/api/webhooks/assinify/route');for(const [body,status] of [['{',400],['x'.repeat(256001),413],[{...payload,event_id:undefined},422],[{...payload,event:'page.view'},200]])assert.equal((await api.POST(request(body))).status,status);assert.equal(calls.length,0);
});
test('default test mode is server controlled and persists atomically, never updates profiles directly',async()=>{
 const {load,request,calls}=setup({outcome:'test'});const res=await load('@/app/api/webhooks/assinify/route').POST(request({...payload,mode:'live',user_id:'attacker'}));assert.equal(res.status,200);assert.equal(res.body.mode,'test');assert.equal(calls.length,1);assert.equal(calls[0].name,'ingest_assiny_event');assert.equal(calls[0].args.p_mode,'test');assert.ok(!Object.hasOwn(calls[0].args,'p_user_id'));
});
test('live processing is explicit and does not infer ownership from customer email',async()=>{
 const native=JSON.parse(fs.readFileSync('__tests__/fixtures/assiny-approved.json','utf8'));
 const {load,request,calls}=setup({env:{ASSINY_INTEGRATION_VERIFIED:'true'}});const api=load('@/app/api/webhooks/assinify/route');
 assert.equal((await api.POST(request())).status,422);
 const res=await api.POST(request(native));assert.equal(res.status,200);assert.equal(res.body.outcome,'pending_binding');assert.equal(calls[0].args.p_mode,'live');
});
test('native refunds reconcile only an approved purchase in the same ledger',async()=>{
 const native=JSON.parse(fs.readFileSync('__tests__/fixtures/assiny-approved.json','utf8'));
 native.event='refunded_purchase';native.data.transaction.status='refunded';delete native.data.offer.subscription;
 for(const [options,status] of [[{},422],[{lookupError:true},500],[{purchase:{subscription_id:'verified-sub',plan:'business',customer_email:'test@example.invalid',outcome:'test'}},422],[{purchase:{subscription_id:'verified-sub',plan:'pro',customer_email:'test@example.invalid',outcome:'conflict'}},422],[{purchase:{subscription_id:'verified-sub',plan:'pro',customer_email:'test@example.invalid',outcome:'test'}},200]]){
  const {load,request,calls}=setup(options);const res=await load('@/app/api/webhooks/assinify/route').POST(request(native));assert.equal(res.status,status);
  if(status===200){assert.equal(calls[0].args.p_subscription_id,'verified-sub');assert.equal(calls[0].args.p_active,false);}else assert.equal(calls.length,0);
 }
});
test('database failures are retriable errors and conflicts are not acknowledged as successful activation',async()=>{
 for(const [options,status] of [[{dbError:true},500],[{outcome:'conflict'},409],[{outcome:'duplicate'},200],[{outcome:'stale'},200]]){const {load,request}=setup(options);assert.equal((await load('@/app/api/webhooks/assinify/route').POST(request())).status,status);}
});
test('checkout requires confirmed integration as well as credentials and checkout flag',()=>{
 for(const options of [{env:{ASSINY_CHECKOUT_ENABLED:'true'}},{env:{ASSINY_INTEGRATION_VERIFIED:'true'}},{noCredentials:true,env:{ASSINY_CHECKOUT_ENABLED:'true',ASSINY_INTEGRATION_VERIFIED:'true'}}]){assert.equal(setup(options).load('@/lib/payments/assiny-readiness').isAssinyCheckoutReady(),false);}
 assert.equal(setup({env:{ASSINY_CHECKOUT_ENABLED:'true',ASSINY_INTEGRATION_VERIFIED:'true'}}).load('@/lib/payments/assiny-readiness').isAssinyCheckoutReady(),true);
});
test('signed checkout binds the authenticated account, including safe retry after a failed binding',async()=>{
 const secret='test-only-signing-key-not-for-production';
 const userId='a3b6c537-bbe3-4d7f-91bc-6b2979174914';
 for(const options of [{},{outcome:'duplicate'},{bindError:true}]) {
  const {load,request,calls}=setup({...options,env:{ASSINY_WEBHOOK_SECRET:secret,ASSINY_INTEGRATION_VERIFIED:'true'}});
  const native=JSON.parse(fs.readFileSync('__tests__/fixtures/assiny-approved.json','utf8'));
  native.user_id='attacker-controlled';
  native.data.metadata={utm_content:load('@/lib/payments/checkout-reference').createCheckoutReference(userId,'pro',secret,Date.parse('2026-09-01T11:59:00Z'))};
  const response=await load('@/app/api/webhooks/assinify/route').POST(request(native));
  assert.equal(response.status,options.bindError?500:200);
  assert.equal(calls[1].name,'bind_verified_assiny_subscription');
  assert.equal(calls[1].args.p_user_id,userId);
 }
});
test('test deliveries and tampered references never bind a customer account',async()=>{
 const secret='test-only-signing-key-not-for-production';
 for(const live of [false,true]){
  const {load,request,calls}=setup({env:{ASSINY_WEBHOOK_SECRET:secret,ASSINY_INTEGRATION_VERIFIED:String(live)}});
  const native=JSON.parse(fs.readFileSync('__tests__/fixtures/assiny-approved.json','utf8'));
  native.data.metadata={utm_content:'pc1.invalid.invalid.invalid'};
  const response=await load('@/app/api/webhooks/assinify/route').POST(request(native));
  assert.equal(response.status,live?422:200);
  assert.equal(calls.length,1);
 }
});
test('already-bound renewal retries do not need a new checkout reference',async()=>{
 const {load,request,calls}=setup({outcome:'duplicate',originalOutcome:'applied',env:{ASSINY_INTEGRATION_VERIFIED:'true'}});
 const native=JSON.parse(fs.readFileSync('__tests__/fixtures/assiny-approved.json','utf8'));
 native.data.metadata={utm_content:'pc1.expired.reference.value'};
 assert.equal((await load('@/app/api/webhooks/assinify/route').POST(request(native))).status,200);
 assert.equal(calls.length,1);
});
