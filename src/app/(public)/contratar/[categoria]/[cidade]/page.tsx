export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Star, CheckCircle2, ArrowRight, Users, Briefcase, Shield, Zap, Clock, MessageSquare } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";
import { CIDADES, getLandingCity, getLandingCategory, getAllLandingCombinations } from "@/lib/data/landing-data";
import { RegionalLeadForm } from "@/components/regional-lead-form";
import { HIRING_GUIDES } from "@/lib/data/hiring-guides";
import { getPageMetadata, siteUrl } from "@/lib/seo/metadata";
import { getBreadcrumbSchema, getFAQSchema } from "@/components/structured-data";
import { cache } from 'react';
import { indexingRobots, serializeJsonLd } from '@/lib/seo/discovery';

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
  const cat = getLandingCategory(categoria);
  const cid = getLandingCity(cidade);
  if (!cat || !cid) notFound();
  const { freelancers } = await getPageData(categoria, cidade);

  return { ...getPageMetadata(
    `Contratar ${cat.label} em ${cid.name}`,
    `Procura ${cat.label.toLowerCase()} em ${cid.name}? Conheça os perfis disponíveis, confira como comparar propostas e publique seu projeto grátis no PrestaCerto.`,
    `/contratar/${categoria}/${cidade}`,
  ), robots: indexingRobots(freelancers.length > 0) };
}

const getPageData = cache(async (categoriaSlug: string, cidadeSlug: string) => {
  const db = createPublicClient();
  const cidade = getLandingCity(cidadeSlug);
  if (!cidade) notFound();
  const { data: categoriaRow } = await db.from("categories").select("id, name").eq("slug", categoriaSlug).maybeSingle();
  if (!categoriaRow) return { categoriaRow: null, freelancers: [], openProjects: [], totalFreelancers: 0 };
  const [{ data: freelancers, count }, { data: openProjects }] = await Promise.all([
    db.from("profiles")
      .select("id, full_name, avatar_url, bio, plan, city, services!inner(id)", { count: "exact" })
      .eq("services.is_active", true).eq("services.category_id", categoriaRow.id)
      .in("role", ["freelancer", "both"])
      .not('full_name', 'is', null).neq('full_name', '').ilike("city", cidade.name).ilike('state', cidade.state).order("full_name").limit(6),
    db.from("projects").select("id, title, skills, budget_min, budget_max, created_at")
      .eq("status", "open").eq("category_id", categoriaRow.id)
      .order("created_at", { ascending: false }).limit(4),
  ]);
  return { categoriaRow, freelancers: freelancers ?? [], openProjects: openProjects ?? [], totalFreelancers: count ?? 0 };
});

function getDefaultFaq(cat: { label: string }) {
  return [
    { q: `Quanto custa contratar um ${cat.label.toLowerCase()} freelancer?`, a: "O valor depende do escopo e experiência do profissional. No PrestaCerto você publica o projeto gratuitamente, recebe propostas com preços reais e escolhe a que melhor se encaixa — sem pagar comissão sobre o valor." },
    { q: "Como funciona o pagamento?", a: "Valor, forma de pagamento e condições devem ser combinados diretamente com o profissional antes do início do trabalho." },
    { q: "Preciso assinar algum plano para contratar?", a: "Não. Publicar projetos e receber propostas é gratuito. Os custos do serviço são combinados com o profissional; consulte a página de planos para conhecer os recursos disponíveis aos freelancers." },
  ];
}

const HOW_IT_WORKS = [
  { icon: Briefcase, title: "Publique seu projeto", desc: "Descreva o que precisa, defina prazo e orçamento. A publicação é gratuita." },
  { icon: MessageSquare, title: "Receba propostas", desc: "Compare o escopo, o preço e o portfólio dos profissionais que responderem." },
  { icon: CheckCircle2, title: "Contrate diretamente", desc: "Aceite a proposta que fizer mais sentido. Sem intermediários, sem taxas escondidas." },
  { icon: Shield, title: "Combine as condições", desc: "Confirme forma de pagamento, etapas e critérios de entrega antes de começar." },
];

