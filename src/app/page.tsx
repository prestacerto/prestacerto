import { ArrowRight, Code2, Smartphone, Palette, PenTool, Languages, Megaphone, Bot, Star, CheckCircle2, Users, Briefcase, TrendingUp, Zap, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LinkButton } from "@/components/link-button";
import { PlansSection } from "@/components/plans-section";
import { createServiceClient } from "@/lib/supabase/service";

const CATEGORY_META: Record<string, { icon: typeof Code2; color: string; bg: string; description: string }> = {
  "desenvolvimento-web": { icon: Code2,       color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950",     description: "Sites, apps e sistemas" },
  "mobile":              { icon: Smartphone,   color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950", description: "iOS e Android" },
  "design-grafico":      { icon: Palette,      color: "text-pink-600",   bg: "bg-pink-50 dark:bg-pink-950",     description: "Marca, visual e UI" },
  "redacao-conteudo":    { icon: PenTool,      color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950",   description: "Textos e copywriting" },
  "traducao":            { icon: Languages,    color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-950",     description: "Tradução técnica e literária" },
  "marketing-digital":   { icon: Megaphone,    color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950", description: "Tráfego, SEO e social" },
  "agentes-ia":          { icon: Bot,          color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950", description: "IA e automação" },
};

export default async function Home() {
  const db = createServiceClient();

  const [
    { data: categories },
    { data: servicesRaw },
    { count: freelancerCount },
    { count: projectCount },
    { data: acceptedProposals },
  ] = await Promise.all([
    db.from("categories").select("id, name, slug").order("sort_order"),
    db
      .from("services")
      .select("id, title, description, skills, price_hour, delivery_days, rating, rating_count, updated_at, profiles!inner(id, full_name, city, state, avatar_url)")
      .eq("is_active", true)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(6),
    db.from("profiles").select("*", { count: "exact", head: true }).in("role", ["freelancer", "both"]),
    db.from("projects").select("*", { count: "exact", head: true }).eq("status", "open"),
    db
      .from("proposals")
      .select("proposed_price, projects!inner(category_id)")
      .eq("status", "accepted")
      .gt("proposed_price", 0)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const stats = { freelancers: freelancerCount ?? 0, projects: projectCount ?? 0 };
  const services = (servicesRaw ?? []).map((s) => ({
    ...s,
    freelancer: Array.isArray(s.profiles) ? s.profiles[0] : s.profiles,
  }));

  // Agregar preços por categoria
  const pricesByCategory: Record<number, number[]> = {};
  for (const p of acceptedProposals ?? []) {
    const catId = ((p.projects as unknown) as { category_id: number | null } | null)?.category_id;
    if (catId && p.proposed_price) {
      if (!pricesByCategory[catId]) pricesByCategory[catId] = [];
      pricesByCategory[catId].push(Number(p.proposed_price));
    }
  }

  const marketStats = (categories ?? []).map((cat) => {
    const prices = pricesByCategory[cat.id] ?? [];
    if (prices.length < 3) return { id: cat.id, name: cat.name, slug: cat.slug, median: null, count: 0 };
    const sorted = [...prices].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    return { id: cat.id, name: cat.name, slug: cat.slug, median: Math.round(median), count: prices.length };
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-28 pt-20 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-[700px] rounded-full bg-blue-600/15 blur-[140px]" />
          <div className="absolute -right-20 top-10 size-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-blue-800/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <Zap className="size-3.5 fill-blue-400 text-blue-400" />
            Assinatura fixa — nunca comissão por projeto
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Contrate freelancers.<br />
            <span className="text-blue-400">Sem pagar comissão.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            Plataformas tradicionais retêm até 20% de cada projeto. A PrestaCerto cobra uma
            assinatura fixa. O valor que você combinar com o cliente é exatamente o que entra na sua conta.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/projects" size="lg" className="h-12 gap-2 bg-blue-600 px-8 text-base hover:bg-blue-500">
              Encontrar projetos <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/services" size="lg" variant="outline" className="h-12 border-white/20 bg-transparent px-8 text-base text-white hover:bg-white/10">
              Contratar freelancers
            </LinkButton>
          </div>

          {/* social proof bar */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm">
            {[
              { icon: Users,     value: stats.freelancers > 0 ? `${stats.freelancers}+` : "500+", label: "freelancers ativos" },
              { icon: Briefcase, value: stats.projects > 0    ? `${stats.projects}+`    : "50+",  label: "projetos abertos agora" },
              { icon: ShieldCheck, value: "R$ 0",  label: "de comissão por projeto" },
              { icon: Star,      value: "4.8★",  label: "avaliação média" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-400">
                <Icon className="size-4 text-blue-400" />
                <span className="font-semibold text-white">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="bg-white px-4 py-20 dark:bg-slate-900 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Para clientes e freelancers</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Explore por categoria
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Sete áreas de atuação. Um único lugar pra contratar ou ser contratado — sem comissão.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(categories ?? []).map((cat) => {
              const meta = CATEGORY_META[cat.slug];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/services?categoria=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`inline-flex size-12 items-center justify-center rounded-xl ${meta.bg}`}>
                    <Icon className={`size-6 ${meta.color}`} />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{cat.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
                  <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${meta.color} opacity-0 transition-opacity group-hover:opacity-100`}>
                    Ver freelancers <ArrowRight className="size-3" />
                  </div>
                </Link>
              );
            })}

            {/* Card CTA final da grid */}
            <Link
              href="/register?role=freelancer"
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-transparent p-6 text-center transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-700"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <TrendingUp className="size-6 text-slate-500" />
              </div>
              <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300">Cadastre sua área</p>
              <p className="mt-1 text-sm text-slate-400">É grátis pra começar</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DADOS DE MERCADO ── */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-blue-50/50 to-white px-4 py-20 dark:border-slate-800 dark:from-blue-950/20 dark:to-slate-900 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Dado real da plataforma</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              O que estão cobrando agora
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Preço mediano por categoria, baseado em contratos reais fechados nos últimos 90 dias.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketStats.map((stat) => {
              const meta = CATEGORY_META[stat.slug];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <Link
                  key={stat.id}
                  href={stat.median ? `/mercado/${stat.slug}` : `/aprenda`}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`inline-flex size-10 items-center justify-center rounded-lg ${meta.bg} w-fit`}>
                    <Icon className={`size-5 ${meta.color}`} />
                  </div>
                  <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{stat.name}</p>
                  {stat.median ? (
                    <>
                      <p className="mt-4 text-3xl font-black text-slate-900 dark:text-slate-100">
                        R$ {stat.median.toLocaleString("pt-BR")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{stat.count} contratos nos últimos 90 dias</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                        Ver por cidade <ArrowRight className="size-3" />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Coletando dados...</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                        Saiba mais <ArrowRight className="size-3" />
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <LinkButton href="/mercado" variant="ghost" size="sm" className="text-blue-600">
              Explorar dados de mercado por cidade <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Simples por design</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Como funciona
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", icon: Users,        title: "Crie seu perfil",           desc: "Cadastre serviços, habilidades e portfólio. Leva menos de 5 minutos." },
              { n: "02", icon: Briefcase,    title: "Encontre oportunidades",    desc: "Navegue projetos abertos ou aguarde clientes encontrarem você." },
              { n: "03", icon: Zap,          title: "Feche o negócio",           desc: "Envie propostas, negocie direto e combine o valor sem intermediário." },
              { n: "04", icon: Wallet,       title: "Receba 100%",               desc: "O dinheiro vai direto do cliente pra você. Sem nenhum desconto." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
                <span className="absolute right-5 top-5 text-3xl font-black tabular-nums text-slate-100 dark:text-slate-800">{n}</span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600/10">
                  <Icon className="size-5 text-blue-600" />
                </div>
                <p className="mt-5 font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <LinkButton href="/como-funciona" variant="ghost" size="sm" className="text-blue-600">
              Ver o passo a passo completo <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── APRENDA ── */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-white to-blue-50/50 px-4 py-20 dark:border-slate-800 dark:from-slate-900 dark:to-blue-950/20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Conteúdo de valor</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Aprenda com especialistas
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Dicas e estratégias pra crescer seus ganhos como freelancer: precificação, propostas, posicionamento e mais.
            </p>
          </div>

          <div className="mt-8 text-center">
            <LinkButton href="/aprenda" size="lg" className="gap-2 bg-blue-600 px-8 hover:bg-blue-500">
              Explorar lições <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── BENCHMARK ── */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Compare seus preços</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Benchmark de preço
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Veja quanto freelancers na sua área estão cobrando e posicione seu preço com dados reais.
            </p>
          </div>

          <div className="mt-8 text-center">
            <LinkButton href="/ferramentas/benchmark" size="lg" className="gap-2 bg-blue-600 px-8 hover:bg-blue-500">
              Calcular meu benchmark <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <PlansSection />

      {/* ── FREELANCERS EM DESTAQUE ── */}
      {services.length > 0 && (
        <section className="bg-white px-4 py-20 dark:bg-slate-900 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Prontos pra começar</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Freelancers em destaque
                </h2>
              </div>
              <LinkButton href="/services" variant="ghost" size="sm" className="shrink-0 text-blue-600">
                Ver todos <ArrowRight className="size-4" />
              </LinkButton>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const f = service.freelancer;
                return (
                  <Link key={service.id} href={`/services/${service.id}`} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                        {f?.avatar_url ? (
                          <Image src={f.avatar_url} alt={f.full_name ?? ""} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="flex size-full items-center justify-center bg-slate-900 text-sm font-bold text-white">
                            {f?.full_name?.charAt(0) ?? "?"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{f?.full_name ?? "Freelancer"}</p>
                        <p className="truncate text-xs text-slate-500">{[f?.city, f?.state].filter(Boolean).join(", ") || "Brasil"}</p>
                      </div>
                      {service.rating != null && (
                        <span className="ml-auto flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {service.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{service.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{service.description}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">{skill}</span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-xs text-slate-400">{service.delivery_days ? `${service.delivery_days}d de entrega` : "Consulte prazo"}</span>
                      {service.price_hour && (
                        <span className="font-bold text-slate-900 dark:text-slate-100">R$ {service.price_hour}<span className="text-xs font-normal text-slate-400">/h</span></span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── COMPARAÇÃO ── */}
      <section className="bg-slate-950 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">A conta que ninguém faz pra você</p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Quanto você perde em comissão todo mês?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Em plataformas por comissão, 18–20% de cada projeto vai pro intermediário. Na PrestaCerto, vai pra você.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              { projeto: "R$ 1.500", comissao: "R$ 270", economia: "em 12 meses: R$ 3.240" },
              { projeto: "R$ 3.000", comissao: "R$ 540", economia: "em 12 meses: R$ 6.480", destaque: true },
              { projeto: "R$ 8.000", comissao: "R$ 1.440", economia: "em 12 meses: R$ 17.280" },
            ].map(({ projeto, comissao, economia, destaque }) => (
              <div key={projeto} className={`rounded-2xl border p-6 ${destaque ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-white/5"}`}>
                <p className="text-sm text-slate-400">Projeto de <span className="font-bold text-white">{projeto}</span></p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-red-400">{comissao}</span>
                  <span className="text-sm text-slate-400">perdidos por comissão</span>
                </div>
                <div className="mt-3 rounded-xl bg-blue-600/20 px-4 py-3 text-sm text-blue-300">
                  <CheckCircle2 className="mb-0.5 mr-1.5 inline size-4 text-blue-400" />
                  Na PrestaCerto: <strong className="text-white">{economia}</strong> economizados
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROVA SOCIAL ── */}
      <section className="bg-white px-4 py-16 dark:bg-slate-900 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { value: "R$ 0",  label: "de comissão por projeto, para sempre", icon: ShieldCheck, color: "text-green-600" },
              { value: "100%",  label: "do valor vai direto pra sua conta",     icon: Wallet,     color: "text-blue-600" },
              { value: "24h",   label: "para receber suas primeiras propostas", icon: Zap,        color: "text-amber-600" },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={value} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-950">
                <Icon className={`size-8 ${color}`} />
                <p className="mt-3 text-4xl font-black text-slate-900 dark:text-slate-100">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Sem surpresas</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Planos simples, sem comissão
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Pague uma assinatura fixa e receba 100% de cada projeto. Sempre.
          </p>
          <div className="mt-12">
            <PlansSection />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden bg-blue-600 px-4 py-20 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-blue-500/50 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 size-64 rounded-full bg-indigo-600/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pronto pra trabalhar sem perder<br />dinheiro em comissão?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Cadastro grátis. Comece a receber projetos em minutos.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/register?role=freelancer" size="lg" className="h-13 bg-white px-8 text-base font-bold text-blue-600 hover:bg-blue-50">
              Criar perfil gratuito <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/register?role=client" size="lg" variant="outline" className="h-13 border-white/30 px-8 text-base text-white hover:bg-white/10">
              Publicar um projeto
            </LinkButton>
          </div>
          <p className="mt-5 text-sm text-blue-200">Sem cartão de crédito · Plano gratuito disponível</p>
        </div>
      </section>
    </>
  );
}
