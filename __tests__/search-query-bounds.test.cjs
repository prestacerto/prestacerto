const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load() {
  const calls=[];
  const request = {then(resolve){return Promise.resolve({data:[],error:null}).then(resolve)}};
  for(const method of ['select','eq','in','order','or','range']) request[method]=(...args)=>{calls.push([method,...args]);return request};
  const db={from(table){calls.push(['from',table]);return request}};
  const compile=file=>ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const helper={exports:{}};vm.runInNewContext(compile('src/lib/search-pagination.ts'),{exports:helper.exports,module:helper,URLSearchParams});
  const module={exports:{}};
  vm.runInNewContext(compile('src/lib/supabase/queries.ts'),{exports:module.exports,module,console,require(name){
    if(name==='@/lib/supabase/server')return {createClient:async()=>db};
    if(name==='@/lib/supabase/service')return {createServiceClient:()=>db};
    if(name==='@/lib/supabase/categories')return {getPublicCategories:async()=>[]};
    if(name==='@/lib/search-pagination')return helper.exports;
    throw Error(name);
  }});
  return {...module.exports,calls};
}
test('public result pages request at most 25 rows with stable ordering and their filters',async()=>{
  for(const name of ['listServices','listOpenProjects']) {
    const api=load();await api[name]({page:2,query:'design',categoryId:7});
    assert.deepEqual(api.calls.find(c=>c[0]==='range'),['range',24,48]);
    assert.ok(api.calls.some(c=>c[0]==='order'&&c[1]==='id'));
    assert.ok(api.calls.some(c=>c[0]==='eq'&&c[1]==='category_id'&&c[2]===7));
    assert.ok(api.calls.some(c=>c[0]==='or'&&c[1].includes('description.ilike.')));
  }
});
test('pagination does not silently truncate the separate matching feature',async()=>{
  const api=load();await api.listOpenProjects({});
  assert.ok(!api.calls.some(c=>c[0]==='range'));
});
