export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Star, CheckCircle2, ArrowRight, Users, Briefcase, Shield, Zap, Clock, MessageSquare } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";
import { CIDADES, CATEGORIAS, getAllLandingCombinations } from "@/lib/data/landing-data";
import { RegionalLeadForm } from "@/components/regional-lead-form";

export const revalidate = 3600;

interface Params {
  categoria: string;
  cidade: string;
}

export async function generateStaticParams() {
  return getAllLandingCombinations();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria, cidade } = await params;
  const cat = CATEGORIAS[categoria];
  const cid = CIDADES[cidade];
  if (!cat || !cid) return {};

  const title = `Contratar ${cat.label} Freelancer em ${cid.name} | PrestaCerto`;
  const description = `Encontre ${cat.labelPlural.toLowerCase()} freelancers em ${cid.name} (${cid.state}). Sem comissão, sem taxa por projeto — contrate diretamente e pague só o combinado.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/contratar/${categoria}/${cidade}` },
  };
}

async function getPageData(categoriaSlug: string, cidadeSlug: string) {
  const db = createServiceClient();
  const cidade = CIDADES[cidadeSlug];

  const [{ data: categoriaRow }, { data: freelancers }, { data: openProjects }, { data: stats }] =
    await Promise.all([
      db.from("categories").select("id, name").eq("slug", categoriaSlug).single(),

      db
        .from("profiles")
        .select("id, full_name, avatar_url, headline, rating, rating_count, plan, city, services!inner(id)")
        .eq("services.is_active", true)
        .in("role", ["freelancer", "both"])
        .or(`city.ilike.%${cidade?.name}%,state.eq.${cidade?.state}`)
        .limit(6),

      db
        .from("projects")
        .select("id, title, skills, budget_min, budget_max, created_at")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(4),

      db
        .from("profiles")
        .select("id")
        .in("role", ["freelancer", "both"])
        .limit(1000),
    ]);

  const totalFreelancers = stats?.length ?? 0;

  return { categoriaRow, freelancers: freelancers ?? [], openProjects: openProjects ?? [], totalFreelancers };
}

const FAQS: Record<string, { q: string; a: string }[]> = {
  "desenvolvimento-web": [
    { q: "Quanto custa contratar um desenvolvedor web freelancer?", a: "O valor varia bastante com experiência e escopo: projetos simples ficam entre R$ 800 e R$ 3.000, sistemas mais complexos podem chegar a R$ 15.000+. No PrestaCerto você recebe propostas reais e compara antes de decidir — sem comissão." },
    { q: "É mais barato contratar um freelancer ou uma agência?", a: "Freelancers tendem a ser 40–60% mais acessíveis que agências para projetos com escopo definido. A economia vem do custo operacional menor e da ausência de intermediários." },
    { q: "Posso contratar um desenvolvedor web fora da minha cidade?", a: "Sim, o trabalho é 100% remoto. Mas muitos clientes preferem profissionais da mesma cidade para reuniões presenciais — por isso criamos essa página por localidade." },
  ],
  "design-grafico": [
    { q: "Quanto custa um designer gráfico freelancer?", a: "Logos e identidade visual ficam em média entre R$ 500 e R$ 4.000. Materiais avulsos (banner, social media) partem de R$ 80. O preço reflete complexidade e experiência do profissional." },
    { q: "Como avaliar um designer antes de contratar?", a: "Peça acesso ao portfólio, verifique as avaliações de projetos anteriores e observe se o estilo dele combina com a sua marca. No PrestaCerto cada freelancer tem perfil público com portfólio e histórico." },
    { q: "Designer gráfico faz identidade visual completa?", a: "Sim. A maioria entrega logo, manual de marca, paleta de cores, tipografia e aplicações. Certifique-se de descrever isso no projeto para receber propostas com o escopo correto." },
  ],
  "marketing-digital": [
    { q: "Quanto custa contratar um especialista em marketing digital?", a: "Gestão de tráfego pago parte de R$ 600/mês, gestão de redes sociais de R$ 800/mês. Consultorias estratégicas e projetos pontuais variam com o escopo — peça proposta detalhada." },
    { q: "É melhor contratar por projeto ou mensalidade?", a: "Para campanhas pontuais (lançamentos, eventos), prefira projeto. Para crescimento contínuo (SEO, social media, ads), mensalidade gera melhor resultado pois o profissional acumula contexto da marca." },
    { q: "O freelancer de marketing entrega relatório?", a: "Profissionais sérios entregam relatório mensal de resultados. Inclua essa exigência na descrição do projeto para filtrar propostas." },
  ],
};

