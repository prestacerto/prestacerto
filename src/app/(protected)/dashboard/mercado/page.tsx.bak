import { TrendingUp, Briefcase, DollarSign, Zap } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Dados de mercado ficam frescos por 1 hora — consultas agregadas pesadas
export const revalidate = 3600;

interface CategoryStat {
  id: number;
  name: string;
  openProjects: number;
  avgBudget: number | null;
  avgAcceptedPrice: number | null;
}

async function getMarketData() {
  const db = createServiceClient();

  const [
    { data: categories },
    { data: openProjects },
    { data: budgets },
    { data: acceptedProposals },
    { data: allOpenProjects },
  ] = await Promise.all([
    db.from("categories").select("id, name").order("sort_order"),

    // Contagem de projetos abertos por categoria
    db
      .from("projects")
      .select("category_id")
      .eq("status", "open")
      .not("category_id", "is", null),

    // Orçamentos médios por categoria (projetos abertos com budget definido)
    db
      .from("projects")
      .select("category_id, budget_min, budget_max")
      .eq("status", "open")
      .not("category_id", "is", null)
      .not("budget_min", "is", null)
      .not("budget_max", "is", null),

    // Preço médio aceito por categoria (últimos 90 dias)
    db
      .from("proposals")
      .select("proposed_price, projects!inner(category_id, status)")
      .eq("status", "accepted")
      .gt("proposed_price", 0)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),

    // Skills de projetos abertos pra calcular tendências
    db.from("projects").select("skills").eq("status", "open").not("skills", "is", null),
  ]);

  // Agrega contagem por categoria
  const openCountByCategory: Record<number, number> = {};
  for (const p of openProjects ?? []) {
    if (p.category_id) openCountByCategory[p.category_id] = (openCountByCategory[p.category_id] ?? 0) + 1;
  }

  // Agrega orçamento médio por categoria
  const budgetByCategory: Record<number, number[]> = {};
  for (const p of budgets ?? []) {
    if (p.category_id && p.budget_min != null && p.budget_max != null) {
      const mid = (p.budget_min + p.budget_max) / 2;
      if (!budgetByCategory[p.category_id]) budgetByCategory[p.category_id] = [];
      budgetByCategory[p.category_id].push(mid);
    }
  }

  // Agrega preço aceito médio por categoria
  const acceptedByCategory: Record<number, number[]> = {};
  for (const p of acceptedProposals ?? []) {
    const proj = (p.projects as unknown) as { category_id: number | null } | null;
    const catId = proj?.category_id;
    if (catId && p.proposed_price) {
      if (!acceptedByCategory[catId]) acceptedByCategory[catId] = [];
      acceptedByCategory[catId].push(p.proposed_price);
    }
  }

  const stats: CategoryStat[] = (categories ?? []).map((cat) => {
    const budgets = budgetByCategory[cat.id] ?? [];
    const accepted = acceptedByCategory[cat.id] ?? [];
    return {
      id: cat.id,
      name: cat.name,
      openProjects: openCountByCategory[cat.id] ?? 0,
      avgBudget: budgets.length ? Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length) : null,
      avgAcceptedPrice: accepted.length ? Math.round(accepted.reduce((a, b) => a + b, 0) / accepted.length) : null,
    };
  });

  // Top skills em demanda
  const skillCount: Record<string, number> = {};
  for (const p of allOpenProjects ?? []) {
    for (const skill of p.skills ?? []) {
      skillCount[skill] = (skillCount[skill] ?? 0) + 1;
    }
  }
  const trendingSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([skill, count]) => ({ skill, count }));

  const totalOpen = openProjects?.length ?? 0;

  return { stats: stats.filter((s) => s.openProjects > 0), trendingSkills, totalOpen };
}

function formatBrl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default async function MercadoPage() {
  const { stats, trendingSkills, totalOpen } = await getMarketData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="size-5 text-blue-600" />
          Dados de mercado
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Baseado em projetos reais da plataforma — atualizado a cada hora.
        </p>
      </div>

      {/* Resumo geral */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Briefcase className="size-8 text-blue-600 shrink-0" />
            <div>
              <p className="text-3xl font-bold">{totalOpen}</p>
              <p className="text-sm text-muted-foreground">Projetos abertos agora</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Zap className="size-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-3xl font-bold">{trendingSkills[0]?.skill ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Skill mais pedida esta semana</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Por categoria */}
      <div>
        <h2 className="mb-4 font-semibold">Por categoria</h2>
        {stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ainda sem dados suficientes.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((cat) => (
              <Card key={cat.id}>
                <CardHeader className="pb-2">
                  <p className="font-semibold">{cat.name}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Briefcase className="size-3.5" />
                      Projetos abertos
                    </span>
                    <span className="font-semibold">{cat.openProjects}</span>
                  </div>

                  {cat.avgBudget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <DollarSign className="size-3.5" />
                        Orçamento médio pedido
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatBrl(cat.avgBudget)}
                      </span>
                    </div>
                  )}

                  {cat.avgAcceptedPrice && (
                    <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm dark:bg-green-950">
                      <span className="text-green-800 dark:text-green-300">Preço aceito médio</span>
                      <span className="font-bold text-green-900 dark:text-green-200">
                        {formatBrl(cat.avgAcceptedPrice)}
                      </span>
                    </div>
                  )}

                  {!cat.avgAcceptedPrice && (
                    <p className="text-xs text-muted-foreground">
                      Sem dados de preço aceito ainda nesta categoria.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Skills em tendência */}
      {trendingSkills.length > 0 && (
        <div>
          <h2 className="mb-4 font-semibold">Skills mais pedidas em projetos abertos</h2>
          <div className="flex flex-wrap gap-2">
            {trendingSkills.map(({ skill, count }, i) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                style={{ opacity: 1 - i * 0.06 }}
              >
                <span className="font-medium">{skill}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Dados baseados em projetos reais publicados na PrestaCerto. Preços aceitos refletem os
        últimos 90 dias. Quanto mais projetos na plataforma, mais precisos ficam os dados.
      </p>
    </div>
  );
}
