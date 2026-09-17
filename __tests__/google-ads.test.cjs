/* eslint-disable @typescript-eslint/no-require-imports */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
// Local-only fixtures; these identifiers are never configuration for the site.
const configured={NEXT_PUBLIC_GA_ID:'G-TEST',NEXT_PUBLIC_GOOGLE_TAG_ID:'AW-123456789',NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL:'unit_lead',NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:'unit_purchase'};
const lead='lead:00000000-0000-4000-8000-000000000071',receipt='assiny:approved_purchase:00000000-0000-4000-8000-000000000072';
function setup(env={...configured},options={}){
 const calls=[],records=new Map(),cache={},listeners={};let consent=options.consent||'granted';
 const window={location:{origin:'https://prestacerto.com.br',pathname:'/para-clientes',hostname:'prestacerto.com.br',search:'?email=private@example.com'},localStorage:{getItem:k=>k==='prestacerto_tracking_consent'?consent:records.get(k)||null,setItem:(k,v)=>records.set(k,v)},sessionStorage:{getItem(){return null},setItem(){}},matchMedia:()=>({matches:true}),addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn),dispatchEvent(){}};
 const document={cookie:'',referrer:'https://example.com/path?email=private@example.com'};
 if(!options.defer)window.gtag=(...args)=>calls.push(args);
 function load(name){if(name==='next/script')return {default:'Script'};if(name==='react/jsx-runtime')return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};if(!name.startsWith('@/'))return require(name);if(cache[name])return cache[name].exports;const base='src/'+name.slice(2),file=fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx',m={exports:{}};cache[name]=m;vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:m,exports:m.exports,require:load,process:{env},window,document,URL,URLSearchParams,Set,Date,Number});return m.exports;}
 return {env,window,document,calls,records,load,dispatch:load('@/lib/tracking-dispatch').dispatchTrackingEvent,consent:value=>consent=value,emit:name=>(listeners[name]||[]).forEach(fn=>fn())};
}
const purchases={currency:'BRL',value:59.9,transaction_id:receipt,email:'never@example.com',phone:'5511999999999'};
const ads=s=>s.calls.filter(call=>call[0]==='event'&&call[1]==='conversion');
test('Ads remains disabled with missing, malformed or conflicting conversion configuration',()=>{
 for(const env of [{},{NEXT_PUBLIC_GOOGLE_TAG_ID:'G-TEST',NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:'unit_purchase'},{...configured,NEXT_PUBLIC_GOOGLE_TAG_ID:'AW-123/script'},{...configured,NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:'unit_lead'}]){const s=setup(env);s.dispatch('presta_certo_lead_success',{},undefined,lead);s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,0)}
 const onlyLead=setup({...configured,NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:''});onlyLead.dispatch('presta_certo_lead_success',{},undefined,lead);onlyLead.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(onlyLead).length,1);assert.equal(ads(onlyLead)[0][2].send_to,'AW-123456789/unit_lead');
 for(const label of ['<script>','a/b','a b','x'.repeat(121)]){const s=setup({...configured,NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL:label});s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,0)}
});
test('lead and paid purchase use distinct exact destinations and a minimal payload',()=>{
 const s=setup();s.dispatch('presta_certo_lead_success',{email:'never@example.com'},undefined,lead);s.dispatch('purchase',purchases,undefined,receipt);
 assert.deepEqual(JSON.parse(JSON.stringify(ads(s).map(call=>call[2]))),[{send_to:'AW-123456789/unit_lead',transaction_id:lead},{send_to:'AW-123456789/unit_purchase',transaction_id:receipt,value:59.9,currency:'BRL'}]);
 assert.doesNotMatch(JSON.stringify(ads(s)),/@|5511|email|phone|page_location|utm/);
 assert.equal(s.calls.find(call=>call[1]==='purchase')[2].send_to,'G-TEST');
});
test('page visits, CTA, registration, errors and checkout start are never Ads lead or purchase conversions',()=>{
 const s=setup();for(const name of ['page_view','select_plan','begin_checkout','sign_up','presta_certo_landing_view','presta_certo_form_start','presta_certo_form_error','presta_certo_cta_click'])s.dispatch(name,purchases,undefined,receipt);assert.equal(ads(s).length,0);
 s.dispatch('presta_certo_lead_success',{});assert.equal(ads(s).length,0);
});
test('purchase needs the same transaction ID and a positive finite amount in BRL',()=>{
 for(const data of [{...purchases,value:0},{...purchases,value:-1},{...purchases,value:Infinity},{...purchases,value:'59.9'},{...purchases,currency:'USD'},{...purchases,transaction_id:'different'}]){const s=setup();s.dispatch('purchase',data,undefined,receipt);assert.equal(ads(s).length,0)}
 for(const id of ['private@example.com','x'.repeat(65)]){const s=setup();s.dispatch('purchase',{...purchases,transaction_id:id},undefined,id);assert.equal(ads(s).length,0);}
});
test('Ads purchase deduplicates independently of previous GA sends and repeated readiness events',()=>{
 const s=setup(undefined,{defer:true});s.records.set('prestacerto:conversion:google:'+receipt,'1');s.dispatch('purchase',purchases,undefined,receipt);s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,0);
 s.window.gtag=(...args)=>s.calls.push(args);s.emit('prestacerto:analytics-ready');s.emit('prestacerto:analytics-ready');s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,1);assert.equal(s.calls.filter(call=>call[1]==='purchase').length,0);
 s.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL='new_action';s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,2);assert.equal(ads(s)[1][2].send_to,'AW-123456789/new_action');
});
test('consent denial and revocation prevent Ads conversion sends and pending replay',()=>{
 const denied=setup(undefined,{consent:'denied'});assert.equal(denied.dispatch('purchase',purchases,undefined,receipt),false);assert.equal(denied.calls.length,0);assert.equal(denied.records.size,0);
 const s=setup(undefined,{defer:true});s.dispatch('purchase',purchases,undefined,receipt);s.consent('denied');s.emit('prestacerto:tracking-consent');s.window.gtag=(...args)=>s.calls.push(args);s.emit('prestacerto:analytics-ready');assert.equal(s.calls.length,0);s.consent('granted');s.dispatch('purchase',purchases,undefined,receipt);assert.equal(ads(s).length,1);
});
test('lead UUID is passed through the real funnel and deduplicates only the confirmed lead event',()=>{
 const s=setup(),funnel=s.load('@/lib/landing-tracking');funnel.trackLandingEvent('presta_certo_lead_success','client',lead.slice(5));funnel.trackLandingEvent('presta_certo_lead_success','client',lead.slice(5));assert.equal(ads(s).length,1);
 const invalid=setup();invalid.load('@/lib/landing-tracking').trackLandingEvent('presta_certo_lead_success','client','private@example.com');assert.equal(ads(invalid).length,0);
});
function nodes(tree){if(!tree||typeof tree!=='object')return [];const children=tree.props?.children;return [tree,...(Array.isArray(children)?children.flat(Infinity):[children]).flatMap(nodes)];}
test('one Google script initializes GA4 and AW, and late consent revocation prevents initialization',()=>{
 for(const consent of ['granted','denied']){const s=setup(),scripts=nodes(s.load('@/components/analytics-scripts').TrackingScripts());assert.equal(scripts.filter(node=>node.props?.src?.includes('/gtag/js')).length,1);const inline=scripts.find(node=>node.props?.id==='prestacerto-google-consent').props.children;s.consent(consent);
  vm.runInNewContext(inline,{window:s.window,document:s.document,gtag:s.window.gtag,CustomEvent:function(){},URL,Date});const config=s.calls.filter(call=>call[0]==='config');assert.equal(config.length,consent==='granted'?2:0);if(consent==='granted'){assert.equal(config.find(call=>call[1]==='AW-123456789')[2].send_page_view,false);assert.equal(config.find(call=>call[1]==='G-TEST')[2].page_location,'https://prestacerto.com.br/para-clientes');}}
});
