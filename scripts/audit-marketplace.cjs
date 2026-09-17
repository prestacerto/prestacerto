// Explicit production smoke test. Uses three disposable accounts and one clearly
// labelled project; removes only this run's exact IDs, even when a check fails.
const {randomUUID,randomBytes}=require('node:crypto');
const assert=require('node:assert/strict');
module.exports=async function audit({db,baseUrl='https://prestacerto.com.br'}) {
  const run=randomUUID();
  const supabaseUrl='https://taktwwwpcyxhyylzmgho.supabase.co';
  const publicKey='sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36';
  const actors=['client','freelancer','outsider'].map((role)=>({role,email:`audit-${run}-${role}@example.invalid`,password:randomBytes(24).toString('base64url'),cookies:new Map()}));
  const report={run,baseUrl,startedAt:new Date().toISOString(),checks:[],cleanup:false};
  const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);console.log('PASS',name);};
  async function request(actor,path,method='GET',body) {
    const response=await fetch(baseUrl+path,{method,headers:{'Content-Type':'application/json',...(actor?{Cookie:[...actor.cookies].map(([k,v])=>`${k}=${v}`).join('; ')}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000),redirect:'manual'});
    if(actor)for(const cookie of response.headers.getSetCookie()){const first=cookie.split(';')[0];const eq=first.indexOf('=');actor.cookies.set(first.slice(0,eq),first.slice(eq+1));}
    const text=await response.text();let data;try{data=JSON.parse(text)}catch{data={}};
    return {status:response.status,data,text,headers:response.headers};
  }
  try {
    const settings=await fetch(supabaseUrl+'/auth/v1/settings',{headers:{apikey:publicKey},signal:AbortSignal.timeout(10000)}).then(r=>r.json());
    check('Test signups do not send confirmation email',settings.mailer_autoconfirm===true);
    for(const actor of actors){
      const r=await request(actor,'/api/auth/register','POST',{fullName:`Teste automático ${actor.role}`,email:actor.email,password:actor.password,role:actor.role==='client'?'client':'freelancer'});
      check(`Registration and session: ${actor.role}`,r.status===200&&r.data.session===true&&Boolean(r.data.user?.id));actor.id=r.data.user.id;
    }
    const [client,freelancer,outsider]=actors;
    check('Anonymous project submission denied',(await request(null,'/api/projects/create','POST',{})).status===401);
    const title=`TESTE AUTOMATIZADO — NÃO CONTRATAR ${run.slice(0,8)}`;
    const created=await request(client,'/api/projects/create','POST',{title,description:'Projeto fictício de auditoria técnica. Não contratar, não enviar propostas reais. Removido automaticamente ao concluir o teste.',budget:100,category:'geral',skills:'teste automatizado'});
    check('Authenticated project publication',created.status===201&&created.data.project?.status==='open');
    const projectId=created.data.project.id;
    check('Published project persisted with correct owner',(await db.query('select id from public.projects where id=$1 and client_id=$2 and status=$3',[projectId,client.id,'open'])).rowCount===1);
    const page=await request(null,`/projects/${projectId}`);check('Published project visible on public detail page',page.status===200&&page.text.includes(run.slice(0,8)));
    check('Client cannot propose to own project',(await request(client,'/api/proposals','POST',{projectId,message:'Proposta fictícia para auditoria.',proposedPrice:100})).status===403);
    const proposal=await request(freelancer,'/api/proposals','POST',{projectId,message:'Proposta fictícia de auditoria. Sem contratação real.',proposedPrice:100});
    check('Freelancer sends proposal',proposal.status===201&&Boolean(proposal.data.proposal?.id));
    const proposalId=proposal.data.proposal.id;
    check('Duplicate proposal is rejected',(await request(freelancer,'/api/proposals','POST',{projectId,message:'Proposta duplicada de auditoria.',proposedPrice:100})).status===409);
    check('Outsider cannot view private conversation',(await request(outsider,`/api/proposals/${proposalId}/messages`)).status===404);
    check('Outsider cannot send private messages',(await request(outsider,`/api/proposals/${proposalId}/messages`,'POST',{body:'Mensagem fictícia de auditoria.'})).status===404);
    for(const actor of [client,freelancer])check(`Participant sends message: ${actor.role}`,(await request(actor,`/api/proposals/${proposalId}/messages`,'POST',{body:`Mensagem fictícia de ${actor.role}.`})).status===201);
    const messages=await request(client,`/api/proposals/${proposalId}/messages`);check('Participant reads both messages',messages.status===200&&messages.data.messages?.length===2);
    check('Freelancer cannot accept own proposal',(await request(freelancer,`/api/proposals/${proposalId}/accept`,'POST',{})).status===403);
    check('Client accepts proposal',(await request(client,`/api/proposals/${proposalId}/accept`,'POST',{})).status===200);
    check('Project changes to in progress',(await db.query('select status from public.projects where id=$1',[projectId])).rows[0]?.status==='in_progress');
    check('Client completes project in direct payment mode',(await request(client,`/api/projects/${projectId}/complete`,'POST',{})).status===200);
    check('Project closure persisted',(await db.query('select status from public.projects where id=$1',[projectId])).rows[0]?.status==='closed');
    check('Closed project rejects new proposals',(await request(outsider,'/api/proposals','POST',{projectId,message:'Proposta fictícia tardia de auditoria.',proposedPrice:100})).status===409);
    for(const actor of actors){
      const login=await request(actor,'/api/auth/login','POST',{email:actor.email,password:actor.password});check(`Login: ${actor.role}`,login.status===200);
    }
  } catch(error){report.error=error.message;console.error('FAILED',error.message);}
  finally {
    // Lookup only the three cryptographically unique emails created by this run,
    // so cleanup also handles a signup response lost in transit.
    await db.query('BEGIN');
    try {
      const ids=(await db.query('select id from auth.users where email=any($1::text[])',[actors.map(a=>a.email)])).rows.map(r=>r.id);
      await db.query('delete from public.messages where sender_id=any($1::uuid[])',[ids]);
      await db.query('delete from auth.users where id=any($1::uuid[]) and email=any($2::text[])',[ids,actors.map(a=>a.email)]);
      check('Disposable accounts removed',(await db.query('select id from auth.users where email=any($1::text[])',[actors.map(a=>a.email)])).rowCount===0);
      check('Disposable projects removed',(await db.query('select id from public.projects where client_id=any($1::uuid[])',[ids])).rowCount===0);
      await db.query('COMMIT');report.cleanup=true;
    } catch(error){await db.query('ROLLBACK');report.cleanupError=error.code||'cleanup_failed';}
    report.finishedAt=new Date().toISOString();
  }
  return report;
};
