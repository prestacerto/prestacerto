import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Circle, MessageSquare, FileText, Sparkles, Star, type LucideIcon } from "lucide-react";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getMyProjects, getMyProposals, getMyServices } from "@/lib/supabase/queries";
import { ProfileViewsCard } from '@/components/dashboard/profile-views-card';
import { isProfileComplete } from '@/lib/funnel';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const [profile, proposals, projects, services] = await Promise.all([
    getProfile(),
    user ? getMyProposals(user.id) : Promise.resolve([]),
    user ? getMyProjects(user.id) : Promise.resolve([]),
    user ? getMyServices(user.id) : Promise.resolve([]),
  ]);
  const firstName = profile?.full_name?.split(" ")[0] ?? "você";
  const isClient = profile?.role === "client" || profile?.role === "both";
  const profileComplete = isProfileComplete(profile ?? {});
  const hasProject = projects.length > 0;
  const hasReceivedProposals = projects.some(project => (project.proposal_count ?? 0) > 0);
  const receivedProposalsKnown = hasReceivedProposals || projects.every(project => project.proposal_count != null);
  const openProject = projects.find(project => project.status === 'open' && (project.proposal_count ?? 0) > 0)
    ?? projects.find(project => project.status === 'open')
    ?? projects[0];
  const nextStep = isClient
    ? hasProject
      ? { title: "Acompanhe as propostas do seu projeto", description: "Seu projeto já está na plataforma. Confira as propostas disponíveis e converse sobre as condições antes de escolher um profissional.", href: `/dashboard/projects/${encodeURIComponent(openProject.id)}`, cta: "Ver propostas do projeto" }
      : { title: "Publique seu primeiro projeto", description: "Conte o que você precisa, informe seu orçamento e revise os detalhes para apresentar o projeto aos profissionais.", href: "/publicar-projeto", cta: "Publicar meu primeiro projeto" }
    : profileComplete
      ? { title: "Encontre um projeto para o seu trabalho", description: "Seu perfil tem nome, apresentação e cidade preenchidos. Explore os projetos publicados e escolha uma oportunidade para preparar sua proposta.", href: "/projects", cta: "Ver projetos disponíveis" }
      : { title: "Complete sua apresentação profissional", description: "Revise seu nome, título profissional, descrição e cidade para ajudar os clientes a conhecer seu trabalho.", href: "/dashboard/profile", cta: "Completar meu perfil" };
  const checklist = isClient
    ? [{ label: "Primeiro projeto publicado", done: hasProject }, { label: "Propostas recebidas", done: receivedProposalsKnown ? hasReceivedProposals : null }]
    : [{ label: "Apresentação do perfil preenchida", done: profileComplete }, { label: "Primeira proposta enviada", done: proposals.length > 0 }];
  const freelancerStats = [
    { label: "Propostas enviadas", value: proposals.length, note: "enviadas pela sua conta", icon: MessageSquare },
    { label: "Projetos publicados", value: projects.length, note: "criados por você", icon: BriefcaseBusiness },
    { label: "Serviços ativos", value: services.filter((service) => service.is_active).length, note: "visíveis para clientes", icon: Sparkles },
    { label: "Avaliação", value: profile?.rating ? profile.rating.toFixed(1) : "—", note: profile?.rating_count ? `${profile.rating_count} avaliações` : "ainda sem avaliações", icon: Star },
  ];
  const clientStats = [
    { label: "Projetos publicados", value: projects.length, note: "criados por você", icon: BriefcaseBusiness },
    { label: "Propostas recebidas", value: projects.some(project => project.proposal_count == null) ? "—" : projects.reduce((total, project) => total + (project.proposal_count ?? 0), 0), note: "para os seus projetos", icon: MessageSquare },
    { label: "Projetos em andamento", value: projects.filter((project) => project.status === "in_progress").length, note: "acompanhados pela sua conta", icon: Sparkles },
    { label: "Projetos encerrados", value: projects.filter(project => project.status === "closed").length, note: "encerrados na sua conta", icon: Star },
  ];
  const stats = isClient ? clientStats : freelancerStats;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Seu espaço de trabalho</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Olá, {firstName}.</h1>
        <p className="mt-2 text-slate-600">Os números abaixo refletem a atividade da sua conta.</p>
      </div>

      <section aria-labelledby="dashboard-next-title" className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Seu próximo passo</p>
            <h2 id="dashboard-next-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{nextStep.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{nextStep.description}</p>
            <ul aria-label="Etapas da sua conta" className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {checklist.map(item => <li key={item.label} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                {item.done ? <CheckCircle2 className="mt-1 size-4 shrink-0 text-blue-700" aria-hidden="true" /> : <Circle className="mt-1 size-4 shrink-0 text-slate-500" aria-hidden="true" />}
                <span>{item.label}<span className="ml-1 text-xs text-slate-600">— {item.done === null ? "Não disponível" : item.done ? "Concluído" : "Ainda não"}</span></span>
              </li>)}
            </ul>
          </div>
          <Link href={nextStep.href} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{nextStep.cta}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
        </div>
      </section>

      {!isClient && <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200"><Sparkles className="size-3.5" /> Certo AI</div>
            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Sua proposta, com mais clareza.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">Use o Certo AI para revisar estrutura, escopo e próximo passo. Você confere tudo antes de enviar.</p>
          </div>
          <Link href="/certo-ai" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500">Conhecer o Certo AI <ArrowRight className="ml-2 size-4" /></Link>
        </div>
      </section>
      }

      {!isClient && user && <ProfileViewsCard userId={user.id} paid={profile?.plan === 'pro' || profile?.plan === 'business'}/>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{stat.label}</p><Icon className="size-4 text-blue-600" /></div><p className="mt-5 text-3xl font-black tracking-tight text-slate-950">{stat.value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{stat.note}</p></div>;
        })}
      </div>

      {(isClient || projects.length > 0) && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="meus-projetos" className="scroll-mt-28 text-xl font-semibold text-slate-900">Meus projetos</h2><Link href="/publicar-projeto" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700">Publicar novo projeto<ArrowRight className="size-4"/></Link></div><div className="mt-4 divide-y divide-slate-100">{projects.map(project => <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 hover:text-blue-700"><div><p className="font-medium">{project.title}</p><p className="mt-1 text-xs text-slate-500">{{ open: 'Aberto para propostas', in_progress: 'Em andamento', closed: 'Encerrado', cancelled: 'Cancelado' }[project.status] || project.status}</p></div><span className="inline-flex items-center gap-2 text-sm text-blue-700">Ver propostas<ArrowRight className="size-4"/></span></Link>)}{projects.length === 0 && <p className="py-5 text-sm leading-7 text-slate-500">Seu primeiro projeto aparecerá aqui depois da publicação.</p>}</div></section>}

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardLink href="/ferramentas/propostas" icon={FileText} title="Certo Propostas" description="Monte seu orçamento em PDF, reutilize propostas e lembre de retomar cada negociação." action="Abrir minha biblioteca de propostas" />
        {isClient ? <>
          <DashboardLink href="/services" icon={BriefcaseBusiness} title="Buscar prestadores" description="Compare profissionais, portfólios e avaliações antes de conversar." action="Encontrar profissionais" />
          <DashboardLink href="/publicar-projeto" icon={Sparkles} title="Publicar um projeto" description="Explique o que você precisa para começar a receber propostas." action="Criar projeto" />
          <DashboardLink href="/dashboard/messages" icon={MessageSquare} title="Minhas conversas" description="Concentre aqui as conversas ligadas aos seus projetos." action="Abrir mensagens" />
        </> : <>
          <DashboardLink href="/dashboard/services" icon={BriefcaseBusiness} title="Meus serviços" description="Publique o que você oferece, revise seus anúncios e pause quando precisar." action="Gerenciar meus serviços" />
          <DashboardLink href="/dashboard/proposals" icon={MessageSquare} title="Minhas propostas" description="Veja as propostas enviadas e converse com os clientes." action="Acompanhar propostas" />
          <DashboardLink href="/dashboard/match" icon={BriefcaseBusiness} title="Certo Oportunidades" description="Veja projetos compatíveis, filtre por valor e salve os melhores para revisar depois." action="Ver oportunidades para mim" />
          <DashboardLink href="/ferramentas/calculadora" icon={BarChart3} title="Calcular preço líquido" description="Use seus próprios custos, renda desejada e horas faturáveis para estimar o valor do trabalho." action="Abrir calculadora" />
          <DashboardLink href="/publicar-projeto" icon={Sparkles} title="Publicar um projeto" description="Explique o que você precisa e crie um ponto de partida claro para as propostas." action="Criar projeto" />
          <DashboardLink href="/dashboard/insights" icon={BarChart3} title="Ver meus insights" description="Acompanhe os sinais reais da sua atividade conforme sua conta ganha histórico." action="Abrir insights" />
          <DashboardLink href="/dashboard/certo-curriculo" icon={Star} title="Certo Currículo" description="Prepare uma versão mais clara do seu currículo, sempre com sua revisão final." action="Conhecer a oferta" />
        </>}
      </section>
    </div>
  );
}

function DashboardLink({ href, icon: Icon, title, description, action }: { href: string; icon: LucideIcon; title: string; description: string; action: string }) {
  return <Link href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"><Icon className="size-6 text-blue-600" /><h2 className="mt-5 text-lg font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">{action} <ArrowRight className="ml-1.5 size-4 transition group-hover:translate-x-0.5" /></span></Link>;
}
