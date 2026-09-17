const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup({offline=false}={}) {
  const handlers={}, writes=[], deleted=[], requests=[];
  const cache={add:async url=>writes.push(url),match:async()=>undefined,put:async req=>writes.push(req.url)};
  const context={URL,Response,console,fetch:async req=>{requests.push(req.url);if(offline)throw Error('offline');return new Response('network');},
    caches:{open:async()=>cache,match:async()=>new Response('offline page'),keys:async()=>['prestacerto-v1','prestacerto-static-v2','other-app'],delete:async name=>deleted.push(name)},
    self:{location:{origin:'https://prestacerto.com.br'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting(){},clients:{claim:async()=>{}}}};
  vm.runInNewContext(fs.readFileSync('public/service-worker.js','utf8'),context);
  async function request(path,mode='cors') {let response;handlers.fetch({request:{url:'https://prestacerto.com.br'+path,method:'GET',mode},respondWith:r=>response=r});return response ? (await response).text():null;}
  return {handlers,writes,deleted,requests,request};
}
test('private HTML navigation is fetched fresh and never cached',async()=>{const s=setup();assert.equal(await s.request('/dashboard','navigate'),'network');assert.deepEqual(s.writes,[])});
test('RSC, API, auth and public page requests never use the static cache',async()=>{const s=setup();for(const path of ['/dashboard?_rsc=old','/api/proposals','/callback?code=example','/projects?_rsc=old','/services'])assert.equal(await s.request(path),null);assert.deepEqual(s.writes,[])});
test('only immutable Next assets are cached',async()=>{const s=setup();assert.equal(await s.request('/_next/static/chunks/abc.js'),'network');assert.equal(s.writes.length,1)});
test('offline navigation shows a neutral page instead of another user session',async()=>{const s=setup({offline:true});assert.equal(await s.request('/dashboard','navigate'),'offline page');assert.deepEqual(s.writes,[])});
test('activation removes old PrestaCerto session caches and preserves unrelated caches',async()=>{const s=setup();let done;s.handlers.activate({waitUntil:p=>done=p});await done;assert.deepEqual(s.deleted,['prestacerto-v1'])});
