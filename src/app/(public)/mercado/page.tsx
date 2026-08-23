import type { Metadata } from "next";
import { TrendingUp, Briefcase, DollarSign, Zap } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Quanto ganha um freelancer no Brasil? | PrestaCerto",
  description:
    "Dados reais de projetos e contratos da PrestaCerto: preços médios por categoria, skills em demanda e tendências do mercado freelancer brasileiro.",
  openGraph: {
    title: "Mercado Freelancer Brasil — Dados Reais | PrestaCerto",
    description: "Preços médios, skills em demanda e tendências do mercado freelancer. Baseado em projetos reais.",
  },
};

async function getMarketData() {
  const db = createServiceClient();

  const [{ data: categories }, { data: openProjects }, { data: budgets }, { data: acceptedProposals }] =
    await Promise.all([
      db.from("categories").select("id, name, slug").order("sort_order"),
      db.from("projects").select("category_id, skills").eq("status", "open").not("category_id", "is", null),
      db.from("projects").select("category_id, budget_min, budget_max").eq("status", "open").not("category_id", "is", null).not("budget_min", "is", null).not("budget_max", "is", null),
      db.from("proposals").select("proposed_price, projects!inner(category_id)").eq("status", "accepted").gt("proposed_price", 0).gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

  const openCountByCategory: Record<number, number> = {};
  const skillCount: Record<string, number> = {};

  for (const p of openProjects ?? []) {
    if (p.category_id) openCountByCategory[p.category_id] = (openCountByCategory[p.category_id] ?? 0) + 1;
    for (const s of p.skills ?? []) skillCount[s] = (skillCount[s] ?? 0) + 1;
  }

  const budgetByCategory: Record<number, number[]> = {};
  for (const p of budgets ?? []) {
    if (p.category_id && p.budget_min != null && p.budget_max != null) {
      const mid = (p.budget_min + p.budget_max) / 2;
      if (!budgetByCategory[p.category_id]) budgetByCategory[p.category_id] = [];
      budgetByCategory[p.category_id].push(mid);
    }
  }

  const acceptedByCategory: Record<number, number[]> = {};
  for (const p of acceptedProposals ?? []) {
    const catId = ((p.projects as unknown) as { category_id: number | null } | null)?.category_id;
    if (catId && p.proposed_price) {
      if (!acceptedByCategory[catId]) acceptedByCategory[catId] = [];
      acceptedByCategory[catId].push(p.proposed_price);
    }
  }

  const stats = (categories ?? [])
    .map((cat) => {
      const bs = budgetByCategory[cat.id] ?? [];
      const ac = acceptedByCategory[cat.id] ?? [];
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        openProjects: openCountByCategory[cat.id] ?? 0,
        avgBudget: bs.length ? Math.round(bs.reduce((a, b) => a + b) / bs.length) : null,
        avgAccepted: ac.length ? Math.round(ac.reduce((a, b) => a + b) / ac.length) : null,
      };
    })
    .filter((s) => s.openProjects > 0 || s.avgAccepted);

  const trendingSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([skill, count]) => ({ skill, count }));
  const totalOpen = openProjects?.length ?? 0;

  return { stats, trendingSkills, totalOpen };
}

function formatBrl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default async function MercadoPublicPage() {
  const { stats, trendingSkills, totalOpen } = await getMarketData();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <TrendingUp className="size-3.5" />
          Dados reais da plataforma
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Quanto ganha um freelancer no Brasil?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Preços reais de projetos contratados e abertos na PrestaCerto — sem estimativa, sem pesquisa patrocinada.
          Atualizado a cada hora.
        </p>
      </div>

      {/* Cards de destaque */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <Briefcase className="mx-auto size-7 text-blue-600" />
            <p className="mt-2 text-3xl font-bold">{totalOpen}</p>
            <p className="text-sm text-muted-foreground">Projetos abertos agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="mx-auto size-7 text-amber-500" />
            <p className="mt-2 text-xl font-bold">{trendingSkills[0]?.skill ?? "—"}</p>
            <p className="text-sm text-muted-foreground">Skill mais pedida</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="mx-auto size-7 text-green-600" />
            <p className="mt-2 text-xl font-bold">
              {stats[0]?.avgAccepted ? formatBrl(stats[0].avgAccepted) : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Preço médio aceito ({stats[0]?.name ?? ""})</p>
          </CardContent>
        </Card>
      </div>

      {/* Por categoria */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Preços por categoria</h2>
        <p className="mt-1 text-sm text-muted-foreground">Baseado em propostas aceitas nos últimos 90 dias e orçamentos de projetos abertos.</p>

        {stats.length === 0 ? (
          <p className="mt-6 text-slate-500">Ainda sem dados suficientes — volte em breve.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.map((cat) => (
              <Card key={cat.id}>
                <CardHeader className="pb-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{cat.name}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projetos abertos</span>
                    <span className="font-semibold">{cat.openProjects}</span>
                  </div>
                  {cat.avgBudget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orçamento médio pedido</span>
                      <span className="font-semibold">{formatBrl(cat.avgBudget)}</span>
                    </div>
                  )}
                  {cat.avgAccepted ? (
                    <div className="flex justify-between rounded-lg bg-green-50 px-3 py-2 text-sm dark:bg-green-950">
                      <span className="text-green-800 dark:text-green-300">Preço aceito médio</span>
                      <span className="font-bold text-green-900 dark:text-green-200">{formatBrl(cat.avgAccepted)}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem dados de preço aceito ainda.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Skills em tendência */}
      {trendingSkills.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Skills mais pedidas agora</h2>
          <p className="mt-1 text-sm text-muted-foreground">Frequência de aparição em projetos abertos na plataforma.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {trendingSkills.map(({ skill, count }, i) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                style={{ opacity: Math.max(0.4, 1 - i * 0.05) }}
              >
                <span className="font-medium">{skill}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-slate-900 px-8 py-10 text-center text-white dark:bg-slate-800">
        <h2 className="text-xl font-bold">Quer trabalhar com o que está em demanda?</h2>
        <p className="mt-2 text-slate-400">Cadastre-se e receba projetos compatíveis com suas skills — sem comissão.</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <LinkButton href="/register?role=freelancer" className="bg-blue-600 hover:bg-blue-700">
            Quero ser freelancer →
          </LinkButton>
          <LinkButton href="/register?role=client" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            Quero contratar →
          </LinkButton>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Dados baseados em projetos reais da PrestaCerto. Atualizado a cada hora. Quanto mais projetos na plataforma, mais precisos ficam os dados.
      </p>
    </div>
  );
}
