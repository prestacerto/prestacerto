import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { getMyProposals } from '@/lib/supabase/queries';
const labels:Record<string,string>={pending:'Pendente',accepted:'Aceita',rejected:'Recusada',withdrawn:'Retirada'};
export default async function ProposalsPage(){
 const user=await getAuthenticatedUser();if(!user)redirect('/login');
 const proposals=await getMyProposals(user.id);
 return <div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold text-slate-950">Minhas propostas</h1><p className="mt-3 text-slate-600">Acompanhe suas propostas e converse com os clientes.</p><div className="mt-6 space-y-4">{proposals.map(p=><article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-blue-700">{labels[p.status]??p.status}</p><h2 className="mt-2 text-xl font-semibold">{p.project?.title??'Projeto'}</h2><p className="mt-3 whitespace-pre-line text-slate-600">{p.message}</p><p className="mt-3 font-semibold">{p.proposed_price==null?'Valor a combinar':Number(p.proposed_price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</p><Link href={`/dashboard/messages/${p.id}`} className="mt-4 inline-block text-sm font-semibold text-blue-700">Abrir conversa →</Link></article>)}{!proposals.length&&<p className="rounded-2xl border border-slate-200 p-6 text-slate-600">Você ainda não enviou propostas. <Link href="/projects" className="text-blue-700">Ver projetos abertos</Link></p>}</div></div>;
}
