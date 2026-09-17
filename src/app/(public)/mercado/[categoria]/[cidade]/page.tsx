export const dynamic = "force-dynamic";

import Link from "next/link";
import { cache } from "react";
import { indexingRobots } from '@/lib/seo/discovery';
import { getPageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TrendingUp, Users, Briefcase, ArrowRight, Info } from "lucide-react";
import { createServiceClient, hasServiceCredentials } from "@/lib/supabase/service";
import { createPublicClient } from "@/lib/supabase/public";
import { CIDADES, CATEGORIAS, getLandingCity, getLandingCategory, getAllLandingCombinations } from "@/lib/data/landing-data";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";

export const revalidate = 3600;

type Params = { categoria: string; cidade: string };

export function generateStaticParams() {
  return getAllLandingCombinations();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria, cidade } = await params;
  const cat = getLandingCategory(categoria);
  const cid = getLandingCity(cidade);
  if (!cat || !cid) notFound();

  const { precos } = await getMercadoLocal(categoria, cidade);
  const hasLocalSample = precos.length >= 5;
  return {
    ...getPageMetadata(`Preços de ${cat.label} em ${cid.name}`, `Consulte a disponibilidade de valores para ${cat.labelPlural.toLowerCase()} em ${cid.name}. Veja a origem da amostra e a diferença entre propostas aceitas e orçamentos.`, `/mercado/${categoria}/${cidade}`),
    robots: indexingRobots(hasLocalSample),
  };
}

const NOVENTA_DIAS = 90 * 24 * 60 * 60 * 1000;

const getMercadoLocal = cache(async (categoriaSlug: string, cidadeSlug: string) => {
  const db = createPublicClient();
  const cidade = getLandingCity(cidadeSlug);
  if (!cidade) notFound();

  const { data: categoriaRow } = await db
    .from("categories")
    .select("id, name")
    .eq("slug", categoriaSlug)
    .single();

  if (!categoriaRow) {
    return { categoriaRow: null, precos: [], totalFreelancers: 0, projetosAbertos: 0, orcamentos: [] };
  }

  const [{ data: locais }, { data: projetos }] = await Promise.all([
    db
      .from("profiles")
      .select("id")
      .in("role", ["freelancer", "both"])
      .ilike("city", cidade.name).ilike("state", cidade.state),
    db
      .from("projects")
      .select("id, status, budget_min, budget_max")
      .eq("category_id", categoriaRow.id),
  ]);

  const idsLocais = (locais ?? []).map((p) => p.id);
  const idsProjetosCategoria = (projetos ?? []).map((p) => p.id);

  let precos: number[] = [];
  if (hasServiceCredentials() && idsLocais.length > 0 && idsProjetosCategoria.length > 0) {
    const { data: propostas } = await createServiceClient()
      .from("proposals")
      .select("proposed_price")
      .eq("status", "accepted")
      .gt("proposed_price", 0)
      .in("freelancer_id", idsLocais.slice(0, 500))
      .in("project_id", idsProjetosCategoria.slice(0, 500))
      .gte("created_at", new Date(Date.now() - NOVENTA_DIAS).toISOString());

    precos = (propostas ?? []).map((p) => Number(p.proposed_price)).filter((n) => n > 0);
  }

  const orcamentos = (projetos ?? [])
    .filter((p) => p.status === "open" && p.budget_min != null && p.budget_max != null)
    .map((p) => (Number(p.budget_min) + Number(p.budget_max)) / 2);

  return {
    categoriaRow,
    precos,
    orcamentos,
    totalFreelancers: idsLocais.length,
    projetosAbertos: (projetos ?? []).filter((p) => p.status === "open").length,
  };
});

function formatBrl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function percentil(valores: number[], p: number) {
  if (valores.length === 0) return null;
  const ord = [...valores].sort((a, b) => a - b);
  const idx = Math.min(ord.length - 1, Math.floor((p / 100) * ord.length));
  return Math.round(ord[idx]);
}

