import {timingSafeEqual} from 'node:crypto';
import {readJsonObject} from '@/lib/http/request-body';
import {recordSupport} from '@/lib/support/storage';
import {supportInstructions} from '@/lib/support/knowledge';
export const runtime='nodejs';
export const maxDuration=20;
export async function POST(request:Request){
 const key=process.env.SIMA_AI_API_KEY,tenant=process.env.SIMA_AI_TENANT_ID;
 const given=Buffer.from(request.headers.get('authorization')||''),expected=Buffer.from(`Bearer ${key}`);
 if(!key||key.length<32||!tenant||request.headers.get('X-Sima-Tenant-Id')!==tenant||given.length!==expected.length||!timingSafeEqual(given,expected))return Response.json({error:'Unauthorized'},{status:401});
 const input=await readJsonObject(request,32000);if(input.response)return input.response;const body=input.data;
 if(body.tenant_id!==tenant||body.contract!=='prestacerto-support-v1'||!['client','provider'].includes(String(body.audience))||!Array.isArray(body.messages)||body.messages.length>10)return Response.json({error:'Invalid request'},{status:400});
 const messages=body.messages.filter(m=>m&&typeof m==='object'&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length<=2000);
 if(!messages.length)return Response.json({error:'Invalid request'},{status:400});
 try{const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},signal:AbortSignal.timeout(10000),body:JSON.stringify({model:process.env.SIMA_AI_MODEL,messages:[{role:'system',content:supportInstructions(body.audience as 'client'|'provider')},...messages],max_completion_tokens:350,temperature:0.4,store:false})});if(!response.ok)throw new Error('provider');const result=await response.json();const reply=result.choices?.[0]?.message?.content;if(typeof reply!=='string'||!reply.trim()||reply.length>2000)throw new Error('provider');const usage={input_tokens:result.usage?.prompt_tokens??null,output_tokens:result.usage?.completion_tokens??null};await recordSupport({event:'message',audience:body.audience,messages:[...messages,{role:'assistant',content:reply}],usage,model:process.env.SIMA_AI_MODEL});return Response.json({tenant_id:tenant,reply,usage},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Support unavailable'},{status:503})}
}
