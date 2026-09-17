import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, CircleDashed, Star } from "lucide-react";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getMyProjects, getMyProposals, getMyServices } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

async function hasPublishedPortfolio(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("portfolio_public").select("url_slug").eq("freelancer_id", userId).eq("is_active", true).maybeSingle();
    return error ? null : Boolean(data);
  } catch {
    return null;
  }
}

export default async function InsightsPage() {
  const user = await getAuthenticatedUser();
  const [profile, proposals, projects, services, portfolioPublished] = await Promise.all([
    getProfile(),
    user ? getMyProposals(user.id) : Promise.resolve([]),
    user ? getMyProjects(user.id) : Promise.resolve([]),
    user ? getMyServices(user.id) : Promise.resolve([]),
    user ? hasPublishedPortfolio(user.id) : Promise.resolve(null),
  ]);
  const accepted = proposals.filter((proposal) => proposal.status === "accepted").length;
  const pending = proposals.filter((proposal) => proposal.status === "pending").length;
  const signals = [
    { label: "Serviços ativos", value: services.filter((service) => service.is_active).length, complete: services.some((service) => service.is_active), hint: "Quanto mais claro o seu serviço, melhor será a comparação com projetos." },
    { label: "Propostas em aberto", value: pending, complete: pending > 0, hint: "Acompanhe os projetos aos quais você já respondeu." },
    { label: "Propostas aceitas", value: accepted, complete: accepted > 0, hint: "Propostas aceitas abrem espaço para alinhar entrega e próximos passos." },
    { label: "Avaliações recebidas", value: profile?.rating_count ?? 0, complete: Boolean(profile?.rating_count), hint: profile?.rating ? `Sua média atual é ${profile.rating.toFixed(1)}.` : "A avaliação aparece após a conclusão de um projeto." },
  ];
  const checklist = [
    { label: "Perfil com apresentação", done: Boolean(profile?.headline || profile?.bio), href: "/dashboard/portfolio" },
    { label: "Portfólio publicado", done: portfolioPublished === true, href: "/dashboard/portfolio", unknown: portfolioPublished === null },
    { label: "Primeira proposta enviada", done: proposals.length > 0, href: "/dashboard/match" },
  ];
  const recommendations = [
    !checklist[0].done ? { text: "Adicione um título ou uma apresentação ao seu perfil para explicar rapidamente o que você faz.", href: checklist[0].href } : null,
    !services.some((service) => service.is_active) ? { text: "Cadastre um serviço com habilidades para começar a aparecer em comparações reais.", href: "/dashboard/portfolio" } : null,
    proposals.length === 0 ? { text: "Veja oportunidades compatíveis e envie uma proposta apenas para projetos que façam sentido.", href: "/dashboard/match" } : null,
    pending > 0 ? { text: `Você tem ${pending} proposta${pending === 1 ? "" : "s"} em aberto. Revise os detalhes e acompanhe as conversas.`, href: "/dashboard/messages" } : null,
  ].filter((item): item is { text: string; href: string } => Boolean(item)).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Certo Insights</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Sinais da sua atividade.</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Aqui você encontra somente dados gerados pela sua conta no PrestaCerto. Insights de mercado serão adicionados quando houver uma base de dados suficiente e verificável.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {signals.map((signal) => <article key={signal.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{signal.label}</p>{signal.complete ? <CheckCircle2 className="size-4 text-emerald-600" /> : <CircleDashed className="size-4 text-slate-400" />}</div><p className="mt-5 text-3xl font-black tracking-tight text-slate-950">{signal.value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{signal.hint}</p></article>)}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><BarChart3 className="size-5" /></span><div><h2 className="font-bold text-slate-950">Próximo melhor passo</h2><p className="mt-2 text-sm leading-6 text-slate-600">{services.filter((service) => service.is_active).length ? "Use o Certo Match para comparar suas habilidades com projetos abertos." : "Cadastre um serviço com título, descrição e habilidades para começar a receber comparações úteis."}</p><Link href={services.filter((service) => service.is_active).length ? "/dashboard/match" : "/dashboard/portfolio"} className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">Continuar <ArrowRight className="ml-2 size-4" /></Link></div></div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-blue-100 bg-[#eef5ff] p-6">
          <h2 className="font-bold text-slate-950">Próximos passos reais</h2>
          {recommendations.length ? <div className="mt-4 space-y-3">{recommendations.map((recommendation) => <Link key={recommendation.text} href={recommendation.href} className="block rounded-xl bg-white/80 p-4 text-sm leading-6 text-slate-700 transition hover:bg-white"><ArrowRight className="mr-2 inline size-4 text-blue-600" />{recommendation.text}</Link>)}</div> : <p className="mt-3 text-sm leading-6 text-slate-600">Seu perfil já tem atividade suficiente para acompanhar por aqui. Continue mantendo serviços e propostas atualizados.</p>}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">Checklist de progresso</h2>
          <div className="mt-4 space-y-3">{checklist.map((item) => <Link key={item.label} href={item.href} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700"><span>{item.label}</span>{item.unknown ? <span className="text-xs text-slate-400">verificar</span> : item.done ? <CheckCircle2 className="size-4 text-emerald-600" /> : <CircleDashed className="size-4 text-slate-400" />}</Link>)}</div>
        </section>
      </div>

      {profile?.rating ? <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><Star className="size-4 fill-amber-400 text-amber-400" />Avaliação média: {profile.rating.toFixed(1)} de 5</p> : null}
      {projects.length ? <p className="mt-3 text-sm text-slate-500">Você publicou {projects.length} projeto{projects.length === 1 ? "" : "s"} até agora.</p> : null}
    </div>
  );
}
