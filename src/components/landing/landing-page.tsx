import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  FileText,
  Handshake,
  Layers3,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wallet,
  MousePointer2,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import type { Category } from "@/lib/supabase/types";
import { siteUrl } from "@/lib/seo/metadata";
import { StructuredData, getBreadcrumbSchema, getFAQSchema } from "@/components/structured-data";
import { LandingLeadForm } from "@/components/landing/landing-lead-form";
import { LandingPageTracking } from "@/components/landing/landing-page-tracking";

type Journey = "client" | "provider";

const content = {
  client: {
    path: "/para-clientes",
    label: "Para quem precisa contratar",
    title: "Seu projeto merece",
    titleAccent: "quem sabe fazer.",
    slogan: "Publique seu projeto. Encontre quem sabe fazer.",
    introduction: "Publique grátis o que você precisa. Compare as propostas que receber, converse sobre a entrega e escolha com quem trabalhar.",
    cta: "Começar meu projeto grátis",
    formTitle: "Conte sobre seu projeto",
    formDescription: "Seu contato e o que você precisa, em duas etapas. Depois, crie sua conta gratuita e revise o projeto antes de publicar.",
    switchLabel: "Você presta serviços?",
    switchCta: "Conheça a página para prestadores",
    switchPath: "/para-prestadores",
    heroPoints: ["Publique gratuitamente", "Compare antes de escolher", "Negocie diretamente"],
    stepsTitle: "Do pedido ao profissional. Sem complicar.",
    steps: [
      { icon: FileText, title: "Publique seu projeto", text: "Descreva o serviço, o resultado esperado, o orçamento e a região de atendimento. Revise as informações antes de publicar." },
      { icon: SearchCheck, title: "Converse com profissionais", text: "Prestadores interessados podem enviar propostas. Compare os perfis, tire dúvidas e entenda o que está incluído em cada oferta." },
      { icon: Handshake, title: "Compare e combine", text: "Avalie as propostas recebidas e combine escopo, preço, prazo e pagamento diretamente com o profissional." },
    ],
    benefitEyebrow: "Menos procura. Mais clareza.",
    benefitTitle: "Escolha com informação. Contrate com confiança na sua decisão.",
    benefitDescription: "Você não precisa decidir só pelo preço. Entenda o que cada profissional oferece e encontre a proposta que combina com o que você precisa.",
    benefits: [
      { icon: FileText, title: "Compare escopo, prazo e preço.", text: "Descreva a entrega em um projeto. Compare as propostas recebidas e tire dúvidas na conversa antes de escolher." },
      { icon: UserRound, title: "Conheça quem está do outro lado.", text: "Veja a apresentação e a experiência do profissional para entender como ele pode ajudar no seu projeto." },
      { icon: Handshake, title: "Seu projeto. Sua escolha.", text: "Converse sobre entregas, preço e prazo antes de decidir. Você escolhe com quem seguir e combina as condições." },
    ],
    categoriesTitle: "Qual serviço você está procurando?",
    categoriesDescription: "Explore as categorias cadastradas na plataforma ou descreva sua necessidade no formulário.",
    listingPath: "/services",
    listingLabel: "Explorar serviços publicados",
    transparencyTitle: "Combine os detalhes antes de contratar.",
    transparency: "Confirme o escopo, as entregas, o valor e o prazo com o profissional. O pagamento pelo serviço é combinado diretamente entre vocês. Uma conversa clara ajuda a alinhar as expectativas desde o início.",
    finalTitle: "Vamos começar pelo que você precisa?",
    finalDescription: "Descreva seu projeto e dê o primeiro passo para encontrar quem pode ajudar.",
    faqs: [
      { question: "Quanto custa publicar um projeto?", answer: "A publicação de projetos é gratuita. O valor do serviço, o prazo e a forma de pagamento são combinados diretamente com o profissional escolhido." },
      { question: "Posso contratar um serviço remoto?", answer: "Sim. Informe se o serviço pode ser feito remotamente ou se exige atendimento presencial. Combine a modalidade de atendimento e as entregas com o profissional." },
      { question: "Preciso informar minha cidade?", answer: "Informe a cidade ou o local de atendimento para serviços presenciais. Se o trabalho puder ser feito à distância, indique que o atendimento é remoto." },
      { question: "O PrestaCerto escolhe o profissional por mim?", answer: "Você decide quem contratar. Use as informações dos perfis e das propostas para comparar opções e confirme as condições com o profissional antes de iniciar o trabalho." },
      { question: "Como funciona o pagamento pelo serviço?", answer: "Cliente e profissional combinam o pagamento diretamente entre si. Confirme valor, forma de pagamento, prazo e entregas antes de começar o trabalho." },
      { question: "Por que 0% de taxa?", answer: "O PrestaCerto não cobra comissão sobre o valor combinado entre cliente e profissional. A publicação é gratuita, e você combina o serviço, o preço, o prazo e a forma de pagamento diretamente com quem escolher." },
    ],
  },
  provider: {
    path: "/para-prestadores",
    label: "Para quem faz acontecer",
    title: "Você sabe fazer.",
    titleAccent: "Mostre para quem precisa.",
    slogan: "Seu próximo projeto pode começar aqui",
    introduction: "Mostre seu trabalho em um perfil, encontre projetos por categoria e envie propostas. Comece no plano Grátis e negocie escopo, prazo e preço diretamente com o cliente.",
    cta: "Apresentar meu serviço",
    formTitle: "Apresente seu trabalho",
    formDescription: "Seu contato e o serviço que oferece, em duas etapas. Depois, crie sua conta gratuita e complete seu perfil.",
    switchLabel: "Você precisa contratar?",
    switchCta: "Conheça a página para clientes",
    switchPath: "/para-clientes",
    heroPoints: ["Comece no plano Grátis", "Encontre projetos da sua área", "Negocie suas condições"],
    stepsTitle: "Seu talento é o começo. O próximo passo é se apresentar.",
    steps: [
      { icon: UserRound, title: "Apresente seu serviço", text: "Conte o que você faz, onde atende e quais necessidades pode resolver. Uma descrição específica facilita a conversa com os clientes." },
      { icon: Layers3, title: "Monte seu perfil", text: "Conte sua experiência, suas habilidades e a região em que atende. Ajude o cliente a entender o que você faz." },
      { icon: BriefcaseBusiness, title: "Explore e apresente propostas", text: "Consulte projetos publicados, escolha os que fazem sentido e envie propostas dentro dos limites do seu plano." },
    ],
    benefitEyebrow: "Seu trabalho merece ser visto",
    benefitTitle: "Mais do que um contato. Mostre o valor do que você faz.",
    benefitDescription: "Apresente sua experiência, descubra necessidades da sua área e chegue à conversa com uma proposta bem preparada.",
    benefits: [
      { icon: SearchCheck, title: "Veja o pedido antes de propor.", text: "Filtre projetos por categoria e conheça o pedido e o orçamento antes de preparar sua proposta." },
      { icon: UserRound, title: "Apresente sua experiência.", text: "Reúna sua apresentação, experiência e cidade em um perfil que ajude o cliente a conhecer o seu trabalho." },
      { icon: FileText, title: "Prepare preço e proposta.", text: "Use a calculadora de preços e o gerador de propostas para organizar valor, prazo e entregas." },
    ],
    categoriesTitle: "Seu trabalho começa pela sua especialidade.",
    categoriesDescription: "Conheça as categorias cadastradas na plataforma. No formulário, indique a que melhor representa o serviço que você oferece.",
    listingPath: "/projects",
    listingLabel: "Explorar projetos publicados",
    transparencyTitle: "Você define como quer trabalhar.",
    transparency: "Escolha os projetos que fazem sentido para você e combine suas condições diretamente com o cliente. A plataforma oferece um plano Grátis e planos pagos opcionais, com recursos e limites próprios.",
    finalTitle: "Vamos conhecer o que você faz?",
    finalDescription: "Apresente o que você oferece e prepare-se para conversar com novos clientes.",
    faqs: [
      { question: "Posso trabalhar remotamente?", answer: "Sim. Apresente os serviços que pode realizar à distância e informe que atende remotamente. A modalidade de atendimento, as entregas e os prazos são combinados com cada cliente." },
      { question: "Preciso estar em uma cidade específica?", answer: "Não. Informe sua cidade e a região em que atende presencialmente, ou indique atendimento remoto. A disponibilidade de projetos pode variar conforme a área e a região." },
      { question: "Posso oferecer mais de um serviço?", answer: "Sim. Apresente suas diferentes especialidades e deixe claro o que está incluído em cada serviço. Isso ajuda o cliente a entender quando pode contar com você." },
      { question: "Preciso de CNPJ para me cadastrar?", answer: "O cadastro no PrestaCerto não exige CNPJ. Você pode começar com seu nome, e-mail e senha e completar seu perfil profissional." },
      { question: "Preciso pagar para começar?", answer: "A plataforma oferece um plano Grátis e planos Pro e Business opcionais. Consulte a página de planos para comparar os recursos e limites antes de escolher." },
      { question: "O cadastro garante projetos ou contratações?", answer: "Não. As oportunidades dependem dos projetos publicados, da sua área de atuação e das escolhas dos clientes. Um perfil claro e propostas bem preparadas ajudam a apresentar seu trabalho, mas não garantem contratação." },
      { question: "Como combino o valor e recebo pelo trabalho?", answer: "Você e o cliente combinam diretamente o escopo, o preço, o prazo e a forma de pagamento. Confirme essas condições antes de começar o serviço." },
    ],
  },
} as const;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const primaryCta = `inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_8px_22px_-10px_rgba(37,99,235,0.65)] transition hover:bg-blue-700 sm:text-base ${focus}`;
const clientPrimaryCta = `inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-orange-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_8px_22px_-10px_rgba(234,88,12,0.55)] transition hover:bg-orange-700 sm:text-base ${focus}`;
const eyebrow = "text-xs font-bold uppercase leading-5 tracking-[0.16em] text-blue-700";

