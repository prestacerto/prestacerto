/* eslint-disable @typescript-eslint/no-require-imports -- Execute actual route exports with isolated dependencies. */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function setup(options={}) {
 const calls=[];const modules={};
 const queries={getCategories:async()=>[{id:1,slug:'design'}],listServices:async args=>{calls.push(args);return options.items||[]},listOpenProjects:async args=>{calls.push(args);return options.items||[]},getServiceById:async()=>options.item||null,getProjectById:async()=>options.item||null};
 function load(name){
  if(name==='react')return {cache:fn=>{const memo=new Map();return (...args)=>{const key=JSON.stringify(args);if(!memo.has(key))memo.set(key,fn(...args));return memo.get(key)}}};
  if(name==='react/jsx-runtime')return {jsx:()=>null,jsxs:()=>null};
  if(name==='next/navigation')return {notFound(){throw Error('NEXT_NOT_FOUND')}};
  if(name==='@/lib/supabase/queries')return queries;
  if(name==='@/lib/auth/getUser')return {getAuthenticatedUser:async()=>null};
  if(name.startsWith('@/lib/seo/')||name==='@/lib/search-pagination'||name.startsWith('@/app/')) {
   if(modules[name])return modules[name];let file='src/'+name.slice(2);file+=fs.existsSync(file+'.tsx')?'.tsx':'.ts';
   const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module,exports:module.exports,require:load,URL,URLSearchParams,process:{env:{}},console});modules[name]=module.exports;return module.exports;
  }
  if(name==='../data/landing-data')return {CATEGORIAS:{},CIDADES:{}};
  return new Proxy({}, {get:()=>()=>({})});
 }
 return {load,calls};
}
test('out-of-range listings have explicit noindex for every bot and no nonexistent canonical',async()=>{
 for(const path of ['services','projects']) {const {load}=setup();const route=load(`@/app/(public)/${path}/page`);const props={searchParams:Promise.resolve({page:'10000'})};const metadata=await route.generateMetadata(props);assert.equal(metadata.robots.index,false);assert.equal(metadata.robots.googleBot.index,false);assert.equal(metadata.alternates,undefined);await assert.rejects(route.default(props),/NEXT_NOT_FOUND/);}
});
test('valid pagination keeps its own canonical and shares its inventory read with the page',async()=>{
 for(const path of ['services','projects']) {const {load,calls}=setup({items:[{id:'listing',description:'Descrição real',skills:[]}]});const route=load(`@/app/(public)/${path}/page`);const props={searchParams:Promise.resolve({page:'2'})};const metadata=await route.generateMetadata(props);assert.equal(metadata.alternates.canonical,`/${path}?page=2`);await route.default(props);assert.equal(calls.length,1);assert.equal(calls[0].page,2);}
});
test('filtered results remain noindex and unknown categories never query all inventory',async()=>{
 for(const path of ['services','projects']) {const {load,calls}=setup({items:[{id:'listing',description:'Descrição real',skills:[]}]});const route=load(`@/app/(public)/${path}/page`);const metadata=await route.generateMetadata({searchParams:Promise.resolve({q:'design'})});assert.equal(metadata.robots.index,false);await route.default({searchParams:Promise.resolve({categoria:'unknown'})});assert.equal(calls.length,0);}
});
test('missing detail metadata is unambiguously noindex while the page still raises not-found',async()=>{
 for(const path of ['services','projects']){const {load}=setup();const route=load(`@/app/(public)/${path}/[id]/page`);const props={params:Promise.resolve({id:'missing'})};const metadata=await route.generateMetadata(props);assert.equal(metadata.robots.index,false);assert.equal(metadata.robots.googleBot.index,false);assert.equal(metadata.alternates,undefined);await assert.rejects(route.default(props),/NEXT_NOT_FOUND/);}
});
test('detail canonical uses stored identity and unavailable listings noindex all bots',async()=>{
 for(const path of ['services','projects']){const {load}=setup({item:{id:'abcdef',title:'Título real',description:'Descrição real',status:'closed',is_active:false}});const route=load(`@/app/(public)/${path}/[id]/page`);const metadata=await route.generateMetadata({params:Promise.resolve({id:'ABCDEF'})});assert.equal(metadata.alternates.canonical,`https://prestacerto.com.br/${path}/abcdef`);assert.equal(metadata.openGraph.url,metadata.alternates.canonical);assert.equal(metadata.robots.index,false);assert.equal(metadata.robots.googleBot.index,false);}
});
