const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm'), ts=require('typescript');
function browser(options={}) {
 let consent=options.consent||'granted';const storage=options.storage||new Map(),session=new Map(),calls=[],listeners={},effects=[],timers=[],cache={};
 const window={location:{origin:'https://prestacerto.com.br',pathname:'/plans',search:'?utm_campaign=someone@example.com'},localStorage:{getItem:k=>k==='prestacerto_tracking_consent'?consent:(storage.get(k)||null),setItem:(k,v)=>{if(options.blockStorage)throw Error('blocked');storage.set(k,v)}},sessionStorage:{getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v)},addEventListener:(k,fn)=>(listeners[k]??=[]).push(fn),removeEventListener:(k,fn)=>listeners[k]=(listeners[k]||[]).filter(f=>f!==fn)};
 const document={cookie:'',referrer:'https://example.com/path?email=private@example.com'};
 function load(name){if(cache[name])return cache[name].exports;
  if(name==='react')return {useEffect:fn=>effects.push(fn),useState(){},useSyncExternalStore(){}};
  if(name==='react/jsx-runtime')return {jsx(){},jsxs(){}};
  if(name==='next/dynamic')return {default:()=>function Deferred(){}};
  if(!name.startsWith('@/'))return require(name);
  const path='src/'+name.slice(2),file=fs.existsSync(path+'.tsx')?path+'.tsx':path+'.ts',m={exports:{}};cache[name]=m;
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:m,exports:m.exports,require:load,window,document,URL,URLSearchParams,Set,Date,Number,process:{env:options.env||{}},console,fetch:options.fetch||(()=>{throw Error('Unexpected fetch')}),setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){}});return m.exports;
 }
 const ready=provider=>window[provider]=(...args)=>calls.push([provider,...args]);
 return {api:load('@/components/analytics'),load,window,storage,session,calls,effects,timers,ready,consent:value=>consent=value,emit:name=>(listeners[name]||[]).forEach(fn=>fn())};
}
test('confirmed purchase waits independently for GA and Meta and is deduplicated across revisits',()=>{
 const s=browser();s.api.trackConfirmedPurchase('assiny:approved_purchase:receipt',59.9);s.api.trackConfirmedPurchase('assiny:approved_purchase:receipt',59.9);assert.equal(s.calls.length,0);assert.equal(s.storage.size,0);
 s.ready('gtag');s.emit('prestacerto:analytics-ready');assert.equal(s.calls.length,1);
 s.ready('fbq');s.emit('prestacerto:analytics-ready');s.emit('prestacerto:analytics-ready');s.api.trackConfirmedPurchase('assiny:approved_purchase:receipt',59.9);assert.equal(s.calls.length,2);
 const meta=s.calls.find(c=>c[0]==='fbq');assert.equal(meta[2],'Purchase');assert.equal(meta[4].eventID,'assiny:approved_purchase:receipt');assert.doesNotMatch(JSON.stringify(s.calls),/@|utm_campaign|email=/);
 const revisit=browser({storage:s.storage});revisit.ready('gtag');revisit.ready('fbq');revisit.api.trackConfirmedPurchase('assiny:approved_purchase:receipt',59.9);assert.equal(revisit.calls.length,0);
});
test('confirmed tracker retries after consent, rather than marking an unsent purchase complete',()=>{
 const s=browser({consent:'denied'});s.ready('gtag');s.ready('fbq');s.load('@/components/confirmed-purchase-tracker').ConfirmedPurchaseTracker({transactionId:'receipt',value:59.9});const cleanup=s.effects[0]();assert.equal(s.calls.length,0);assert.equal(s.storage.size,0);
 s.consent('granted');s.emit('prestacerto:tracking-consent');s.emit('prestacerto:tracking-consent');assert.equal(s.calls.length,2);cleanup();
});
test('revoking consent drops a pending Meta purchase without dropping the already sent GA dedupe',()=>{
 const s=browser();s.ready('gtag');s.api.trackConfirmedPurchase('receipt',59.9);assert.equal(s.calls.length,1);s.consent('denied');s.emit('prestacerto:tracking-consent');s.ready('fbq');s.emit('prestacerto:analytics-ready');assert.equal(s.calls.length,1);
 s.consent('granted');s.api.trackConfirmedPurchase('receipt',59.9);assert.equal(s.calls.length,2);
});
test('blocked storage does not break purchase tracking or repeat in the same page',()=>{
 const s=browser({blockStorage:true});s.ready('gtag');s.ready('fbq');s.api.trackConfirmedPurchase('receipt',59.9);s.api.trackConfirmedPurchase('receipt',59.9);assert.equal(s.calls.length,2);
});
test('checkout start maps to the standard Meta InitiateCheckout event',()=>{
 const s=browser();s.ready('gtag');s.ready('fbq');s.api.trackAnalyticsEvent('begin_checkout',{plan:'pro',value:59.9,currency:'BRL'});assert.equal(s.calls[0][2],'begin_checkout');assert.equal(s.calls[1][1],'track');assert.equal(s.calls[1][2],'InitiateCheckout');
});
function statusApi(options={}) {
 const calls=[];let serviceCalls=0;const chain={};for(const method of ['select','eq','not','gte','gt','is','order','limit'])chain[method]=(...args)=>{calls.push([method,...args]);return chain};chain.maybeSingle=async()=>({data:options.row||null,error:options.error?{}:null});
 const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/api/payments/assiny-status/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,Response,URL,Date,Number,process:{env:{ASSINY_ACCESS_LIFECYCLE_ENABLED:options.lifecycle?'true':'false'}},require(name){
  if(name==='@/lib/supabase/server')return {createClient:async()=>({auth:{getUser:async()=>({data:{user:options.anonymous?null:{id:'authenticated-owner'}}})}})};
  if(name==='@/lib/supabase/service')return {hasServiceCredentials:()=>!options.disabled,createServiceClient:()=>{serviceCalls++;return {from:table=>{assert.equal(table,'assiny_subscriptions');return chain}}}};
  if(name==='@/lib/plans-data')return {PLANS:[{id:'free',priceMonthly:0},{id:'pro',priceMonthly:59.9},{id:'business',priceMonthly:139.9}]};throw Error(name);
 }});return {api:m.exports,calls,serviceCalls:()=>serviceCalls};
}
const statusRequest=(extra={})=>new Request('https://prestacerto.com.br/api/payments/assiny-status?'+new URLSearchParams({plan:'pro',startedAt:new Date(Date.now()-60000).toISOString(),...extra}));
test('Assiny confirmation requires auth and a recent valid checkout before any ledger access',async()=>{
 for(const [options,query,status] of [[{anonymous:true},{},401],[{}, {plan:'free'},400],[{}, {startedAt:'garbage'},400],[{}, {startedAt:new Date(Date.now()-86400001).toISOString()},400],[{}, {startedAt:new Date(Date.now()+60000).toISOString()},400],[{disabled:true},{},503]]){const s=statusApi(options);assert.equal((await s.api.GET(statusRequest(query))).status,status);assert.equal(s.serviceCalls(),0)}
});
test('Assiny status is bounded to verified live approvals belonging to the authenticated account',async()=>{
 const id='assiny:approved_purchase:a3b6c537-bbe3-4d7f-91bc-6b2979174914',s=statusApi({row:{last_event_id:id}}),response=await s.api.GET(statusRequest({user_id:'attacker',value:'0.01'}));assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'private, no-store');const data=await response.json();assert.deepEqual(data,{status:'confirmed',transactionId:id,value:59.9,plan:'pro'});
 for(const call of [['eq','mode','live'],['eq','user_id','authenticated-owner'],['eq','active',true],['eq','plan','pro'],['not','verified_at','is',null],['limit',1]])assert.ok(s.calls.some(c=>JSON.stringify(c)===JSON.stringify(call)),JSON.stringify(call));assert.ok(s.calls.some(c=>c[0]==='gte'&&c[1]==='last_occurred_at'));
});
test('absent, refunded, legacy and failed ledger results never produce a confirmed purchase',async()=>{
 for(const row of [null,{last_event_id:'assiny:refunded_purchase:a3b6c537-bbe3-4d7f-91bc-6b2979174914'},{last_event_id:'subscription.paid'}]){const response=await statusApi({row}).api.GET(statusRequest());assert.equal((await response.json()).status,'pending')}
 const response=await statusApi({error:true}).api.GET(statusRequest());assert.equal(response.status,503);assert.equal((await response.json()).status,undefined);
});
test('checkout continuation contains only plan and timestamp and expires after one day',()=>{
 const s=browser(),api=s.load('@/lib/payments/assiny-checkout-state');api.rememberAssinyCheckout('business');assert.equal(api.readAssinyCheckout().plan,'business');const saved=JSON.parse(s.session.values().next().value);assert.deepEqual(Object.keys(saved).sort(),['plan','startedAt']);s.session.set('prestacerto:assiny-checkout:v1',JSON.stringify({plan:'business',startedAt:new Date(Date.now()-86400001).toISOString()}));assert.equal(api.readAssinyCheckout(),null);
});