function getDefaultFaq(cat: { label: string }) {
  return [
    { q: `Quanto custa contratar um ${cat.label.toLowerCase()} freelancer?`, a: "O valor depende do escopo e experiência do profissional. No PrestaCerto você publica o projeto gratuitamente, recebe propostas com preços reais e escolhe a que melhor se encaixa — sem pagar comissão sobre o valor." },
    { q: "Como funciona o pagamento?", a: "O pagamento é feito diretamente entre você e o freelancer via Mercado Pago, com retenção segura: o dinheiro só é liberado após você confirmar a entrega. O PrestaCerto nunca fica com parte do valor." },
    { q: "Preciso assinar algum plano para contratar?", a: "Não. Publicar projetos e receber propostas é gratuito. Freelancers assinam planos para aumentar visibilidade — você não paga nada pra contratar." },
  ];
}

const HOW_IT_WORKS = [
  { icon: Briefcase, title: "Publique seu projeto", desc: "Descreva o que precisa, defina prazo e orçamento. É gratuito e leva menos de 2 minutos." },
  { icon: MessageSquare, title: "Receba propostas", desc: "Freelancers qualificados enviam propostas em até 24h. Compare preço, portfólio e avaliações." },
  { icon: CheckCircle2, title: "Contrate diretamente", desc: "Aceite a proposta que fizer mais sentido. Sem intermediários, sem taxas escondidas." },
  { icon: Shield, title: "Pague com segurança", desc: "O valor fica retido e só é liberado quando você aprovar a entrega. Risco zero." },
];