function HeroVisual({ client }: { client: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-xl pt-5 lg:pt-0" aria-hidden="true">
      <div className="absolute inset-x-[10%] bottom-[7%] top-[3%] rounded-[48%_48%_30%_30%] bg-[#e3ebff]" />
      <div className="absolute right-[7%] top-[8%] size-20 rounded-full border border-blue-300/70 sm:size-28" />
      <div className="relative aspect-[1.12] overflow-hidden">
        <Image
          src={`/images/marketing/v1/prestacerto-${client ? "principal" : "profissionais"}-960.avif`}
          alt=""
          width={960}
          height={540}
          fetchPriority="high"
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </div>
      <div className="absolute -left-1 bottom-[10%] flex max-w-[75%] items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-[0_12px_40px_-12px_rgba(24,45,97,0.25)] sm:left-0 sm:p-4 lg:-left-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{client ? <SlidersHorizontal className="size-5" /> : <BriefcaseBusiness className="size-5" />}</span>
        <div><p className="text-[11px] font-medium text-slate-500">{client ? "Mais clareza para decidir" : "Novas possibilidades"}</p><p className="mt-1 text-sm font-bold text-slate-900">{client ? "Compare. Converse. Escolha." : "Seu trabalho, novos projetos."}</p></div>
      </div>
      <div className="absolute right-0 top-[9%] flex items-center gap-2 rounded-full border border-white bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 shadow-[0_8px_30px_-12px_rgba(24,45,97,0.25)] sm:right-1 sm:px-4">
        <span className="flex size-6 items-center justify-center rounded-full bg-[#eaf3cc] text-[#496117]"><Check className="size-3.5" /></span>
        {client ? "Você no controle" : "Seu talento em destaque"}
      </div>
    </div>
  );
}

