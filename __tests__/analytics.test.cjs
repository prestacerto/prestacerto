const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm'), ts=require('typescript');
function load(stored='denied',hydrated=false) {
  const events=[],effects=[],stores=[];const module={exports:{}};
  const window={location:{origin:'https://prestacerto.com.br',pathname:'/plans',search:''},localStorage:{getItem:()=>stored,setItem(){}},gtag:(...args)=>events.push(args),fbq:(...args)=>events.push(args),addEventListener(){},removeEventListener(){},dispatchEvent(){}};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/analytics.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,window,document:{cookie:''},process:{env:{NEXT_PUBLIC_GA_ID:'G-TEST'}},URL,URLSearchParams,Set,console,require(name){
    if(name==='@/components/assiny-purchase-tracker')return {AssinyPurchaseTracker(){}};
    if(name==='@/lib/tracking-dispatch'||name==='@/lib/google-ads'){const target={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/'+name.slice(2)+'.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:target,exports:target.exports,window,document:{cookie:'',referrer:''},URL,Set,process:{env:{}},require(spec){if(spec==='@/lib/google-ads'){const config={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/google-ads.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:config,exports:config.exports,process:{env:{}}});return config.exports}throw Error(spec)}});return target.exports;}
    if(name==='react')return {useState:initial=>[initial,()=>{}],useEffect:fn=>effects.push(fn),useSyncExternalStore:(subscribe,client,server)=>{stores.push({client,server});return hydrated?client():server()}};
    if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
    if(name==='next/dynamic')return {default:()=>function DeferredTrackingScripts(){}};throw Error(name);
  }});
  return {api:module.exports,events,stores};
}
test('saved browser consent never changes the server hydration snapshot',()=>{for(const value of ['granted','denied']){const s=load(value);s.api.Analytics();assert.equal(s.stores[0].server(),'unknown');assert.equal(s.stores[0].client(),value);assert.equal(s.events.length,0)}});
test('denied consent prevents registration, purchase and arbitrary tracking calls',()=>{const s=load('denied');s.api.trackRegistration('client');s.api.trackConfirmedPurchase('test',10);s.api.trackAnalyticsEvent('test');assert.equal(s.events.length,0)});
test('consented events reach configured analytics functions',()=>{const s=load('granted');s.api.trackRegistration('client');assert.equal(s.events.length,2)});
test('provider scripts are requested only after consent, while privacy controls remain available',()=>{
 for(const consent of ['unknown','denied','granted']){
  const s=load(consent,true);const children=s.api.Analytics().props.children.slice(1);
  assert.equal(Boolean(children[0]),consent==='granted');
  assert.equal(Boolean(children[1]),consent==='unknown');
  assert.equal(Boolean(children[2]),consent!=='unknown');
 }
});
