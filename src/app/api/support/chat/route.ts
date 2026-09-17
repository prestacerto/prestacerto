import { createHash } from 'node:crypto';
import { reserveSupport } from '@/lib/support/storage';
import { readJsonObject } from '@/lib/http/request-body';
import { createLocalLimiter } from '@/lib/local-rate-limit';
import { getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import { askSupport, supportSettings } from '@/lib/support/chat';
import { POST as tenantEngine } from '@/app/api/support/engine/route';
export const runtime='nodejs';
export const maxDuration=20;
const local=createLocalLimiter(15,60000);
function json(body:unknown,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}
export async function POST(request:Request){
 const started=Date.now();
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem não autorizada.'},403);
 const ip=createHash('sha256').update(getClientIP(request)).digest('hex');
 const limit=await local.limit(ip);if(!limit.success)return rateLimitResponse(limit.reset);
 const input=await readJsonObject(request,28000);if(input.response)return input.response;
 const {message,audience,history}=input.data;
 if(typeof message!=='string'||!message.trim()||message.length>1500||!['client','provider'].includes(String(audience)))return json({error:'Escreva uma mensagem de até 1.500 caracteres e escolha como quer usar o PrestaCerto.'},400);
 const settings=supportSettings(process.env);
 if(!settings)return json({error:'O Cadu ainda não está disponível para conversar. Você pode enviar sua dúvida à equipe.',handoff:true},503);
 try{
  if(!await reserveSupport(ip))return rateLimitResponse(Date.now()+60000);
  const transport:typeof fetch=settings.url==='https://prestacerto.com.br/api/support/engine' ? async (url,init)=>tenantEngine(new Request(String(url),init)) : fetch;
  const answer=await askSupport({message:message.trim(),audience:audience as 'client'|'provider',history},settings,transport);
  console.info(JSON.stringify({event:'support_response',tenant:'prestacerto',latency_ms:Date.now()-started,...answer.usage}));
  return json({reply:answer.reply,history:answer.history});
 }catch(error){const invalid=error instanceof Error&&error.message==='history';console.info(JSON.stringify({event:'support_error',tenant:'prestacerto',latency_ms:Date.now()-started,category:invalid?'history':'unavailable'}));return json({error:invalid?'A conversa expirou. Feche e inicie uma nova conversa.':'Não consegui responder agora. Tente novamente ou fale com a equipe.',handoff:true},invalid?400:503)}
}