export function LandingPage({ journey, categories }: { journey: Journey; categories: Category[] }) {
  const page = content[journey];
  const client = journey === "client";
  const audience = client ? "Para clientes" : "Para prestadores";

  return (
    <div id={`landing-${journey}`} className="bg-white text-slate-950">
      <LandingPageTracking journey={journey} />
      <StructuredData type="WebPage" data={{ name: `${page.title} ${page.titleAccent}`, description: page.introduction, url: `${siteUrl}${page.path}`, inLanguage: "pt-BR" }} />
      <StructuredData type="FAQPage" data={getFAQSchema([...page.faqs])} />
      <StructuredData type="BreadcrumbList" data={getBreadcrumbSchema([{ name: "Início", url: siteUrl }, { name: audience, url: `${siteUrl}${page.path}` }])} />

      <section className="overflow-hidden bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-5 pb-9 pt-6 sm:px-8 sm:pb-14 lg:pt-7">
          <nav aria-label="Você está em" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className={`rounded-sm hover:text-blue-700 ${focus}`}>Início</Link><span aria-hidden="true">/</span><span>{audience}</span>
          </nav>
          <div className="grid items-center gap-5 pt-8 sm:pt-10 md:grid-cols-[1.06fr_1fr] md:gap-6 lg:gap-8 lg:pt-9">
            <div className="relative z-10 min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><span className="size-1.5 rounded-full bg-blue-600" />{page.label}</p>
              <h1 className="mt-5 max-w-2xl text-[2.65rem] font-bold leading-[1.05] tracking-[-0.052em] sm:text-[3.5rem] md:text-[2.75rem] lg:text-[3.5rem] xl:text-[4.1rem]">
                {page.title}<span className="text-blue-600">{`\u00a0${page.titleAccent}`}</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{page.introduction}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"><a href="#seu-proximo-passo" data-landing-event="cta" className={`w-full sm:w-auto ${client ? clientPrimaryCta : primaryCta}`}>{client ? 'Publicar projeto GRÁTIS' : page.cta}<ArrowRight className="size-5 shrink-0" aria-hidden="true" /></a><a href="#landing-steps-title" className={`inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-blue-700 ${focus}`}>Ver como funciona</a></div>
              <p className="mt-3 flex items-center gap-2 text-xs leading-5 text-slate-600"><ShieldCheck className="size-4 shrink-0 text-slate-500" aria-hidden="true" />{client ? "Publicar é grátis. Você decide se quer contratar." : "Plano Grátis disponível. Comece no seu ritmo."}</p>
              <p className="mt-6 text-xs leading-6 text-slate-500">{page.switchLabel}{" "}<Link href={page.switchPath} data-landing-event="journey_switch" className={`rounded-sm font-semibold text-slate-700 underline underline-offset-4 hover:text-blue-700 ${focus}`}>{client ? "Ofereça seu serviço" : "Publique seu projeto"}</Link></p>
            </div>
            <HeroVisual client={client} />
          </div>
          <ul className="mt-9 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3 sm:gap-6 lg:mt-10">
            {page.heroPoints.map(point => <li key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-700"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white"><Check className="size-4 text-blue-600" aria-hidden="true" /></span>{point}</li>)}
          </ul>
        </div>
      </section>

      <section aria-labelledby="landing-benefits-title" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <div><p className={eyebrow}>{page.benefitEyebrow}</p><h2 id="landing-benefits-title" className="mt-3 max-w-2xl text-3xl font-bold leading-[1.15] tracking-[-0.035em] sm:text-[2.65rem]">{page.benefitTitle}</h2></div>
          <p className="max-w-lg text-base leading-7 text-slate-600">{page.benefitDescription}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:mt-11 md:grid-cols-3 md:gap-5">
          {page.benefits.map((benefit, index) => <article key={benefit.title} className={`rounded-3xl p-7 sm:p-8 ${index === 0 ? "bg-[#edf3ff]" : index === 1 ? "bg-[#f6f5f0]" : "bg-[#f1f5e9]"}`}><span className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-700"><benefit.icon className="size-6" aria-hidden="true" /></span><h3 className="mt-7 max-w-xs text-[1.3rem] font-bold leading-7 tracking-tight">{benefit.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{benefit.text}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="landing-steps-title" className="bg-[#12264d] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Como funciona</p><h2 id="landing-steps-title" tabIndex={-1} className="scroll-mt-24 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-[2.65rem]">{page.stepsTitle}</h2></div>
            <a href="#seu-proximo-passo" data-landing-event="cta" className="inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm font-semibold text-white underline decoration-blue-300 underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:shrink-0">Começar agora<ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {page.steps.map((step, index) => <li key={step.title} className="border-t border-white/20 pt-6"><span className="flex size-10 items-center justify-center rounded-full bg-[#d9ed9a] text-sm font-bold text-[#213713]">0{index + 1}</span><h3 className="mt-5 text-xl font-bold tracking-tight">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section aria-labelledby="landing-conversion-title" className="bg-[#f4f7fd]">
        <div className="mx-auto grid max-w-6xl items-center gap-9 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
          <div>
            <p className={eyebrow}>{client ? "Tire a ideia do papel" : "Dê o próximo passo"}</p>
            <h2 id="landing-conversion-title" className="mt-4 max-w-lg text-3xl font-bold leading-[1.12] tracking-[-0.04em] sm:text-[2.8rem]">{client ? <>O próximo passo do seu projeto <span className="text-blue-600">começa aqui.</span></> : <>Seu trabalho tem valor. <span className="text-blue-600">Vamos apresentá-lo?</span></>}</h2>
            <p className="mt-5 max-w-md leading-7 text-slate-600">{client ? "Comece contando o que precisa. Vamos guardar seus dados para você continuar o cadastro e preparar seu projeto." : "Comece com seu contato e sua especialidade. Depois, complete seu perfil e explore projetos para apresentar suas propostas."}</p>
            <ul className="mt-7 space-y-5">
              {(client ? [
                { icon: Wallet, title: "Sem custo para publicar", text: "O valor do serviço é combinado com o profissional." },
                { icon: MousePointer2, title: "Você revisa antes de publicar", text: "Este formulário registra seu interesse. O projeto vem depois." },
              ] : [
                { icon: Wallet, title: "Comece pelo plano Grátis", text: "Conheça a plataforma antes de escolher um plano pago." },
                { icon: UserRound, title: "Seu perfil, do seu jeito", text: "Complete sua apresentação na próxima etapa." },
              ]).map(item => <li key={item.title} className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600"><item.icon className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 max-w-sm text-sm leading-6 text-slate-600">{item.text}</p></div></li>)}
            </ul>
          </div>
          <div id="seu-proximo-passo" tabIndex={-1} className="min-w-0 scroll-mt-24 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_-35px_rgba(32,60,115,0.3)] sm:p-8">
            <h2 id="landing-form-title" className="text-2xl font-bold tracking-tight">{page.formTitle}</h2>
            <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">{page.formDescription}</p>
            <LandingLeadForm journey={journey} categories={categories} />
          </div>
        </div>
      </section>

      {categories.length > 0 && <section aria-labelledby="landing-categories-title" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className={eyebrow}>{client ? "O que você precisa fazer?" : "Encontre sua área"}</p><h2 id="landing-categories-title" className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-[-0.035em]">{page.categoriesTitle}</h2></div><p className="max-w-sm text-sm leading-7 text-slate-600">{client ? "De uma identidade visual ao desenvolvimento de um site. Comece pela categoria do seu projeto." : "Design, tecnologia, conteúdo e outras especialidades. Explore os projetos na sua categoria."}</p></div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.slice(0, 9).map(category => <li key={category.id}><Link href={`${page.listingPath}?categoria=${encodeURIComponent(category.slug)}`} className={`flex min-h-16 h-full items-center justify-between gap-3 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 ${focus}`}>{category.name}<ArrowUpRight className="size-4 shrink-0 text-blue-600" aria-hidden="true" /></Link></li>)}</ul>
      </section>}

      {!client && <section aria-labelledby="landing-provider-tips-title" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="grid gap-8 rounded-3xl bg-[#f6f5f0] p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div><Sparkles className="size-7 text-blue-600" aria-hidden="true" /><p className={`mt-5 ${eyebrow}`}>Para freelancers, autônomos e pequenos negócios</p><h2 id="landing-provider-tips-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight">Ajude o cliente a entender por que escolher você.</h2><p className="mt-4 text-sm leading-7 text-slate-600">Uma apresentação clara pode dizer mais do que uma lista de habilidades. Mostre o que resolve e como trabalha.</p></div>
          <ul className="space-y-5">{[
            { title: "Conte o que você entrega", text: "Explique seus serviços, sua experiência e a região em que atende." },
            { title: "Mostre exemplos reais", text: "Apresente seu portfólio ao conversar com o cliente e explique sua participação em cada trabalho." },
            { title: "Prepare cada proposta com cuidado", text: "Leia o projeto, alinhe escopo e prazo e mantenha sua disponibilidade atualizada." },
          ].map(item => <li key={item.title} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-blue-600" aria-hidden="true" /><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm leading-7 text-slate-600">{item.text}</p></div></li>)}</ul>
        </div>
      </section>}

      <section aria-labelledby="landing-faq-title" className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div><p className={eyebrow}>Tudo às claras</p><h2 id="landing-faq-title" className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Antes de começar.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">{page.transparency}</p><p className="mt-5 text-sm text-slate-600">Veja nossa <Link href="/privacidade" className={`rounded-sm font-medium text-blue-700 underline underline-offset-4 ${focus}`}>política de privacidade</Link>{!client && <> e os <Link href="/plans" className={`rounded-sm font-medium text-blue-700 underline underline-offset-4 ${focus}`}>planos disponíveis</Link></>}.</p></div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">{page.faqs.map(faq => <details key={faq.question} className="group"><summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 text-sm font-semibold sm:text-base [&::-webkit-details-marker]:hidden ${focus}`}><span>{faq.question}</span><ChevronDown className="size-4 shrink-0 text-blue-600 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-6 pr-5 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}</div>
      </section>

      <section aria-labelledby="landing-next-title" className="bg-blue-600 px-5 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><h2 id="landing-next-title" className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-4xl">{client ? "A ideia é sua. Encontre quem ajuda a realizar." : "Seu próximo projeto pode começar com este passo."}</h2><p className="mt-4 max-w-xl text-base leading-7 text-blue-50">{page.finalDescription}</p></div><a href="#seu-proximo-passo" data-landing-event="cta" className="inline-flex min-h-14 items-center justify-center gap-3 self-start rounded-2xl bg-white px-6 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:shrink-0">{client ? 'Publicar projeto GRÁTIS' : page.cta}<ArrowRight className="size-5 shrink-0" aria-hidden="true" /></a></div>
      </section>
    </div>
  );
}
