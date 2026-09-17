const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
require('../scripts/register-test-typescript.cjs');
const {readJsonObject} = require('../src/lib/http/request-body.ts');
const projectId = '11111111-1111-4111-8111-111111111111';
function load(route, {limited = false, user = {id:'freelancer'}, project = {client_id:'client',status:'open'}, proposal = {freelancer_id:'freelancer',projects:{client_id:'client'}}} = {}) {
  const writes=[];
  const db = {auth:{getUser:async()=>({data:{user}})},from(table){
    const q={select(){return q},eq(){return q},order(){return q},insert(value){writes.push({table,value});return q},update(value){writes.push({table,value});return q},single(){return Promise.resolve(result())},maybeSingle(){return Promise.resolve(result())},then(ok,fail){return Promise.resolve(result()).then(ok,fail)}};
    function result(){return {data:table==='projects'?project:table==='profiles'?{full_name:'Teste'}:table==='proposals'?{id:projectId,...proposal}:[],error:null}}
    return q;
  }};
  const source=fs.readFileSync(`src/app/api/proposals/${route}/route.ts`.replace('//','/'),'utf8');
  const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  vm.runInNewContext(js,{exports:module.exports,module,require(name){
    if(name==='next/server')return {NextResponse:{json:(body,options)=>Response.json(body,options)}};
    if(name==='@/lib/supabase/server')return {createClient:async()=>db};
    if(name==='@/lib/http/request-body')return {readJsonObject};
    if(name==='@/lib/rate-limit')return {rateLimiters:{proposals:{limit:async()=>({success:!limited,reset:Date.now()+60000})},messages:{limit:async()=>({success:!limited,reset:Date.now()+60000})}},rateLimitResponse:()=>Response.json({error:'Limited'},{status:429})};
    throw new Error(`Unexpected dependency: ${name}`);
  },console,process:{env:{NEXT_PUBLIC_APP_URL:'https://prestacerto.com.br'}},fetch:async()=>new Response('{}'),Response});
  return {handlers:module.exports,writes};
}
function request(body){return new Request('https://prestacerto.com.br/api/proposals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
const params={params:Promise.resolve({id:projectId})};
test('every proposal handler rejects visitors without server credentials',async()=>{
  for(const route of ['', '[id]', '[id]/accept','[id]/messages']){
    const {handlers,writes}=load(route,{user:null});
    for(const method of Object.keys(handlers))assert.equal((await handlers[method](request({}),params)).status,401,`${route} ${method}`);
    assert.equal(writes.length,0);
  }
});
test('limited and malformed proposal writes stop before database insertion',async()=>{
  for(const route of ['', '[id]/messages']){
    const limited=load(route,{limited:true});
    assert.equal((await limited.handlers.POST(request({}),params)).status,429);
    assert.equal(limited.writes.length,0);
    const malformed=load(route);
    assert.equal((await malformed.handlers.POST(request(null),params)).status,400);
    assert.equal(malformed.writes.length,0);
  }
});
test('signed-in freelancer can submit an optional price through the session client',async()=>{
  const {handlers,writes}=load('');
  assert.equal((await handlers.POST(request({projectId,message:'Posso realizar este trabalho.',proposedPrice:null}))).status,201);
  assert.equal(writes[0].value.proposed_price,null);
  assert.equal(writes[0].value.freelancer_id,'freelancer');
});
test('negative prices, short text and invalid identifiers never write',async()=>{
  for(const invalid of [{proposedPrice:-1},{proposedPrice:'5'},{proposedPrice:0},{message:'x'},{projectId:'bad'}]){
    const {handlers,writes}=load('');
    assert.equal((await handlers.POST(request({projectId,message:'Posso realizar este trabalho.',proposedPrice:50,...invalid}))).status,400);
    assert.equal(writes.length,0);
  }
});
test('closed projects and own projects refuse proposals',async()=>{
  for(const [project,status] of [[{client_id:'freelancer',status:'open'},403],[{client_id:'client',status:'closed'},409]]){
    const {handlers,writes}=load('',{project});
    assert.equal((await handlers.POST(request({projectId,message:'Posso realizar este trabalho.',proposedPrice:50}))).status,status);
    assert.equal(writes.length,0);
  }
});
test('outsiders cannot read or send proposal messages even if a row is returned',async()=>{
  const {handlers,writes}=load('[id]/messages',{user:{id:'outsider'}});
  assert.equal((await handlers.GET(request({}),params)).status,404);
  assert.equal((await handlers.POST(request({body:'Mensagem de teste'}),params)).status,404);
  assert.equal(writes.length,0);
});
test('only the project client can accept a proposal',async()=>{
  const forbidden=load('[id]/accept');
  assert.equal((await forbidden.handlers.POST(request({}),params)).status,403);
  assert.equal(forbidden.writes.length,0);
  const allowed=load('[id]/accept',{user:{id:'client'}});
  assert.equal((await allowed.handlers.POST(request({}),params)).status,200);
  assert.equal(allowed.writes[0].value.status,'accepted');
});
