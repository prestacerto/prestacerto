import {createServiceClient} from '@/lib/supabase/service';
import {readJsonObject} from '@/lib/http/request-body';
import {getClientIP,rateLimiters,rateLimitResponse} from '@/lib/rate-limit';
import {sendContactNotificationEmail} from '@/lib/email/resend';
export const runtime='nodejs';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origem não autorizada.'},{status:403});
 const limit=await rateLimiters.contact.limit(getClientIP(request));if(!limit.success)return rateLimitResponse(limit.reset);
 const input=await readJsonObject(request,20000);if(input.response)return input.response;
 const {name,email,subject,message}=input.data;
 if(typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof subject!=='string'||subject.length>200||typeof message!=='string'||message.length<10||message.length>10000)return Response.json({error:'Confira os dados do pedido.'},{status:400});
 try{
  const payload={name:name.trim(),email:email.trim(),subject:`Cadu — ${subject}`.slice(0,200),message};
  const {error}=await createServiceClient().from('contact_messages').insert(payload);
  if(error)return Response.json({error:'Não foi possível registrar o pedido.'},{status:503});
  await sendContactNotificationEmail(payload).catch(()=>undefined);
  return Response.json({success:true},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Atendimento indisponível no momento.'},{status:503})}
}