const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('Assiny browser return never looks up historical purchases without a current checkout',async()=>{
 let requests=0;const s=browser({fetch:async()=>{requests++;return Response.json({status:'confirmed',transactionId:'historical',value:59.9})}});
 s.ready('gtag');s.ready('fbq');s.load('@/components/assiny-purchase-tracker').AssinyPurchaseTracker();s.effects[0]();await tick();assert.equal(requests,0);assert.equal(s.calls.length,0);
 s.session.set('prestacerto:assiny-checkout:v1',JSON.stringify({plan:'pro',startedAt:new Date(Date.now()-86400001).toISOString()}));s.emit('focus');await tick();assert.equal(requests,0);assert.equal(s.calls.length,0);
});
test('Assiny browser return sends no Purchase while pending, then only one per provider after confirmation',async()=>{
 const requests=[];let confirmed=false;const id='assiny:approved_purchase:a3b6c537-bbe3-4d7f-91bc-6b2979174914';
 const s=browser({fetch:async url=>{requests.push(url);return Response.json(confirmed?{status:'confirmed',transactionId:id,value:59.9}:{status:'pending'})}});
 s.ready('gtag');s.ready('fbq');s.load('@/lib/payments/assiny-checkout-state').rememberAssinyCheckout('pro');s.load('@/components/assiny-purchase-tracker').AssinyPurchaseTracker();const cleanup=s.effects[0]();await tick();
 assert.equal(s.calls.length,0);assert.equal(s.storage.size,0);assert.equal(s.timers.length,1);assert.match(requests[0],/plan=pro&startedAt=/);
 confirmed=true;s.timers[0]();await tick();assert.equal(s.calls.length,2);s.emit('focus');await tick();assert.equal(s.calls.length,2);cleanup();
});
test('Assiny browser return with failed confirmation or denied consent cannot manufacture Purchase',async()=>{
 for(const [consent,status] of [['granted',503],['denied',200]]){
  const s=browser({consent,fetch:async()=>Response.json({status:'confirmed',transactionId:'receipt',value:59.9},{status})});s.ready('gtag');s.ready('fbq');s.load('@/lib/payments/assiny-checkout-state').rememberAssinyCheckout('pro');s.load('@/components/assiny-purchase-tracker').AssinyPurchaseTracker();const cleanup=s.effects[0]();await tick();assert.equal(s.calls.length,0);assert.equal(s.storage.size,0);cleanup();
 }
});

