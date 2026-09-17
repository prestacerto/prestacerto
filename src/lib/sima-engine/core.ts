import {createHash,randomBytes,randomInt,randomUUID,timingSafeEqual} from 'node:crypto';
import {readJsonObject} from '@/lib/http/request-body';
import {tenants,type TenantId} from './tenants';
import type {EngineStore,Environment} from './store';
export type Turn={role:'user'|'assistant';content:string};
type Credential={tenant:TenantId;environment:Environment;sha256:string};
type Input={message_id:string;session_id:string|null;tenant:TenantId;message:string;page_context:{path:string;audience:string}};
type Claim={hash:string;requestId:string;sessionId:string;created:number};
type Session={expires:number;audience:string};
type State={index:number;turns:Turn[]};
type Outcome={status:number;body:Record<string,unknown>};
export type Generated={text:string;action_types:string[];handoff_required:boolean;handoff_reason:string|null;handoff_summary:string|null;usage:{input_tokens:number;output_tokens:number}};
export type Dependencies={credentials:string|undefined;store:(env:Environment)=>Promise<EngineStore>;generate:(tenant:TenantId,audience:string,turns:Turn[])=>Promise<Generated>};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sid=/^ses_[A-Za-z0-9_-]{32}$/;
export const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
// UTF-8 bytes, not JavaScript character count, determine Storage object size.
// Keep the newest exchanges under budget before both inference and persistence.
function boundedTurns(turns:Turn[]):Turn[]{
  const recent=turns.slice(-8);
  while(recent.length>1&&Buffer.byteLength(JSON.stringify(recent),'utf8')>50000)recent.shift();
  return recent;
}
function response(body:Record<string,unknown>,status=200,extra:Record<string,string>={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...extra}})}
function error(requestId:string,code:string,status:number,message:string,retryable=false){return response({request_id:requestId,error:{code,message,retryable}},status,status===429?{'Retry-After':'60'}:{})}
function auth(request:Request,raw:string|undefined):Credential|null{
  const value=request.headers.get('authorization')||'';
  if(!/^Bearer [A-Za-z0-9_-]{32,160}$/.test(value))return null;
  let entries:Credential[];try{entries=JSON.parse(raw||'[]')}catch{return null}
  if(!Array.isArray(entries))return null;
  const digest=Buffer.from(hash(value.slice(7)),'hex');
  for(const entry of entries){if(entry&&typeof entry.sha256==='string'&&/^[a-f0-9]{64}$/.test(entry.sha256)&&Object.hasOwn(tenants,entry.tenant)&&['test','production'].includes(entry.environment)&&timingSafeEqual(digest,Buffer.from(entry.sha256,'hex')))return entry}
  return null;
}
function parse(value:Record<string,unknown>):Input|null{
  const context=value.page_context as Record<string,unknown>|undefined;
  if(typeof value.tenant!=='string'||!Object.hasOwn(tenants,value.tenant)||typeof value.message_id!=='string'||!uuid.test(value.message_id)||!(value.session_id===null||typeof value.session_id==='string'&&sid.test(value.session_id))||typeof value.message!=='string'||!value.message.trim()||value.message.length>8000||!context||typeof context!=='object'||Array.isArray(context)||typeof context.path!=='string')return null;
  const tenant=value.tenant as TenantId,config=tenants[tenant];
  const audience=context.audience??(tenant==='prestacerto'?'client':'company');
  if(!config.paths.includes(context.path)||typeof audience!=='string'||!config.audiences.includes(audience)||Object.keys(context).some(k=>!['path','audience'].includes(k))||Object.keys(value).some(k=>!['message_id','session_id','tenant','message','page_context'].includes(k)))return null;
  return {message_id:value.message_id,session_id:value.session_id as string|null,tenant,message:value.message,page_context:{path:context.path,audience}};
}
export async function handleEngine(request:Request,environment:Environment,deps:Dependencies):Promise<Response>{
  const requestId=randomUUID(),started=Date.now();
  const credential=auth(request,deps.credentials);
  if(!credential)return error(requestId,'UNAUTHORIZED',401,'Credencial inválida.');
  if(credential.environment!==environment)return error(requestId,'ENVIRONMENT_FORBIDDEN',403,'Credencial não autorizada neste ambiente.');
  // This endpoint is server-to-server; reject browser calls even if a key leaks.
  if(request.headers.has('origin'))return error(requestId,'SERVER_ONLY',403,'Use o backend autorizado para acessar o motor.');
  const parsed=await readJsonObject(request,32000);
  if(parsed.response)return error(requestId,'INVALID_BODY',parsed.response.status,'Payload JSON inválido ou acima do limite.');
  if(parsed.data.tenant!==credential.tenant)return error(requestId,'TENANT_FORBIDDEN',403,'Tenant não autorizado.');
  const input=parse(parsed.data);
  if(!input||request.headers.get('idempotency-key')!==input.message_id)return error(requestId,'INVALID_REQUEST',400,'Confira message_id, Idempotency-Key, sessão e contexto.');
  const prefix=input.tenant,op=`${prefix}/messages/${input.message_id}`,fingerprint=hash(JSON.stringify(input));
  let store:EngineStore;
  try{store=await deps.store(environment)}catch{return error(requestId,'STORAGE_UNAVAILABLE',503,'Motor temporariamente indisponível.',true)}
  async function replay(claim:Claim){
    if(claim.hash!==fingerprint)return error(requestId,'IDEMPOTENCY_CONFLICT',409,'A chave já foi usada com outro conteúdo.');
    const outcome=await store.read<Outcome>(`${op}/result.json`);
    if(outcome)return response(outcome.body,outcome.status,{'Idempotency-Replayed':'true',...(outcome.status===429?{'Retry-After':'60'}:{})});
    return response({api_version:'v1',request_id:claim.requestId,message_id:input!.message_id,session_id:claim.sessionId,status:'processing',retry_after_seconds:3},202,{'Retry-After':'3'});
  }
  try{
    const previous=await store.read<Claim>(`${op}/claim.json`);if(previous)return await replay(previous);
    let session:Session|null=null;
    if(input.session_id){session=await store.read<Session>(`${prefix}/sessions/${input.session_id}/meta.json`);if(!session||session.expires<Date.now())return error(requestId,'SESSION_NOT_FOUND',404,'Sessão indisponível ou expirada.');if(session.audience!==input.page_context.audience)return error(requestId,'SESSION_CONTEXT_CONFLICT',409,'Inicie outra sessão para mudar o público.');}
    const sessionId=input.session_id||`ses_${randomBytes(24).toString('base64url')}`;
    const claim:Claim={hash:fingerprint,requestId,sessionId,created:Date.now()};
    if(!await store.create(`${op}/claim.json`,claim)){const won=await store.read<Claim>(`${op}/claim.json`);return won?await replay(won):error(requestId,'RETRY_PENDING',503,'Repita com a mesma chave.',true)}
    const sessionPath=`${prefix}/sessions/${sessionId}`,lock=`${sessionPath}/lock.json`;
    async function terminal(status:number,code:string,message:string){
      const result:Outcome={status,body:{request_id:requestId,error:{code,message,retryable:false}}};
      await store.create(`${op}/result.json`,result);return response(result.body,status,status===429?{'Retry-After':'60'}:{});
    }
    // Only the unique message claimant reserves quota; concurrent retries are free.
    // Immutable slots enforce hard distributed ceilings. Collisions are conservative.
    const minute=Math.floor(Date.now()/60000),day=new Date().toISOString().slice(0,10);
    async function reserveSlot(path:string,size:number){
      for(let attempt=0;attempt<8;attempt++)if(await store.create(`${path}/${randomInt(size)}.json`,{}))return true;
      return false;
    }
    if(!await reserveSlot(`${prefix}/quota/${day}/minute-${minute}`,120)||!await reserveSlot(`${prefix}/quota/${day}/daily`,1000))return await terminal(429,'RATE_LIMITED','Aguarde antes de enviar uma nova mensagem. Esta chave conserva o resultado original.');
    if(!input.session_id)await store.create(`${sessionPath}/meta.json`,{expires:Date.now()+86400000,audience:input.page_context.audience});
    if(!await store.create(lock,{requestId,messageId:input.message_id}))return await terminal(409,'SESSION_BUSY','Outra mensagem está em processamento nesta sessão.');
    let settled=false;
    try{
      const last=await store.latest<State>(`${sessionPath}/turns`),index=(last?.index??0)+1;
      if(index>50){const result=await terminal(429,'SESSION_LIMIT','O limite desta conversa foi atingido.');settled=true;return result}
      const turns:Turn[]=boundedTurns([...(last?.turns??[]),{role:'user',content:input.message}]);
      let generated:Generated;
      try{generated=await deps.generate(input.tenant,input.page_context.audience,turns)}catch{
        const result=await terminal(504,'INFERENCE_FAILED','A resposta não foi concluída. Fale com a equipe; repetir esta chave não gera nova inferência.');settled=true;return result;
      }
      const optedOut=/^(pare|parar|stop|não quero (?:mais )?(?:mensagens|ofertas)|nao quero (?:mais )?(?:mensagens|ofertas))[.!\s]*$/i.test(input.message.trim());
      const actions=optedOut?[]:tenants[input.tenant].actions.filter(a=>generated.action_types.includes(a.type)).slice(0,3);
      const body={api_version:'v1',request_id:requestId,message_id:input.message_id,session_id:sessionId,text:generated.text,actions,handoff:{required:generated.handoff_required,reason:generated.handoff_required?generated.handoff_reason:null,summary:generated.handoff_required?generated.handoff_summary:null}};
      await store.create(`${sessionPath}/turns/${String(index).padStart(5,'0')}.json`,{index,turns:boundedTurns([...turns,{role:'assistant',content:generated.text}])});
      await store.create(`${op}/result.json`,{status:200,body});settled=true;
      console.info(JSON.stringify({event:'sima_engine_response',request_id:requestId,tenant:input.tenant,environment,latency_ms:Date.now()-started,...generated.usage,estimated_model_usd:(generated.usage.input_tokens*.4+generated.usage.output_tokens*1.6)/1000000}));
      return response(body);
    }finally{
      // A crash/uncertain persistence leaves the lock closed, never repeats inference.
      // Operators can investigate orphan claims; a visitor may start a new session.
      if(settled)await store.remove(lock).catch(()=>undefined);
    }
  }catch(e){console.info(JSON.stringify({event:'sima_engine_error',request_id:requestId,tenant:input.tenant,environment,latency_ms:Date.now()-started}));return error(requestId,e instanceof Error&&e.message==='STORAGE_THROTTLED'?'RATE_LIMITED':'ENGINE_UNAVAILABLE',e instanceof Error&&e.message==='STORAGE_THROTTLED'?429:503,'Repita a mesma mensagem com a mesma chave ou fale com a equipe.',true)}
}
