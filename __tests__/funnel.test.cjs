const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
function setup(options={}) {
 const records=new Map(), calls=[],listeners={};let consent=options.consent||'granted';const cache={};
 const window={location:{origin:'https://prestacerto.com.br',hostname:'prestacerto.com.br',pathname:'/para-clientes',search:'?utm_medium=cpc&campaign_id=12345&ad_id=99&adgroup_id=email@example.com'},localStorage:{getItem:()=>consent},sessionStorage:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v)},matchMedia:()=>({matches:true}),addEventListener:(k,f)=>(listeners[k]??=[]).push(f)};
 if(!options.defer)window.gtag=(...x)=>calls.push(x);
 function load(name){if(cache[name])return cache[name].exports;const m={exports:{}};cache[name]=m;const code=ts.transpileModule(fs.readFileSync('src/'+name.slice(2)+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{module:m,exports:m.exports,require:load,window,document:{referrer:'https://google.com/?email=x@example.com'},URL,URLSearchParams,Date,process:{env:{}},console});return m.exports;}
 return {api:load('@/lib/funnel'),window,calls,records,changeConsent:v=>consent=v,emit:k=>(listeners[k]||[]).forEach(f=>f())};
}
test('funnel preserves numeric campaign attribution across registration and publication without PII',()=>{
 const s=setup();s.api.trackFunnelEvent('presta_certo_lead_success','client');s.window.location.pathname='/register';s.window.location.search='?role=client';s.api.trackFunnelEvent('presta_certo_registration_success','client');s.window.location.pathname='/publicar-projeto';s.api.trackFunnelEvent('presta_certo_project_published','client');
 for(const [,name,data] of s.calls){assert.ok(name.startsWith('presta_certo_'));assert.equal(data.campaign_id,'12345');assert.equal(data.ad_id,'99');assert.equal(data.source,'paid_search');assert.equal(data.adgroup_id,undefined);assert.doesNotMatch(JSON.stringify(data),/@|utm_|email/);}
 assert.equal(s.calls.length,3);
});
test('funnel queues consented events until provider is ready and flushes once',()=>{
 const s=setup({defer:true});assert.equal(s.api.trackFunnelEvent('presta_certo_landing_view','provider'),true);assert.equal(s.calls.length,0);s.window.gtag=(...x)=>s.calls.push(x);s.emit('prestacerto:analytics-ready');s.emit('prestacerto:analytics-ready');assert.equal(s.calls.length,1);
});
test('revoking consent discards pending events and does not persist new attribution',()=>{
 const s=setup({defer:true});s.api.trackFunnelEvent('presta_certo_landing_view','client');s.changeConsent('denied');s.emit('prestacerto:tracking-consent');s.window.gtag=(...x)=>s.calls.push(x);s.emit('prestacerto:analytics-ready');assert.equal(s.calls.length,0);
 const denied=setup({consent:'denied'});assert.equal(denied.api.trackFunnelEvent('presta_certo_lead_success','client'),false);assert.equal(denied.records.size,0);
});
test('profile completion requires saved presentation and location, without mandatory photo or paid plan',()=>{
 const {api}=setup();for(const profile of [null,{}, {full_name:'Ana',headline:'Designer',bio:'Trabalho com marcas'}, {full_name:'Ana',headline:' ',bio:'Designer',city:'São Paulo'}])assert.equal(api.isProfileComplete(profile),false);
 assert.equal(api.isProfileComplete({full_name:'Ana',headline:'Designer',bio:'Trabalho com marcas',city:'Remoto'}),true);
});

function profileApi(options={}) {
 const updates=[];
 const query={update(data){updates.push(data);return this},eq(){return this},select(){return this},async maybeSingle(){return {data:options.noRow?null:{full_name:'Ana',headline:'Designer',bio:'Experiência em marcas',city:'Remoto'},error:options.dbError?{message:'private'}:null}}};
 const module={exports:{}};
 const code=ts.transpileModule(fs.readFileSync('src/app/api/profile/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,console:{error(){}},require(name){if(name==='next/server')return {NextResponse:{json:(body,init)=>Response.json(body,init)}};if(name==='@/lib/auth/getUser')return {getAuthenticatedUser:async()=>options.anonymous?null:{id:'owner'}};if(name==='@/lib/supabase/server')return {createClient:async()=>({from:()=>query})};if(name==='@/lib/funnel')return setup().api;return require(name)}});
 return {api:module.exports,updates};
}
test('profile API refuses nonexistent rows instead of claiming a profile was saved',async()=>{
 const s=profileApi({noRow:true});const response=await s.api.PATCH(new Request('https://example.test/api/profile',{method:'PATCH',body:JSON.stringify({headline:'Designer'})}));assert.equal(response.status,500);assert.equal((await response.json()).success,undefined);
});
test('profile API returns completion only for a persisted row and accepts explicit resume removal',async()=>{
 const s=profileApi();const response=await s.api.PATCH(new Request('https://example.test/api/profile',{method:'PATCH',body:JSON.stringify({resume_url:null})}));assert.equal(response.status,200);assert.equal((await response.json()).profileCompleted,true);assert.equal(s.updates[0].resume_url,null);
 const anon=profileApi({anonymous:true});const denied=await anon.api.PATCH(new Request('https://example.test/api/profile',{method:'PATCH',body:'{}'}));assert.equal(denied.status,401);assert.equal(anon.updates.length,0);
});

test('a confirmed landing lead reaches Meta even when Meta loads after GA',()=>{
 const s=setup();s.api.trackFunnelEvent('presta_certo_lead_success','client');assert.equal(s.calls.length,1);
 const meta=[];s.window.fbq=(...args)=>meta.push(args);s.emit('prestacerto:analytics-ready');s.emit('prestacerto:analytics-ready');
 assert.equal(meta.length,1);assert.equal(meta[0][0],'track');assert.equal(meta[0][1],'Lead');
 assert.equal(meta[0][2].journey,'client');assert.doesNotMatch(JSON.stringify(meta),/@|email|utm_|gclid/);
 s.api.trackFunnelEvent('presta_certo_form_error','client');assert.equal(meta.length,1);
});
