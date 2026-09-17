const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm');
const ts=require('typescript');
function setup(user=null, adsId=null) {
  class Reply {constructor(url){this.url=url;this.headers=new Headers();this.values=[];this.cookies={set:(...args)=>this.values.push(args),getAll:()=>this.values.map(([name,value])=>({name,value}))}}};
  const module={exports:{}};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/supabase/session.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module,exports:module.exports,console,require(name){
    if(name==='@supabase/ssr')return {createServerClient:(url,key,options)=>({auth:{getUser:async()=>{options.cookies.setAll([{name:'session',value:'refreshed',options:{httpOnly:true}}]);return {data:{user}}}},from:()=>({select(){return this},eq(){return this},maybeSingle:async()=>({data:{role:'client'}})})})};
    if(name==='next/server')return {NextResponse:{next:()=>new Reply(),redirect:url=>new Reply(url)}};
    if(name==='@/lib/google-ads')return {getGoogleAdsId:()=>adsId};
    if(name==='@/lib/supabase/config')return {SUPABASE_URL:'https://taktwwwpcyxhyylzmgho.supabase.co',SUPABASE_ANON_KEY:'public'};
    throw Error(name);
  }});
  return async path=>{const url=new URL('https://prestacerto.com.br'+path);url.clone=()=>new URL(url);return module.exports.updateSession({nextUrl:url,cookies:{getAll:()=>[],set(){}}})};
}
test('anonymous login redirect preserves full destination and refreshed cookies',async()=>{const res=await setup()('/dashboard/projects?status=open');assert.equal(res.url.pathname,'/login');assert.equal(res.url.searchParams.get('redirect'),'/dashboard/projects?status=open');assert.equal(res.values[0][0].value,'refreshed');assert.equal(res.headers.get('X-Frame-Options'),'DENY')});
test('role redirect preserves cookie rotation and security headers',async()=>{const res=await setup({id:'client'})('/dashboard/portfolio');assert.equal(res.url.pathname,'/dashboard');assert.equal(res.values[0][0].value,'refreshed');assert.equal(res.headers.get('X-Content-Type-Options'),'nosniff')});
test('CSP allows Supabase avatars and realtime while retaining origin restrictions',async()=>{const res=await setup()('/');const csp=res.headers.get('Content-Security-Policy');assert.match(csp,/connect-src[^;]*wss:\/\/taktwwwpcyxhyylzmgho.supabase.co/);assert.match(csp,/img-src[^;]*https:\/\/taktwwwpcyxhyylzmgho.supabase.co/);assert.doesNotMatch(csp,/img-src[^;]*\s\*(?:\s|;)/)});

test('CSP supports regional GA4 collection and image fallback without unrelated advertising endpoints',async()=>{
 const csp=(await setup()('/plans')).headers.get('Content-Security-Policy');
 assert.match(csp,/connect-src[^;]*https:\/\/\*\.google-analytics\.com/);
 assert.match(csp,/connect-src[^;]*https:\/\/\*\.analytics\.google\.com/);
 assert.match(csp,/img-src[^;]*https:\/\/\*\.google-analytics\.com/);
 assert.doesNotMatch(csp,/doubleclick|googleadservices|googlesyndication/);
});

test('Ads CSP origins are enabled only with a configured AW tag',async()=>{
 const csp=(await setup(null,'AW-123456789')('/plans')).headers.get('Content-Security-Policy');
 assert.match(csp,/script-src[^;]*https:\/\/www\.googleadservices\.com/);
 assert.match(csp,/connect-src[^;]*https:\/\/googleads\.g\.doubleclick\.net/);
 assert.match(csp,/img-src[^;]*https:\/\/www\.google\.com\.br/);
 assert.match(csp,/frame-src https:\/\/www\.googletagmanager\.com/);
 assert.doesNotMatch(csp,/connect-src[^;]*\s\*(?:\s|;)/);
});