test('configured Ads purchase fires once only after the Assiny return is confirmed',async()=>{
 const env={NEXT_PUBLIC_GA_ID:'G-TEST',NEXT_PUBLIC_GOOGLE_TAG_ID:'AW-123456789',NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL:'unit_lead',NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:'unit_purchase'};
 let confirmed=false;const id='assiny:approved_purchase:a3b6c537-bbe3-4d7f-91bc-6b2979174914';
 const s=browser({env,fetch:async()=>Response.json(confirmed?{status:'confirmed',transactionId:id,value:139.9}:{status:'pending'})});s.ready('gtag');s.ready('fbq');s.load('@/lib/payments/assiny-checkout-state').rememberAssinyCheckout('business');s.load('@/components/assiny-purchase-tracker').AssinyPurchaseTracker();const cleanup=s.effects[0]();await tick();assert.equal(s.calls.filter(c=>c[2]==='conversion').length,0);
 confirmed=true;s.timers[0]();await tick();s.emit('focus');await tick();const events=s.calls.filter(c=>c[2]==='conversion');assert.equal(events.length,1);assert.deepEqual(JSON.parse(JSON.stringify(events[0][3])),{send_to:'AW-123456789/unit_purchase',transaction_id:id,value:139.9,currency:'BRL'});cleanup();
});

test('expiry rollout confirms only unrevoked purchases whose paid window is still valid',async()=>{
 const s=statusApi({lifecycle:true});await s.api.GET(statusRequest());
 assert.ok(s.calls.some(c=>c[0]==='gt'&&c[1]==='paid_through'&&Number.isFinite(Date.parse(c[2]))));
 assert.ok(s.calls.some(c=>c[0]==='is'&&c[1]==='revoked_at'&&c[2]===null));
 const legacy=statusApi();await legacy.api.GET(statusRequest());assert.ok(!legacy.calls.some(c=>c[1]==='paid_through'));
});
