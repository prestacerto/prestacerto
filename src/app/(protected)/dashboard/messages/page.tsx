import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const user = await getAuthenticatedUser();
  const db = await createClient();
  const { data, error } = user ? await db.from("proposals").select("id,status,project:projects(id,title)").order("created_at", { ascending:false }) : { data: [], error: null };
  // The database returns only the freelancer's or project owner's proposals.
  const conversations = (data ?? []).map(p => ({ ...p, project: Array.isArray(p.project) ? p.project[0] : p.project }));

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Conversas do projeto</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Mensagens</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Converse com os participantes das suas propostas para combinar escopo, prazo e entrega.</p>

      <div className="mt-8 space-y-3">
        {error ? <p className="text-red-700">Não foi possível carregar suas conversas. Tente novamente.</p> : conversations.length ? conversations.map((proposal) => (
          <Link key={proposal.id} href={`/dashboard/messages/${proposal.id}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md">
            <div className="flex min-w-0 items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><MessageSquare className="size-5" /></span><div className="min-w-0"><h2 className="truncate font-bold text-slate-950">{proposal.project?.title ?? "Projeto"}</h2><p className="mt-1 text-sm text-slate-500">Abrir conversa</p></div></div>
            <ArrowRight className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
          </Link>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><MessageSquare className="mx-auto size-7 text-slate-400" /><h2 className="mt-4 font-bold text-slate-950">Ainda não há conversas abertas.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">As propostas que você enviar ou receber aparecerão aqui.</p><Link href="/projects" className="mt-6 inline-flex items-center text-sm font-bold text-blue-700">Ver projetos abertos <ArrowRight className="ml-2 size-4" /></Link></div>
        )}
      </div>
    </div>
  );
}