export default async function MercadoLocalPage({ params }: { params: Promise<Params> }) {
  const { categoria, cidade: cidadeSlug } = await params;
  const cat = getLandingCategory(categoria);
  const cid = getLandingCity(cidadeSlug);
  if (!cat || !cid) notFound();

  const { precos, orcamentos, totalFreelancers, projetosAbertos } = await getMercadoLocal(
    categoria,
    cidadeSlug,
  );

  const amostra = precos.length >= 5 ? precos : orcamentos;
  const baseadoEmContratos = precos.length >= 5;

  const mediana = percentil(amostra, 50);
  const p25 = percentil(amostra, 25);
  const p75 = percentil(amostra, 75);
  const temDados = mediana !== null && amostra.length >= 3;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      {temDados && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: baseadoEmContratos ? `Propostas aceitas de ${cat.labelPlural} em ${cid.name}` : `Orçamentos de projetos de ${cat.labelPlural} no PrestaCerto`,
              description: baseadoEmContratos ? `Valores de propostas aceitas de ${cat.labelPlural.toLowerCase()} em ${cid.name}/${cid.state}.` : `Orçamentos publicados para ${cat.labelPlural.toLowerCase()} na plataforma, incluindo outras localidades.`,
              spatialCoverage: baseadoEmContratos ? `${cid.name}, ${cid.state}, Brasil` : "Brasil",
              creator: { "@type": "Organization", name: "PrestaCerto" },
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/mercado" className="hover:text-foreground">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {cat.label} em {cid.name}
        </span>
      </nav>

      <div className="mt-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <TrendingUp className="size-3.5" />
          Dados disponíveis — {cid.name}/{cid.state}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          Quanto cobra um {cat.label} em {cid.name}?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Consulte valores disponíveis para {cat.labelPlural.toLowerCase()} em {cid.name}.
          Indicamos quando a amostra vem de propostas aceitas ou de orçamentos de projetos publicados.
        </p>
      </div>

      {temDados ? (
        <>
          <div className="mt-10 rounded-2xl border bg-gradient-to-br from-green-50 to-transparent p-8 text-center dark:from-green-950/40">
            <p className="text-sm font-medium text-muted-foreground">Preço mediano por projeto</p>
            <p className="mt-2 text-5xl font-black tracking-tight text-green-700 dark:text-green-400">
              {formatBrl(mediana)}
            </p>
            {p25 !== null && p75 !== null && (
              <p className="mt-3 text-sm text-muted-foreground">
                Metade dos projetos fica entre{" "}
                <strong className="text-foreground">{formatBrl(p25)}</strong> e{" "}
                <strong className="text-foreground">{formatBrl(p75)}</strong>
              </p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Amostra de {amostra.length} {amostra.length === 1 ? "projeto" : "projetos"} ·{" "}
              {baseadoEmContratos ? "propostas aceitas nos últimos 90 dias" : "orçamentos de projetos abertos na categoria, incluindo outras localidades"}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="mx-auto size-6 text-blue-600" />
                <p className="mt-2 text-2xl font-bold">{totalFreelancers}</p>
                <p className="text-sm text-muted-foreground">
                  Profissionais em {cid.name}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Briefcase className="mx-auto size-6 text-amber-500" />
                <p className="mt-2 text-2xl font-bold">{projetosAbertos}</p>
                <p className="text-sm text-muted-foreground">Projetos abertos na categoria</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="mx-auto size-6 text-green-600" />
                <p className="mt-2 text-2xl font-bold">R$ 0</p>
                <p className="text-sm text-muted-foreground">Comissão retida</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>
              Em plataformas que cobram 20% de comissão, um projeto de {formatBrl(mediana)} deixaria{" "}
              <strong className="text-foreground">{formatBrl(Math.round(mediana * 0.8))}</strong> após essa comissão.
              O PrestaCerto não cobra comissão sobre o serviço. Combine o pagamento diretamente com o cliente. Esta comparação considera apenas a comissão hipotética, sem incluir impostos ou outras taxas.
            </p>
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed p-8 text-center">
          <p className="font-semibold">Ainda coletando dados para {cid.name}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Publicamos a faixa de preço assim que houver amostra suficiente de propostas aceitas de profissionais desta cidade.
            Propostas aceitas não comprovam pagamento pelo serviço.
          </p>
          <LinkButton href="/ferramentas/calculadora" variant="outline" className="mt-5">
            Calcular meu preço enquanto isso
          </LinkButton>
        </div>
      )}

      <section className="mt-14">
        <h2 className="text-xl font-bold">Como esse número é calculado</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Consideramos propostas efetivamente <strong className="text-foreground">aceitas</strong> por clientes
            nos últimos 90 dias, feitas por profissionais com perfil em {cid.name} ,
            na categoria {cat.label.toLowerCase()}.
          </p>
          <p>
            Usamos <strong className="text-foreground">mediana</strong>, não média — um projeto muito caro não
            distorce o número. A faixa entre percentil 25 e 75 mostra onde a maioria realmente está.
          </p>
          <p>
            Quando ainda não há propostas aceitas suficientes, mostramos a faixa de orçamento pedida nos projetos abertos da categoria, que pode incluir outras localidades. Esses orçamentos são valores
            publicados e sinalizamos isso explicitamente. Nunca preenchemos lacuna com estimativa genérica.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-bold">{cat.label} em outras cidades</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(CIDADES)
            .filter(([slug]) => slug !== cidadeSlug)
            .map(([slug, c]) => (
              <Link
                key={slug}
                href={`/mercado/${categoria}/${slug}`}
                className="rounded-full border px-3 py-1.5 text-sm transition hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Outras áreas em {cid.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(CATEGORIAS)
            .filter(([slug]) => slug !== categoria)
            .map(([slug, c]) => (
              <Link
                key={slug}
                href={`/mercado/${slug}/${cidadeSlug}`}
                className="rounded-full border px-3 py-1.5 text-sm transition hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {c.label}
              </Link>
            ))}
        </div>
      </section>

      <div className="mt-16 rounded-2xl bg-slate-900 px-8 py-10 text-center text-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold">
          Cobre o preço certo em {cid.name}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-400">
          Crie seu perfil e encontre projetos de {cat.label.toLowerCase()}. O PrestaCerto não cobra comissão sobre o serviço.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <LinkButton href="/register?role=freelancer" className="gap-2 bg-blue-600 hover:bg-blue-700">
            Criar perfil grátis <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton
            href={`/contratar/${categoria}/${cidadeSlug}`}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            Contratar {cat.label.toLowerCase()}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
