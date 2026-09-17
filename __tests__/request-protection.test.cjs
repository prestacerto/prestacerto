const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
require('../scripts/register-test-typescript.cjs');
const {readJsonObject}=require('../src/lib/http/request-body.ts');
const {createLocalLimiter}=require('../src/lib/local-rate-limit.ts');
const req=(body,headers={'content-type':'application/json'})=>new Request('https://prestacerto.com.br/api/test',{method:'POST',body,headers});

test('JSON reader rejects malformed, non-object, oversized and non-JSON data',async()=>{
  for(const body of ['null','[]','123','"text"','{'])assert.equal((await readJsonObject(req(body))).response.status,400);
  assert.equal((await readJsonObject(req('{}',{'content-type':'text/plain'}))).response.status,415);
  assert.equal((await readJsonObject(req('{"value":"long"}'),8)).response.status,413);
  assert.equal((await readJsonObject(req('{}',{'content-type':'application/json','content-length':'1000'}),8)).response.status,413);
  assert.deepEqual((await readJsonObject(req('{"valid":true}'))).data,{valid:true});
});
test('streamed bodies cannot evade the size bound by omitting Content-Length',async()=>{
  const body=new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode('{"a":"'));controller.enqueue(new TextEncoder().encode('x'.repeat(50)));controller.close();}});
  const request=new Request('https://prestacerto.com.br',{method:'POST',headers:{'content-type':'application/json'},body,duplex:'half'});
  assert.equal((await readJsonObject(request,16)).response.status,413);
});
test('local limits are independent, recover after expiry and cannot be evicted at capacity',async()=>{
  let now=0;const limiter=createLocalLimiter(2,1000,2,()=>now);
  assert.equal((await limiter.limit('a')).success,true);
  assert.equal((await limiter.limit('a')).remaining,0);
  assert.equal((await limiter.limit('a')).success,false);
  assert.equal((await limiter.limit('b')).success,true);
  assert.equal((await limiter.limit('c')).success,false);
  assert.equal((await limiter.limit('a')).success,false);
  now=1000;
  assert.equal((await limiter.limit('c')).success,true);
  assert.equal((await limiter.limit('a')).success,true);
});

function handler(path,{limited=false,providerError=null,secret}={}){
  const calls=[];const module={exports:{}};
  const js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(js,{exports:module.exports,module,Response,console:{error(){}},process:{env:{INTERNAL_NOTIFICATION_SECRET:secret}},require(name){
    if(name==='next/server')return {NextResponse:{json:(...args)=>Response.json(...args)}};
    if(name==='@/lib/http/request-body')return {readJsonObject};
    if(name==='@/lib/rate-limit')return {getClientIP:()=> 'test',rateLimiters:{recovery:{limit:async()=>({success:!limited,reset:Date.now()+60000})}},rateLimitResponse:()=>Response.json({error:'Limited'},{status:429})};
    if(name==='@/lib/supabase/config')return {SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON_KEY:'public-test-key'};
    if(name==='@supabase/supabase-js')return {createClient:(url,key)=>{assert.equal(key,'public-test-key');return {auth:{resetPasswordForEmail:async(email,options)=>{calls.push({email,...options});return {error:providerError};}}};}};
    if(name==='@/lib/supabase/service')return {createServiceClient:()=>{throw new Error('Unexpected privileged database access')}};
    if(name==='web-push')return {};
    throw new Error(`Unexpected dependency ${name}`);
  }});
  return {post:module.exports.POST,calls};
}
const recovery='src/app/api/auth/forgot-password/route.ts';
test('recovery uses public auth and canonical reset page without an administrative key',async()=>{
  const h=handler(recovery);assert.equal((await h.post(req('{"email":"  Test@Example.com "}'))).status,200);
  assert.equal(h.calls[0].email,'test@example.com');assert.equal(h.calls[0].redirectTo,'https://prestacerto.com.br/reset-password');
});
test('invalid and limited recovery requests do not contact the provider',async()=>{
  for(const body of ['null','{','{"email":"invalid"}']){const h=handler(recovery);assert.equal((await h.post(req(body))).status,400);assert.equal(h.calls.length,0);}
  const h=handler(recovery,{limited:true});assert.equal((await h.post(req('{"email":"test@example.com"}'))).status,429);assert.equal(h.calls.length,0);
  const down=handler(recovery,{providerError:{status:503,code:'unavailable'}});assert.equal((await down.post(req('{"email":"test@example.com"}'))).status,503);
});
test('notification routes reject unauthenticated callers before privileged access',async()=>{
  for(const route of ['send-message-notification','send-proposal-notification']){
    for(const secret of [undefined,'configured-secret']){
      const h=handler(`src/app/api/notifications/${route}/route.ts`,{secret});
      assert.equal((await h.post(req('{}'))).status,401);
      assert.equal((await h.post(req('{}',{'content-type':'application/json','x-internal-notification-secret':'wrong'}))).status,401);
    }
  }
});