export default async function LandingPage({ params }: { params: Promise<Params> }) {
  const { categoria, cidade: cidadeSlug } = await params;

  const cat = getLandingCategory(categoria);
  const cid = getLandingCity(cidadeSlug);
  if (!cat || !cid) notFound();

  const { freelancers, openProjects, totalFreelancers } = await getPageData(categoria, cidadeSlug);
  const faqs = getDefaultFaq(cat);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Contratar ${cat.label} em ${cid.name}`,
    description: `Confira os perfis disponíveis de ${cat.labelPlural.toLowerCase()} em ${cid.name} e saiba como comparar propostas.`,
    url: `${siteUrl}/contratar/${categoria}/${cidadeSlug}`,
    ...(freelancers.length > 0 ? {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: freelancers.length,
        itemListElement: freelancers.map((freelancer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: freelancer.full_name,
          url: `${siteUrl}/perfil/${freelancer.id}`,
        })),
      },
    } : {}),
  };
  const faqJsonLd = getFAQSchema(faqs.map(({ q, a }) => ({ question: q, answer: a })));
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Início", url: `${siteUrl}/` },
    { name: "Contratar", url: `${siteUrl}/contratar` },
    { name: cat.labelPlural, url: `${siteUrl}/contratar/${categoria}` },
    { name: `${cat.label} em ${cid.name}`, url: `${siteUrl}/contratar/${categoria}/${cidadeSlug}` },
  ]);

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white px-4 pb-16 pt-10 text-slate-900">
        <div className="relative mx-auto max-w-4xl text-center">
          <nav aria-label="Caminho da página" className="mb-8 flex flex-wrap justify-center gap-2 text-sm text-slate-500"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/contratar">Contratar</Link><span aria-hidden="true">/</span><Link href={`/contratar/${categoria}`}>{cat.labelPlural}</Link><span aria-hidden="true">/</span><span>{cid.name}</span></nav>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <MapPin className="size-3.5" />
            {cid.name}, {cid.state}
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Contrate um<br />
            <span className="text-blue-600">{cat.label} Freelancer</span><br />
            em {cid.name}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Publique seu projeto para receber propostas de {cat.labelPlural.toLowerCase()}.{" "}
            <strong className="text-slate-900">Sem comissão, sem taxa por projeto</strong> — você paga exatamente o que combinar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/publicar-projeto" className="h-12 gap-2 bg-blue-600 px-8 text-base hover:bg-blue-500">
              Publicar projeto grátis <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton href={`/services?categoria=${categoria}`} variant="outline" className="h-12 border-slate-200 bg-white px-8 text-base text-slate-700 hover:bg-slate-50">
              Ver {cat.labelPlural.toLowerCase()}
            </LinkButton>
          </div>

          {/* trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            {[
              { icon: CheckCircle2, text: "0% de comissão" },
              { icon: Zap, text: "Compare propostas" },
              { icon: Shield, text: "Condições claras" },
              { icon: Star, text: "Perfis e portfólios" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="size-4 text-blue-600" />
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
            { value: String(totalFreelancers), label: "Profissionais nesta categoria e cidade", icon: Users },
            { value: `${openProjects.length}`, label: "Projetos da categoria em destaque", icon: Briefcase },
            { value: "Direto", label: "Converse com o profissional", icon: MessageSquare },
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
                <Link key={f.id} href={`/perfil/${f.id}`} className="group">
                  <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    {["pro", "business"].includes(f.plan ?? "free") && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <CheckCircle2 className="size-3" /> Plano {f.plan === "business" ? "Business" : "Pro"}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                        {f.avatar_url ? (
                          <Image src={f.avatar_url} alt={f.full_name || "Profissional"} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="flex size-full items-center justify-center bg-slate-900 text-lg font-bold text-white">
                            {(f.full_name || "Profissional").charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{f.full_name}</p>
                        {f.city && <p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="size-3" />{f.city}</p>}
                      </div>
                    </div>
                    {f.bio && (
                      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{f.bio}</p>
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

        <section className="mt-14 rounded-xl border border-slate-200 bg-white p-6 sm:p-8" aria-labelledby="briefing-title"><h2 id="briefing-title" className="text-2xl font-semibold tracking-tight text-slate-900">O que definir antes de contratar em {cid.name}</h2><p className="mt-4 leading-7 text-slate-600">{HIRING_GUIDES[categoria]?.intro}</p><ul className="mt-5 space-y-3">{HIRING_GUIDES[categoria]?.checklist.map(item => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-600"><CheckCircle2 className="mt-1.5 size-4 shrink-0 text-blue-600" />{item}</li>)}</ul><p className="mt-5 leading-7 text-slate-600">{HIRING_GUIDES[categoria]?.comparison}</p><p className="mt-4 text-sm leading-7 text-slate-500">Confirme se o profissional atende em {cid.name}/{cid.state} e se o trabalho pode ser realizado remotamente. A disponibilidade depende dos perfis e serviços publicados.</p><Link href={`/contratar/${categoria}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700">Ver guia de {cat.labelPlural.toLowerCase()}<ArrowRight className="size-4" /></Link></section>

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

      <section className="border-t border-slate-200 bg-blue-50/40 px-4 py-16 text-center text-slate-900">
        <div className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Seu projeto começa com uma conversa</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Procura {cat.label.toLowerCase()} em {cid.name}?</h2><p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">Publique o que você precisa, informe os detalhes e compare as propostas recebidas. O cadastro e a publicação do projeto são gratuitos.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><LinkButton href="/publicar-projeto" className="h-12 gap-2 bg-blue-600 px-6 text-white hover:bg-blue-700">Publicar projeto grátis<ArrowRight className="size-4" /></LinkButton><LinkButton href="/register?role=freelancer" variant="outline" className="h-12 border-slate-200 bg-white px-6">Sou profissional</LinkButton></div></div>
      </section>
    </div>
  );
}
