import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { createClient } from '@/lib/supabase/server';
import { AcceptProposalButton } from '@/components/accept-proposal-button';
import { CompleteProjectButton } from '@/components/complete-project-button';
import { ProjectReviewSection } from '@/components/projects/project-review-section';
const labels: Record<string,string> = {open:'Aberto',in_progress:'Em andamento',closed:'Concluído',cancelled:'Cancelado',pending:'Pendente',accepted:'Aceita',rejected:'Recusada',withdrawn:'Retirada'};
export default async function ProjectManagementPage({params}:{params:Promise<{id:string}>}) {
 const user=await getAuthenticatedUser();if(!user)redirect('/login');
 const {id}=await params;const db=await createClient();
 const {data:project}=await db.from('projects').select('id,client_id,title,description,status').eq('id',id).maybeSingle();
 if(!project||project.client_id!==user.id)notFound();
 const {data:proposals,error}=await db.from('proposals').select('id,freelancer_id,message,proposed_price,status,freelancer:profiles!proposals_freelancer_id_fkey(full_name)').eq('project_id',id).order('created_at',{ascending:false});
 return <div className="mx-auto max-w-4xl space-y-6">
  <Link href="/dashboard#meus-projetos" className="text-sm font-semibold text-blue-700">← Meus projetos</Link>
  <div><p className="text-sm font-semibold text-blue-700">{labels[project.status]??project.status}</p><h1 className="mt-2 text-3xl font-bold text-slate-950">{project.title}</h1><p className="mt-3 whitespace-pre-line text-slate-600">{project.description}</p></div>
  {project.status==='in_progress'&&<section className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><h2 className="font-semibold">Acompanhe a entrega</h2><p className="my-3 text-sm text-slate-600">Marque como concluído somente depois de receber o serviço combinado. O pagamento é acertado diretamente entre vocês.</p><CompleteProjectButton projectId={id}/></section>}
  <section><h2 className="text-xl font-semibold">Propostas recebidas {error?'':`(${proposals?.length??0})`}</h2>
   {error?<p className="mt-4 text-red-700">Não foi possível carregar as propostas. Tente novamente.</p>:!proposals?.length?<p className="mt-4 text-slate-600">As propostas dos profissionais aparecerão aqui.</p>:<div className="mt-4 space-y-4">{proposals.map(proposal=>{const freelancer=Array.isArray(proposal.freelancer)?proposal.freelancer[0]:proposal.freelancer;return <article key={proposal.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{freelancer?.full_name??'Profissional'}</h3><span className="text-sm text-slate-600">{labels[proposal.status]??proposal.status}</span></div><p className="mt-3 whitespace-pre-line text-slate-700">{proposal.message}</p><p className="mt-3 font-semibold">{proposal.proposed_price==null?'Valor a combinar':Number(proposal.proposed_price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><div className="mt-4 flex flex-wrap items-center gap-4">{project.status==='open'&&proposal.status==='pending'&&<AcceptProposalButton proposalId={proposal.id}/>}<Link href={`/dashboard/messages/${proposal.id}`} className="text-sm font-semibold text-blue-700">Abrir conversa</Link></div></article>})}</div>}
  </section>
  <ProjectReviewSection projectId={id} clientId={project.client_id} status={project.status} acceptedFreelancerId={error ? null : proposals?.find(proposal => proposal.status === 'accepted')?.freelancer_id} userId={user.id} />
 </div>;
}