export default async function LandingPage({ params }: { params: Promise<Params> }) {
  const { categoria, cidade: cidadeSlug } = await params;

  const cat = CATEGORIAS[categoria];
  const cid = CIDADES[cidadeSlug];
  if (!cat || !cid) notFound();

  const { categoriaRow, freelancers, openProjects, totalFreelancers } = await getPageData(categoria, cidadeSlug);
  const faqs = FAQS[categoria] ?? getDefaultFaq(cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${cat.label} Freelancer em ${cid.name}`,
    description: `Contrate ${cat.labelPlural.toLowerCase()} freelancers em ${cid.name} — sem comissão`,
    provider: { "@type": "Organization", name: "PrestaCerto", url: "https://prestacerto.com.br" },
    areaServed: { "@type": "City", name: cid.name, containedIn: { "@type": "State", name: cid.state } },
  };

  return (
    <div className="w-full">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-16 text-white">
        {/* gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute -right-32 top-0 size-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm">
            <MapPin className="size-3.5" />
            {cid.name}, {cid.state}
          </div>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Contrate um<br />
            <span className="text-blue-400">{cat.label} Freelancer</span><br />
            em {cid.name}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Receba propostas de {cat.labelPlural.toLowerCase()} qualificados em até 24h.{" "}
            <strong className="text-white">Sem comissão, sem taxa por projeto</strong> — você paga exatamente o que combinar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/register?role=client" className="h-12 gap-2 bg-blue-600 px-8 text-base hover:bg-blue-500">
              Publicar projeto grátis <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/services" variant="outline" className="h-12 border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10">
              Ver {cat.labelPlural.toLowerCase()}
            </LinkButton>
          </div>

          {/* trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            {[
              { icon: CheckCircle2, text: "0% de comissão" },
              { icon: Zap, text: "Propostas em até 24h" },
              { icon: Shield, text: "Pagamento seguro" },
              { icon: Star, text: "Avaliações verificadas" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="size-4 text-blue-400" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-0 divide-x divide-slate-200 dark:divide-slate-800">
          {[
            { value: totalFreelancers > 0 ? `${totalFreelancers}+` : "500+", label: "Freelancers cadastrados", icon: Users },
            { value: `${openProjects.length}`, label: "Projetos abertos agora", icon: Briefcase },
            { value: "4.8★", label: "Avaliação média", icon: Star },
            { value: "R$ 0", label: "De comissão por projeto", icon: CheckCircle2 },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1 px-8 py-5 min-w-[140px]">
              <Icon className="size-4 text-blue-600" />
              <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{value}</span>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-blue-100 bg-[#f4f7ff] px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Atendimento local, trabalho remoto</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Quer encontrar {cat.label.toLowerCase()} em {cid.name}?</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">Conte o que você precisa e receba um caminho claro para publicar seu projeto e comparar profissionais que atendem sua região.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Cadastro gratuito</span>
              <span className="inline-flex items-center gap-2"><Shield className="size-4 text-emerald-600" /> Sem comissão para contratar</span>
            </div>
          </div>
          <RegionalLeadForm category={cat.label} city={cid.name} />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">

        {/* ── FREELANCERS ── */}
        {freelancers.length > 0 && (
          <section>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Profissionais disponíveis</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {cat.labelPlural} em {cid.name}
                </h2>
              </div>
              <Link href="/services" className="text-sm font-medium text-blue-600 hover:underline">
                Ver todos →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {freelancers.map((f) => (
                <Link key={f.id} href={`/profile/${f.id}`} className="group">
                  <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    {f.plan !== "free" && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <CheckCircle2 className="size-3" /> Verificado
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                        {f.avatar_url ? (
                          <Image src={f.avatar_url} alt={f.full_name} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="flex size-full items-center justify-center bg-slate-900 text-lg font-bold text-white">
                            {f.full_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{f.full_name}</p>
                        {f.city && <p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="size-3" />{f.city}</p>}
                      </div>
                    </div>
                    {f.headline && (
                      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{f.headline}</p>
                    )}
                    {f.rating != null && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-3.5 ${i < Math.round(f.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{f.rating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({f.rating_count})</span>
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                      Ver perfil <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── COMO FUNCIONA ── */}
        <section className="mt-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Simples e transparente</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Como contratar um {cat.label.toLowerCase()}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className="absolute right-5 top-5 text-2xl font-black text-slate-100 dark:text-slate-800 tabular-nums">0{i + 1}</span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600/10">
                  <Icon className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJETOS ABERTOS ── */}
        {openProjects.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Oportunidades abertas</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Projetos aguardando proposta
                </h2>
              </div>
              <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline">
                Ver todos →
              </Link>
            </div>
            <ul className="mt-6 space-y-3">
              {openProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`}>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{p.title}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {(p.skills ?? []).slice(0, 4).map((s: string) => (
                            <Badge key={s} variant="secondary" className="font-normal text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6 shrink-0 text-right">
                        {(p.budget_min || p.budget_max) && (
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {p.budget_max ? `até R$ ${p.budget_max}` : `R$ ${p.budget_min}+`}
                          </p>
                        )}
                        <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-slate-400">
                          <Clock className="size-3" />
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── FAQ ── */}
        <section className="mt-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Dúvidas frequentes</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Perguntas sobre contratar {cat.labelPlural.toLowerCase()}</h2>
          </div>
          <dl className="mt-8 space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <dt className="font-semibold text-slate-900 dark:text-slate-100">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── OUTRAS CIDADES ── */}
        <section className="mt-16">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {cat.labelPlural} em outras cidades
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(CIDADES)
              .filter(([slug]) => slug !== cidadeSlug)
              .map(([slug, c]) => (
                <Link
                  key={slug}
                  href={`/contratar/${categoria}/${slug}`}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* ── CTA FINAL ── */}
      <section className="bg-slate-950 px-4 py-20 text-center text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Sem risco, sem comissão</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Encontre o {cat.label.toLowerCase()} ideal<br />em {cid.name} hoje mesmo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            Publique seu projeto agora e receba propostas de {cat.labelPlural.toLowerCase()} reais em até 24 horas.
            Grátis pra contratar, sempre.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/register?role=client" className="h-12 gap-2 bg-blue-600 px-8 text-base hover:bg-blue-500">
              Publicar projeto grátis <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href="/register?role=freelancer" variant="outline" className="h-12 border-white/20 bg-transparent px-8 text-base text-white hover:bg-white/10">
              Sou freelancer
            </LinkButton>
          </div>
          <p className="mt-5 text-xs text-slate-600">Mais de 500 freelancers cadastrados · Cadastro em 2 minutos</p>
        </div>
      </section>
    </div>
  );
}
