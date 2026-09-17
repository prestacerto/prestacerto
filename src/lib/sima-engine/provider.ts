import 'server-only';
import {tenants,type TenantId} from './tenants';
import type {Generated,Turn} from './core';
export async function generateAnswer(tenant:TenantId,audience:string,turns:Turn[]):Promise<Generated>{
  if(!process.env.OPENAI_API_KEY)throw new Error('MODEL_NOT_CONFIGURED');
  const config=tenants[tenant];
  const schema={type:'object',additionalProperties:false,required:['text','action_types','handoff_required','handoff_reason','handoff_summary'],properties:{text:{type:'string'},action_types:{type:'array',items:{type:'string',enum:config.actions.map(a=>a.type)}},handoff_required:{type:'boolean'},handoff_reason:{type:['string','null']},handoff_summary:{type:['string','null']}}};
  const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(10000),body:JSON.stringify({model:'gpt-4.1-mini',store:false,temperature:0.4,max_completion_tokens:600,response_format:{type:'json_schema',json_schema:{name:'commercial_answer',strict:true,schema}},messages:[{role:'system',content:config.instructions(audience)+'\nSaída final: JSON conforme o schema. O campo text é texto simples, até 180 palavras. Selecione action_types apenas quando úteis dentre '+JSON.stringify(config.actions)+'. handoff_required para pedido de humano, negociação, reclamação, intenção clara de compra ou informação não coberta. Resumo factual curto para a equipe; o envio não foi realizado. Nunca alegue transferência concluída. Respeite opt-out. Não invente experiência profissional pessoal.'},...turns]})});
  if(!r.ok){
    const errorBody=(await r.text()).slice(0,500);
    let errorCode='unknown';
    try{errorCode=JSON.parse(errorBody)?.error?.code??errorCode;}catch{}
    console.error(JSON.stringify({event:'sima_model_error',tenant,status:r.status,error_code:errorCode}));
    throw new Error('MODEL_UNAVAILABLE');
  }
  const raw=await r.text();if(raw.length>40000)throw new Error('MODEL_RESPONSE_TOO_LARGE');
  const data=JSON.parse(raw),choice=data.choices?.[0];
  console.info(JSON.stringify({event:'sima_model_usage',tenant,input_tokens:data.usage?.prompt_tokens??0,output_tokens:data.usage?.completion_tokens??0}));
  if(choice?.finish_reason!=='stop'||choice.message?.refusal)throw new Error('MODEL_INCOMPLETE');
  const value=JSON.parse(choice.message.content);
  if(typeof value.text!=='string'||!value.text.trim()||value.text.length>6000||!Array.isArray(value.action_types)||!value.action_types.every((x:unknown)=>typeof x==='string'&&config.actions.some(a=>a.type===x))||typeof value.handoff_required!=='boolean'||!(value.handoff_reason===null||typeof value.handoff_reason==='string'&&value.handoff_reason.length<300)||!(value.handoff_summary===null||typeof value.handoff_summary==='string'&&value.handoff_summary.length<2000))throw new Error('MODEL_INVALID');
  return {...value,usage:{input_tokens:Number(data.usage?.prompt_tokens)||0,output_tokens:Number(data.usage?.completion_tokens)||0}};
}
