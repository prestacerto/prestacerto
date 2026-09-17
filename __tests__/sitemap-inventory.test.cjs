/* eslint-disable @typescript-eslint/no-require-imports -- Exercise sitemap query filters and pagination without remote data. */
const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function setup() {
 let active=0,peak=0;const calls=[],cache={};
 const profile={id:'provider',full_name:'Profissional',bio:null,city:'São Paulo',state:'SP',role:'freelancer'};
 const rows={categories:[{id:1,slug:'desenvolvimento-web'}],services:[...Array.from({length:1001},(_,i)=>({id:'service-'+i,freelancer_id:'provider',category_id:1,is_active:true})),{id:'hidden',is_active:false}],profiles:[profile,{...profile,id:'empty'},{...profile,id:'client',role:'client'}],projects:[{id:'open',status:'open'},{id:'closed',status:'completed'}],portfolio_public:[{url_slug:'public portfolio',is_active:true},{url_slug:'private',is_active:false}]};
 const db={from(table){const filters=[];let start=0,end=Infinity;const q={select(){return q},order(){return q},range(a,b){start=a;end=b;return q},eq(k,v){filters.push(r=>r[k]===v);return q},in(k,values){filters.push(r=>values.includes(r[k]));return q},not(k,op,v){filters.push(r=>r[k]!==v);return q},then(resolve,reject){calls.push({table,start,end});active++;peak=Math.max(peak,active);return new Promise(done=>setTimeout(()=>{active--;done({data:rows[table].filter(r=>filters.every(fn=>fn(r))).slice(start,end+1)})},0)).then(resolve,reject)}};return q}};
 function load(name){if(name==='@/lib/supabase/public')return {createPublicClient:()=>db};if(cache[name])return cache[name];if(name==='@/lib/data/aprenda-cards')return {APRENDA_CARDS:[{id:'real-article'}]};if(name==='@/lib/data/landing-data'||name==='../data/landing-data')return {CATEGORIAS:{'desenvolvimento-web':{}},CIDADES:{'sao-paulo':{name:'São Paulo',state:'SP'}}};const file=name==='sitemap'?'src/app/sitemap.ts':'src/'+name.slice(2)+'.ts';const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:load,URL,process:{env:{}},console});cache[name]=module.exports;return module.exports}
 return {run:()=>load('sitemap').default(),calls,peak:()=>peak};
}
test('sitemap reads independent inventory concurrently while paginating each table completely',async()=>{
 const s=setup(),entries=await s.run(),urls=entries.map(r=>r.url);assert.ok(s.peak()>=3);assert.ok(urls.includes('https://prestacerto.com.br/services/service-1000'));assert.equal(s.calls.filter(c=>c.table==='services').length,2);assert.equal(new Set(urls).size,urls.length);
});
test('sitemap contains only public active inventory and real regional content, without fake freshness or search URLs',async()=>{
 const entries=await setup().run(),urls=entries.map(r=>r.url);for(const path of ['/projects/open','/perfil/provider','/portfolio/public%20portfolio','/contratar/desenvolvimento-web/sao-paulo','/aprenda/real-article'])assert.ok(urls.includes('https://prestacerto.com.br'+path),path);
 for(const unwanted of ['hidden','closed','/perfil/empty','/perfil/client','/portfolio/private','?q=','/dashboard','/login','/checkout'])assert.ok(!urls.some(url=>url.includes(unwanted)),unwanted);assert.ok(entries.every(row=>!row.lastModified));
});
