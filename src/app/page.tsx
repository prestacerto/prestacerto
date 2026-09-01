import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { StructuredData, getFAQSchema } from "@/components/structured-data";
import { HomePriceCalculator } from "@/components/home/home-price-calculator";
import { PLANS } from "@/lib/plans-data";
import { getProfile } from "@/lib/auth/getUser";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardPenLine,
  Check,
  Code2,
  Crown,
  Gauge,
  GraduationCap,
  HeartPulse,
  Handshake,
  MessagesSquare,
  LockKeyhole,
  Megaphone,
  Palette,
  Repeat2,
  ShieldCheck,
  SearchCheck,
  Sparkles,
  Target,
  Store,
  Users2,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categories: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}> = [
  {
    title: "Tecnologia & desenvolvimento",
    description: "Sites, sistemas, apps e automações",
    icon: Code2,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    title: "Design & conteúdo",
    description: "Identidade visual, UI/UX, vídeo e conteúdo visual",
    icon: Palette,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Marketing & vendas",
    description: "Tráfego, redes sociais, conteúdo e estratégia",
    icon: Megaphone,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Consultoria & operações",
    description: "Finanças, gestão, processos e crescimento",
    icon: BriefcaseBusiness,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    title: "Casa & manutenção",
    description: "Elétrica, pintura, reparos e montagem",
    icon: Wrench,
    tone: "bg-pink-50 text-pink-600",
  },
  {
    title: "Aulas particulares",
    description: "Idiomas, reforço, música e habilidades",
    icon: GraduationCap,
    tone: "bg-lime-50 text-lime-700",
  },
  {
    title: "Beleza & autocuidado",
    description: "Estética, cabelo, maquiagem e cuidados não clínicos",
    icon: HeartPulse,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    title: "Eventos & fotografia",
    description: "Festas, fotos, filmagem e produção",
    icon: Store,
    tone: "bg-red-50 text-red-600",
  },
];

const decisionPoints = [
  {
    number: "01",
    title: "Conte o que você precisa",
    description: "Descreva seu projeto ou escolha a área do serviço que quer resolver.",
    icon: ClipboardPenLine,
  },
  {
    number: "02",
    title: "Busque profissionais",
    description: "Compare perfil, portfólio, prazo e valor antes de iniciar uma conversa.",
    icon: SearchCheck,
  },
  {
    number: "03",
    title: "Combine com clareza",
    description: "Alinhe escopo, entrega e pagamento para começar com segurança.",
    icon: Handshake,
  },
];

