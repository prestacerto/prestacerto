import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  GraduationCap,
  HeartPulse,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
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
    title: "Design & criação",
    description: "Identidade visual, UI/UX e conteúdo visual",
    icon: Palette,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Marketing digital",
    description: "Tráfego, redes sociais e estratégia",
    icon: Megaphone,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Consultoria & negócios",
    description: "Finanças, gestão e crescimento",
    icon: BriefcaseBusiness,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    title: "Reformas & casa",
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
    title: "Beleza & bem-estar",
    description: "Estética, cabelo, massagem e cuidados",
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

const featuredProviders = [
  {
    initials: "RN",
    name: "Rafaela Nogueira",
    area: "Desenvolvimento de sites e apps",
    description: "Desenvolvedora full-stack focada em e-commerce, dashboards e experiências rápidas.",
    rating: "4.9",
    reviews: "190",
    price: "R$ 850",
    color: "bg-blue-600",
  },
  {
    initials: "CD",
    name: "Camila Duarte",
    area: "Identidade visual e branding",
    description: "Crio marcas com personalidade para negócios que querem se destacar.",
    rating: "5.0",
    reviews: "244",
    price: "R$ 490",
    color: "bg-orange-500",
  },
  {
    initials: "LF",
    name: "Lucas Ferreira",
    area: "UI/UX Design",
    description: "Interfaces focadas em conversão e uma experiência simples para o usuário.",
    rating: "4.8",
    reviews: "137",
    price: "R$ 700",
    color: "bg-orange-500",
  },
  {
    initials: "DM",
    name: "Diego Martins",
    area: "Redes sociais e conteúdo",
    description: "Estratégia e produção de conteúdo para marcas que querem crescer de verdade.",
    rating: "4.9",
    reviews: "159",
    price: "R$ 420",
    color: "bg-emerald-600",
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

export default function Home() {
  return (
    <div className="bg-[#faf9f6] text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <section className="border-b border-slate-200/80 bg-[#faf9f6] dark:border-white/10 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:pb-20 lg:pt-20">
          <div>
            <p className="mb-5 text-sm font-medium italic text-slate-500 dark:text-slate-400">
              Curadoria, não leilão de quem paga mais por destaque.
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-[4.6rem]">
              Contrate talentos.
              <br />
              <span className="text-blue-600">Sem comissões.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Encontre profissionais confiáveis para tirar seu projeto do papel —
              com avaliações reais, negociação transparente e sem taxas escondidas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Começar grátis
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background/80 px-6 py-3.5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/60 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explorar prestadores
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-emerald-600" />
                Sem comissão por projeto
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                Negociação transparente
              </span>
            </div>
          </div>

          <div className="relative lg:pl-5">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-100/60 blur-3xl dark:bg-blue-600/20" />
            <div className="relative rounded-[1.65rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30 sm:p-5">
              <div className="flex items-center justify-between px-2 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Prestadores bem avaliados
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Escolha pelo que importa</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Atualizado hoje
                </div>
              </div>
              <div className="space-y-2.5">
                {featuredProviders.map((provider) => (
                  <Link
                    href="/services"
                    key={provider.name}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-slate-800/80 dark:hover:border-blue-400/50"
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${provider.color}`}
                    >
                      {provider.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                        {provider.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {provider.area}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {provider.rating}
                    </span>
                    <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </Link>
                ))}
              </div>
              <Link
                href="/services"
                className="mt-4 flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                Ver todos os prestadores
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">0%</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">comissão para quem presta o serviço</p>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">4.8/5</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">avaliação média exibida com transparência</p>
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Certo AI</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">propostas mais claras para freelancers</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Encontre sua área</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">O que você precisa resolver?</h2>
            <p className="mt-3 text-slate-500">Escolha uma categoria e encontre quem está disponível agora.</p>
          </div>
          <Link href="/services" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300">
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
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-400/50"
              >
                <span className={`flex size-10 items-center justify-center rounded-xl ${category.tone}`}>
                  <Icon className="size-5" />
                </span>
                <span className="mt-4 block text-sm font-bold text-slate-900 dark:text-white">{category.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{category.description}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f4f7ff] dark:border-white/10 dark:bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Prestadores em destaque</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Profissionais que entregam</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400">Perfis claros para você decidir com segurança.</p>
            </div>
            <Link href="/services" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-300">
              Ver todos <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProviders.map((provider) => (
              <article key={provider.name} className="flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-11 items-center justify-center rounded-xl text-xs font-bold text-white ${provider.color}`}>
                    {provider.initials}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    <Check className="size-3" /> Verificado
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-white">{provider.name}</h3>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{provider.area}</p>
                <p className="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{provider.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/10">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" /> {provider.rating} <span className="font-normal text-slate-400">({provider.reviews})</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">a partir de <strong className="text-slate-900 dark:text-white">{provider.price}</strong></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Para quem contrata</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Do briefing à entrega sem complicação.</h2>
          <p className="mt-4 max-w-lg leading-7 text-slate-600 dark:text-slate-300">Você escolhe o profissional pelo trabalho e pela reputação — não pelo maior lance. A plataforma deixa as informações organizadas para a decisão ficar mais simples.</p>
            <Link href="/register" className="mt-6 inline-flex items-center font-bold text-slate-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-300">
            Publicar um projeto <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {howItWorks.map((step) => (
            <div key={step.number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <span className="text-xs font-black tracking-[0.16em] text-blue-600">{step.number}</span>
              <h3 className="mt-8 text-base font-bold text-slate-950 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
              <Sparkles className="size-3.5" /> Certo AI para freelancers
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Sua experiência continua sendo sua. A proposta fica mais clara.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">Escreva do seu jeito e receba uma sugestão mais objetiva, específica e profissional. Você revisa, edita e só envia quando estiver de acordo.</p>
          </div>
          <Link href="/plans" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500">
            Conhecer o Certo AI <ArrowRight className="ml-2 size-4" />
          </Link>
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
  );
}
