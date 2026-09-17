import { createHmac, timingSafeEqual } from 'node:crypto';
import { supportInstructions, type SupportAudience } from './knowledge';

type Turn = { role: 'user' | 'assistant'; content: string };
type Settings = { url: string; key: string; tenant: string; model: string };
export function supportSettings(env: NodeJS.ProcessEnv): Settings | null {
  const { SIMA_AI_API_URL:url, SIMA_AI_API_KEY:key, SIMA_AI_TENANT_ID:tenant, SIMA_AI_MODEL:model } = env;
  if (!url || !key || !tenant || !model) return null;
  try { const parsed=new URL(url); if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.hash||parsed.search||parsed.hostname==='localhost'||parsed.hostname.endsWith('.local')||/^[\d:[\].]+$/.test(parsed.hostname))return null; } catch { return null; }
  return {url,key,tenant,model};
}
function signature(raw:string,settings:Settings){return createHmac('sha256',settings.key).update('prestacerto-support-v1:'+settings.tenant+':'+raw).digest('base64url')}
export function signHistory(turns:Turn[],audience:SupportAudience,settings:Settings){const raw=Buffer.from(JSON.stringify({turns:turns.slice(-8),audience,expires:Date.now()+1800000})).toString('base64url');return raw+'.'+signature(raw,settings)}
export function readHistory(token:unknown,audience:SupportAudience,settings:Settings):Turn[]{
  if(token===undefined||token==='')return [];
  if(typeof token!=='string'||token.length>24000)throw new Error('history');
  const [raw,sig,...extra]=token.split('.');if(!raw||!sig||extra.length)throw new Error('history');const expected=Buffer.from(signature(raw,settings)),actual=Buffer.from(sig);if(expected.length!==actual.length||!timingSafeEqual(expected,actual))throw new Error('history');
  const data=JSON.parse(Buffer.from(raw,'base64url').toString('utf8'));if(data.audience!==audience||data.expires<Date.now()||!Array.isArray(data.turns)||data.turns.length>8)throw new Error('history');return data.turns;
}
// The remote service must implement this versioned, tenant-authenticated contract.
// No provider fallback: a missing SimaAI service must never silently use another account.
export async function askSupport(input:{message:string;audience:SupportAudience;history?:unknown},settings:Settings,transport:typeof fetch=fetch){
  const prior=readHistory(input.history,input.audience,settings);
  const response=await transport(settings.url,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:`Bearer ${settings.key}`,'X-Sima-Tenant-Id':settings.tenant},signal:AbortSignal.timeout(12000),body:JSON.stringify({contract:'prestacerto-support-v1',tenant_id:settings.tenant,audience:input.audience,model:settings.model,max_output_tokens:350,messages:[{role:'system',content:supportInstructions(input.audience)},...prior,{role:'user',content:input.message}],tools:[]})});
  if(!response.ok)throw new Error('upstream');
  const reader=response.body?.getReader();if(!reader)throw new Error('upstream');let bytes=0;const chunks:Uint8Array[]=[];try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>16000){await reader.cancel();throw new Error('upstream')}chunks.push(value)}}finally{reader.releaseLock()}
  const data=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if(data.tenant_id!==settings.tenant||typeof data.reply!=='string'||!data.reply.trim()||data.reply.length>2000)throw new Error('upstream');
  const reply=data.reply.trim();const turns:Turn[]=[...prior,{role:'user',content:input.message},{role:'assistant',content:reply}];
  return {reply,history:signHistory(turns,input.audience,settings),usage:{input_tokens:Number.isSafeInteger(data.usage?.input_tokens)&&data.usage.input_tokens>=0?data.usage.input_tokens:null,output_tokens:Number.isSafeInteger(data.usage?.output_tokens)&&data.usage.output_tokens>=0?data.usage.output_tokens:null}};
}