export const metadata: Metadata = {
  title: "Contrate freelancers e prestadores de serviços no Brasil",
  description:
    "Encontre freelancers e profissionais confiáveis para seu projeto. Compare perfis, avaliações e propostas no marketplace PrestaCerto.",
  keywords: [
    "contratar freelancer",
    "contratar prestador de serviço",
    "marketplace de serviços",
    "freelancer no Brasil",
    "profissional para projeto",
    "publicar projeto freelancer",
    "encontrar profissional confiável",
    "serviços profissionais online",
  ],
  alternates: { canonical: "https://prestacerto.com.br/" },
  openGraph: {
    title: "Contrate freelancers e prestadores de serviços | PrestaCerto",
    description:
      "Publique seu projeto ou encontre profissionais confiáveis para resolver o que sua empresa precisa.",
    url: "https://prestacerto.com.br/",
    type: "website",
    images: [
      {
        url: "/images/hero-human-connection.png",
        width: 1920,
        height: 1080,
        alt: "Profissional trabalhando com notebook e pronta para novos projetos no PrestaCerto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contrate freelancers e prestadores de serviços | PrestaCerto",
    description: "Encontre profissionais, compare opções e publique seu projeto com transparência.",
    images: ["/images/hero-human-connection.png"],
  },
};

const homeFaqs = [
  {
    question: "Como contratar um freelancer no PrestaCerto?",
    answer:
      "Você pode publicar um projeto com o que precisa ou explorar serviços e perfis de profissionais. Compare experiência, avaliações, prazo e valor antes de conversar e contratar.",
  },
  {
    question: "O freelancer paga comissão por projeto?",
    answer:
      "Não. O freelancer recebe 100% do valor combinado com o cliente. O PrestaCerto monetiza por planos e recursos opcionais, com transparência.",
  },
  {
    question: "Posso publicar um projeto gratuitamente?",
    answer:
      "Sim. Você pode criar uma conta e iniciar a publicação do projeto para explicar sua necessidade e receber propostas de profissionais.",
  },
  {
    question: "O que é o Certo AI?",
    answer:
      "O Certo AI ajuda o freelancer a organizar e melhorar a clareza da proposta, sem inventar experiências, resultados ou informações que não estejam no perfil.",
  },
];

const howItWorks = [
  {
    number: "01",
    title: "Conte o que você precisa",
    description: "Publique um projeto ou busque um serviço pronto para contratar.",
  },
  {
    number: "02",
    title: "Compare com clareza",
    description: "Veja perfil, avaliações, portfólio, prazo e valor antes de decidir.",
  },
  {
    number: "03",
    title: "Feche com segurança",
    description: "Combine os detalhes diretamente e acompanhe a entrega do projeto.",
  },
];

const positioningPillars = [
  {
    title: "Feito para contratar no Brasil",
    description: "Categorias, linguagem e jornada pensadas para quem quer resolver trabalho real no contexto brasileiro.",
    icon: Target,
  },
  {
    title: "Mais sinal antes da conversa",
    description: "Perfil, portfólio, avaliações e proposta mais claros para a decisão não depender só de promessa.",
    icon: ShieldCheck,
  },
  {
    title: "Ferramentas para quem contrata e para quem vende",
    description: "Certo Calc, Certo AI e recursos de briefing ajudam os dois lados a chegar melhor preparados.",
    icon: Gauge,
  },
  {
    title: "Pensado para recorrência",
    description: "A ideia não é só fechar um projeto, mas facilitar novos trabalhos com menos atrito depois do primeiro acerto.",
    icon: Repeat2,
  },
];

const hiringGuides = [
  {
    title: "Desenvolvimento e tecnologia",
    description: "Veja o que pedir, como comparar portfólio e onde usar benchmark antes de contratar.",
    href: "/mercado",
  },
  {
    title: "Design e criação",
    description: "Organize o briefing visual, referências e entregáveis para receber propostas melhores.",
    href: "/register",
  },
  {
    title: "Marketing e conteúdo",
    description: "Descubra como alinhar canal, meta, verba e prazo antes de começar a busca.",
    href: "/services",
  },
];

export default async function Home() {
  const profile = await getProfile();
  const canPublishProjects = profile?.role === "client" || profile?.role === "both";
  const canSeeProviderTools = !canPublishProjects;
  return (
    <>
      <StructuredData type="WebPage" data={{ name: "PrestaCerto — marketplace de serviços", url: "https://prestacerto.com.br/", description: "Marketplace brasileiro para contratar freelancers e prestadores de serviços." }} />
      <StructuredData type="FAQPage" data={getFAQSchema(homeFaqs)} />
      <div className="min-h-screen bg-[#f8f6f1] text-slate-950 dark:bg-[#050914] dark:text-white">
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-[#f8f6f1] dark:border-white/10 dark:bg-[#050914]">
        <div className="absolute left-1/2 top-12 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute right-0 top-16 h-[30rem] w-[30rem] rounded-full bg-white/70 blur-3xl dark:bg-white/5" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10 lg:pb-20 lg:pt-10">
          <div className="relative z-10">
            <h1 className="max-w-3xl text-[4rem] font-black leading-[0.88] tracking-[-0.07em] text-[#05092b] sm:text-[5rem] lg:text-[6.5rem] dark:text-white">
              Contrate em 24h.
              <br />
              <span className="text-blue-600 dark:text-blue-400">Freelancers testados.</span>
              <br />
              <span className="text-blue-600 dark:text-blue-400">Sem demora.</span>
            </h1>
            <p className="mt-10 max-w-[42rem] text-[1.02rem] leading-8 text-slate-600 dark:text-slate-300 sm:text-[1.07rem]">
              12k+ profissionais verificados. R$ 2M em volume de contratos. Encontre o melhor freelancer com segurança, clareza e ferramentas inteligentes para contratar no Brasil.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href={canPublishProjects ? "/dashboard/projects/new" : "/register?role=client"}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Começar 14 dias grátis
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:border-blue-300 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-blue-400/60 dark:hover:bg-white/10"
              >
                Explorar prestadores
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                Marketplace pensado para o Brasil
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                Avaliações reais e negociação transparente
              </span>
            </div>
          </div>

          <div className="relative z-10 pb-3 lg:pl-2 lg:pb-8">
            <div
              className="absolute inset-x-2 top-10 h-[84%] rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),rgba(238,244,255,0.92)_52%,rgba(255,255,255,0.4)_100%)] blur-3xl sm:inset-x-6 lg:-left-4 lg:right-2 lg:top-10 lg:h-[86%]"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[2.7rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(246,248,252,0.96)_100%)] p-1 shadow-[0_30px_100px_rgba(15,23,42,0.08)] sm:p-2">
              <div className="relative h-[380px] overflow-hidden rounded-[2.3rem] bg-[radial-gradient(circle_at_center,#ffffff_0%,#f1f5ff_58%,#edf2ff_100%)] sm:h-[455px] lg:h-[560px]">
                <Image
                  src="/images/banner-discovery.png"
                  alt="Profissional em destaque no PrestaCerto"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950">Brasil</p>
            <p className="mt-1 text-sm text-slate-500">linguagem, categorias e jornada de contratação mais próximas da rotina local</p>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950">Compare</p>
            <p className="mt-1 text-sm text-slate-500">perfil, portfólio, prazo, avaliações e preço antes de decidir</p>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950">Certo Suite</p>
            <p className="mt-1 text-sm text-slate-500">calculadora, apoio de proposta e recursos para decidir com mais clareza</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-blue-50 dark:bg-blue-950/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">PrestaCerto em números</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Comunidade verificada e segura de freelancers e clientes que já transformaram seus projetos.</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-black text-blue-600 dark:text-blue-400">12k+</p>
              <p className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Profissionais verificados</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Testados e prontos para trabalhar</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-blue-600 dark:text-blue-400">R$ 2M+</p>
              <p className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Volume em contratos</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Projetos realizados com confiança</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-blue-600 dark:text-blue-400">24h</p>
              <p className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Tempo médio de resposta</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Suas propostas recebem retorno rápido</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Histórias reais</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Quem já confía no PrestaCerto</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Veja como empresas e profissionais estão transformando seus projetos.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Startup Tech",
                role: "Desenvolveu MVP em 2 semanas",
                quote: "Encontramos developers sênior no PrestaCerto e saímos do zero pro ar em 14 dias. Exatamente o que precisávamos.",
                avatar: "🚀"
              },
              {
                name: "E-commerce Brasil",
                role: "Crescimento de 300% em vendas",
                quote: "A qualidade dos designers no marketplace nos ajudou a aumentar conversão. Resultado: 3x de crescimento em 6 meses.",
                avatar: "📈"
              },
              {
                name: "Consultoria",
                role: "Equipe remota em 1 mês",
                quote: "Contratamos consultores com expertise específica. Transparência de preço e qualidade é incomparável.",
                avatar: "💼"
              }
            ].map((story, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <p className="text-2xl">{story.avatar}</p>
                <p className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">{story.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{story.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#fcfbf8] dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Por que testar essa tese</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Uma experiência global, adaptada para contratar no Brasil.</h2>
            <p className="mt-3 text-slate-600">Em vez de competir só por preço, o PrestaCerto pode ganhar em contexto, clareza e ferramentas práticas para o mercado brasileiro.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {positioningPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Encontre sua área</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">O que você precisa resolver?</h2>
            <p className="mt-3 text-slate-500">Escolha uma categoria para começar a encontrar o serviço certo.</p>
          </div>
          <Link href="/services" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-blue-600">
            Ver todas as áreas <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                href="/services"
                key={category.title}
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <span className={`flex size-10 items-center justify-center rounded-xl ${category.tone}`}>
                  <Icon className="size-5" />
                </span>
                <span className="mt-4 block text-sm font-bold text-slate-900">{category.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{category.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-blue-100 bg-[#f4f7ff]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Contratação sem ruído</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Descubra o que realmente importa.</h2>
              <p className="mt-3 text-slate-500">Mais contexto para comparar, menos pressão para fechar correndo.</p>
            </div>
            <Link href="/services" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-blue-600">
              Buscar profissionais <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {decisionPoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.number} className="group relative min-h-[244px] overflow-hidden rounded-3xl border border-blue-100 bg-[#eef5ff] p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10 sm:p-7">
                  <div className="absolute -right-8 -top-8 size-32 rounded-full bg-blue-200/40 transition group-hover:scale-110" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-black tracking-[0.16em] text-blue-700">{point.number}</span>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      <Icon className="size-6" strokeWidth={2.2} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="relative mt-9">
                    <h3 className="text-xl font-black tracking-tight text-slate-950">{point.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{point.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#eadfce] bg-[#fff8ef]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Seu ponto de partida</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Chegue como você está. A gente ajuda a organizar o próximo passo.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-600">Se você ainda está entendendo o que precisa, tudo bem. Comece pelo caminho que fizer mais sentido agora — sem pressão para decidir tudo de uma vez.</p>
            </div>
            <div className="relative mx-auto hidden h-[265px] w-full max-w-[375px] lg:block">
              <Image
                src="/images/hero-human-connection.png"
                alt="Profissional usando notebook para organizar o próximo passo"
                fill
                sizes="375px"
                className="object-contain object-center"
              />
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Link href="/services" className="group rounded-2xl border border-[#eadfce] bg-white/80 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-amber-950/5">
              <p className="text-sm font-bold text-slate-950">Preciso de alguém</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Explore áreas e veja profissionais para o que você quer resolver.</p>
              <span className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">Encontrar um profissional <ArrowRight className="ml-1.5 size-3.5 transition group-hover:translate-x-0.5" /></span>
            </Link>
            <Link href="/register" className="group rounded-2xl border border-[#eadfce] bg-white/80 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-amber-950/5">
              <p className="text-sm font-bold text-slate-950">Tenho um projeto</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Conte o que precisa e deixe as informações prontas para comparar propostas.</p>
              <span className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">Publicar um projeto <ArrowRight className="ml-1.5 size-3.5 transition group-hover:translate-x-0.5" /></span>
            </Link>
            <Link href="/ferramentas/calculadora" className="group rounded-2xl border border-[#eadfce] bg-white/80 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-amber-950/5">
              <p className="text-sm font-bold text-slate-950">Quero cobrar com clareza</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Faça uma estimativa do seu valor antes de montar a próxima proposta.</p>
              <span className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">Abrir calculadora <ArrowRight className="ml-1.5 size-3.5 transition group-hover:translate-x-0.5" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Certo Calc em destaque</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A calculadora não é extra. Ela é porta de entrada.</h2>
              <p className="mt-3 leading-7 text-slate-600">Para muita gente, o primeiro passo não é contratar — é descobrir quanto cobrar, quanto investir ou como organizar o próximo orçamento.</p>
            </div>
            <Link href="/ferramentas/calculadora" className="inline-flex items-center text-sm font-bold text-slate-950 hover:text-blue-600">
              Ver calculadora completa <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      <HomePriceCalculator />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Para quem contrata</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Do briefing à entrega sem complicação.</h2>
          <p className="mt-4 max-w-lg leading-7 text-slate-600">Você escolhe o profissional pelo trabalho e pela reputação — não pelo maior lance. A plataforma deixa as informações organizadas para a decisão ficar mais simples.</p>
          <Link href="/register" className="mt-6 inline-flex items-center font-bold text-slate-950 hover:text-blue-600">
            Publicar um projeto <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {howItWorks.map((step) => (
            <div key={step.number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-black tracking-[0.16em] text-blue-600">{step.number}</span>
              <h3 className="mt-8 text-base font-bold text-slate-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><LockKeyhole className="size-3.5" /> Mais clareza do aceite à entrega</div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Acordos bem definidos protegem os dois lados.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">Projetos maiores pedem escopo, etapas e confirmação de entrega claros. O PrestaCerto está estruturado para apoiar esse fluxo, com pagamento processado por parceiros habilitados.</p>
            <Link href="/como-funciona" className="mt-6 inline-flex items-center font-bold text-slate-950 hover:text-blue-600">Entender como a contratação funciona <ArrowRight className="ml-2 size-4" /></Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Fluxo de contratação</p>
            <div className="mt-5 space-y-3">
              {["Escopo e valor alinhados", "Etapas registradas para acompanhar a entrega", "Confirmação antes da liberação, quando o pagamento protegido estiver disponível"].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">0{index + 1}</span>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">A disponibilidade de pagamento protegido depende da integração de pagamento e das condições aplicáveis ao projeto.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
              <Sparkles className="size-3.5" /> Certo AI para freelancers
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Certo AI não fica escondido. Ele ajuda a proposta a nascer melhor.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">Escreva do seu jeito, melhore clareza e estrutura antes de enviar e use a IA como apoio prático para vender melhor o que você já sabe fazer.</p>
          </div>
          <Link href="/certo-ai" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500">
            Conhecer o Certo AI <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Guias de contratação por skill</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Contratar melhor começa com um briefing melhor.</h2>
              <p className="mt-3 text-slate-600">Teste um formato mais específico por área: o que pedir, o que comparar e para onde olhar antes de fechar.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {hiringGuides.map((guide) => (
              <Link key={guide.title} href={guide.href} className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5">
                <p className="text-lg font-black tracking-tight text-slate-950">{guide.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-blue-700">Abrir caminho <ArrowRight className="ml-1.5 size-3.5 transition group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {!canSeeProviderTools && <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Transparência de Preço</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Sem surpresas. Sem taxas escondidas.</h2>
            <p className="mt-3 max-w-2xl mx-auto text-slate-600">Publique seus projetos e receba propostas. Você só paga quando ativa um freelancer — sem taxa de publicação, sem taxa de visualização.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Taxa de Plataforma</p>
              <p className="mt-4 text-4xl font-black text-slate-950">8%</p>
              <p className="mt-2 text-sm text-slate-600">Cobrado apenas quando você ativa um contrato com freelancer</p>
              <p className="mt-6 text-sm font-semibold text-slate-950">O que está incluído:</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />Proteção de pagamento em escrow</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />Mediação de conflitos</li>
                <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />Histórico de transações</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Exemplo de Custo</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor do contrato:</span>
                  <span className="font-semibold text-slate-950">R$ 1.000</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-slate-600">Taxa PrestaCerto (8%):</span>
                  <span className="font-semibold text-red-600">-R$ 80</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="font-bold text-slate-950">Você paga ao freelancer:</span>
                  <span className="font-black text-emerald-600">R$ 920</span>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500">* A protecão de pagamento é feita em escrow. Você libera o valor conforme o trabalho avança.</p>
            </div>
          </div>
        </div>
      </section>}

      {canSeeProviderTools && <section className="border-t border-blue-100 bg-[#f4f8ff]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Planos para prestadores</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Preço claro, sem comissão por projeto.</h2></div>
            <Link href="/plans" className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800">Comparar planos <ArrowRight className="ml-2 size-4" /></Link>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <article key={plan.id} className={`relative flex min-h-[390px] flex-col rounded-2xl border p-5 ${plan.popular ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/25" : "border-blue-100 bg-white text-slate-950"}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-slate-950 shadow-sm"><Crown className="size-3.5" /> Mais escolhido</span>}
                <p className={`text-sm font-bold ${plan.popular ? "text-blue-100" : "text-slate-500"}`}>{plan.name}</p>
                <p className="mt-2 text-3xl font-black">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(plan.priceMonthly)}<span className={`ml-1 text-sm font-semibold ${plan.popular ? "text-blue-100" : "text-slate-500"}`}>/mês</span></p>
                <p className={`mt-3 text-sm leading-6 ${plan.popular ? "text-blue-100" : "text-slate-600"}`}>{plan.id === "free" ? "Inclui até 3 propostas por mês." : plan.description}</p>
                <ul className={`mt-4 space-y-2 text-sm ${plan.popular ? "text-white" : "text-slate-700"}`}>
                  {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className={`mt-0.5 size-4 shrink-0 ${plan.popular ? "text-blue-100" : "text-emerald-600"}`} />{feature}</li>)}
                </ul>
                <Link href={`/register?plan=${plan.id}`} className={`mt-auto inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${plan.popular ? "bg-white text-blue-700 hover:bg-blue-50" : "bg-slate-950 text-white hover:bg-slate-800"}`}>
                  {plan.id === "pro" ? "Quero o Pro" : plan.id === "free" ? "Começar grátis" : "Quero o Business"}<ArrowRight className="ml-2 size-4" />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">As assinaturas estão em configuração. Enquanto isso, você pode comparar os planos e registrar interesse sem nenhuma cobrança.</p>
        </div>
      </section>}

      <section className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1428]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Perguntas frequentes</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Tudo claro antes de começar.</h2>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {homeFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-slate-950 marker:hidden dark:text-white">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Programa de Indicação</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Ganhe até 30% de comissão indicando clientes</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">Cada cliente que você indica e ativa gera créditos recorrentes na sua conta. Transparência total: veja quanto ganha em tempo real, receba mensalmente e sem limites de ganho.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-blue-600">30%</p>
              <p className="mt-2 font-semibold text-slate-950">Comissão por indicação</p>
              <p className="mt-1 text-sm text-slate-500">Do plano mensais que seus clientes ativam</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-blue-600">12 meses</p>
              <p className="mt-2 font-semibold text-slate-950">Recorrência garantida</p>
              <p className="mt-1 text-sm text-slate-500">Ganhe enquanto seus clientes usam</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-blue-600">Ilimitado</p>
              <p className="mt-2 font-semibold text-slate-950">Sem teto de ganhos</p>
              <p className="mt-1 text-sm text-slate-500">Indique quantos quiser, ganhe quantos conseguir</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login?next=/dashboard/referral" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Ativar Programa de Indicação <ArrowRight className="ml-2 size-4" /></Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl border border-blue-300 bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Criar conta para indicar</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
              <Users2 className="size-3.5" /> Comunidade em preparação
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Mercado bom também se constrói fora da transação.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">A comunidade pode virar um diferencial de volta diária: troca de casos, dicas práticas, networking e acesso antecipado a oportunidades. Já dá para captar interesse sem prometer um Discord pronto hoje.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Cases reais", "Espaço para compartilhar aprendizados, preço, proposta e bastidores."],
              ["Projetos premium", "Sinalizar oportunidades mais maduras e recorrentes."],
              ["Mentoria entre pares", "Top freelancers ajudam quem ainda está ganhando tração."],
              ["Networking útil", "Menos ruído, mais conexão entre quem contrata e quem executa."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
            <Link href="/community" className="sm:col-span-2 inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Entrar na lista da comunidade <MessagesSquare className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">O próximo projeto começa aqui.</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">Encontre a pessoa certa, publique seu projeto ou mostre o que você sabe fazer.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Criar conta grátis</Link>
            <Link href="/projects" className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Ver projetos abertos</Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

