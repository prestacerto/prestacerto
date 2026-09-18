import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, Receipt, RefreshCcw, Target, TrendingUp, Users } from "lucide-react";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { PaymentBreakdown } from "@/components/admin/payment-breakdown";
import { PlanAnalysis } from "@/components/admin/plan-analysis";
import { loadRevenue } from "@/lib/admin/revenue";
import { createServiceClient } from "@/lib/supabase/service";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Kpi({ icon: Icon, label, value, hint, accent }: { icon: typeof TrendingUp; label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-6 ${accent ? "border-green-800/60 bg-green-900/15" : "border-slate-800 bg-slate-900"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className={`mt-2 text-3xl font-black ${accent ? "text-green-400" : "text-white"}`}>{value}</h3>
        </div>
        <div className="rounded-lg bg-blue-900/30 p-3"><Icon className="text-blue-400" size={24} /></div>
      </div>
      {hint && <p className="mt-3 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function GoalCard({ revenue, goal, label }: { revenue: number; goal: number; label: string }) {
  const pct = goal > 0 ? Math.min(100, (revenue / goal) * 100) : 0;
  return (
    <div className="rounded-2xl border border-blue-800/60 bg-gradient-to-br from-slate-900 to-blue-950 p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-blue-300"><Target size={16} /> Meta do mês · {label}</p>
          <p className="mt-2 text-5xl font-black text-white">{brl(revenue)}</p>
          <p className="mt-1 text-slate-400">de {brl(goal)} <span className="text-xs">(ajuste em ADMIN_MONTHLY_GOAL)</span></p>
        </div>
        <p className="text-6xl font-black text-blue-400">{pct.toFixed(pct < 10 ? 1 : 0)}%</p>
      </div>
      <div className="mt-6 h-5 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all" style={{ width: `${Math.max(pct, revenue > 0 ? 1.5 : 0)}%` }} />
      </div>
    </div>
  );
}

export async function RevenueDashboard({ viewer, briefing, live }: { viewer: string; briefing?: ReactNode; live?: ReactNode }) {
  const [r, freeRes] = await Promise.all([
    loadRevenue(),
    createServiceClient().from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
  ]);
  const freeUsers = freeRes.error ? null : freeRes.count ?? 0;
  const recentDays = [...r.daily].reverse().slice(0, 15);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Painel do dono</Link>
            <h1 className="mt-2 text-4xl font-black">Receita e produtos</h1>
            <p className="mt-1 text-slate-400">Dados reais do ledger de pagamentos (Assiny) e do banco. Sem números de demonstração.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">{viewer}</p>
            {live}
          </div>
        </div>

        {briefing}

        <GoalCard revenue={r.month.revenue} goal={r.goal} label={r.month.label} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Kpi icon={CalendarDays} label="Hoje" value={brl(r.today.revenue)} hint={`${r.today.sales} venda(s)`} />
          <Kpi icon={CalendarDays} label="Últimos 7 dias" value={brl(r.week.revenue)} hint={`${r.week.sales} venda(s)`} />
          <Kpi icon={Receipt} label={`Mês (${r.month.label})`} value={brl(r.month.revenue)} hint={`${r.month.sales} venda(s)`} />
          <Kpi icon={TrendingUp} label="MRR ativo" value={brl(r.mrr)} hint={`${r.activeSubscriptions} assinatura(s) ativa(s)`} accent />
          <Kpi icon={RefreshCcw} label="Reembolsos no mês" value={brl(r.month.refunds)} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2"><RevenueChart daily={r.daily} monthly={r.monthly} hasData={r.hasData} /></div>
          <div><PaymentBreakdown methods={r.methods} /></div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PlanAnalysis byPlan={r.byPlan} mrr={r.mrr} activeSubscriptions={r.activeSubscriptions} freeUsers={freeUsers} />
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-bold">Produtos avulsos</h2>
            <p className="text-sm text-slate-400">
              Os 27 produtos do ecossistema (Match, Preço, Timing, Insights, Templates…) ainda não têm entrega ativa; o webhook registra a compra como
              &ldquo;oferta avulsa&rdquo; e não gera acesso. Este painel passa a listá-los quando cada produto for entregue.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Users size={14} /> Última venda de plano: {r.lastSaleAt ? new Date(r.lastSaleAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "nenhuma ainda"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-bold">Receita diária (últimos 15 dias)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300">
                  <th className="px-4 py-3 text-left font-semibold">Data</th>
                  <th className="px-4 py-3 text-right font-semibold">Vendas</th>
                  <th className="px-4 py-3 text-right font-semibold">Receita</th>
                  <th className="px-4 py-3 text-right font-semibold">Reembolsos</th>
                </tr>
              </thead>
              <tbody>
                {recentDays.map((d) => (
                  <tr key={d.date} className="border-b border-slate-800 text-slate-300 hover:bg-slate-800/50">
                    <td className="px-4 py-3">{d.label}</td>
                    <td className="px-4 py-3 text-right">{d.sales}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${d.revenue > 0 ? "text-green-400" : "text-slate-500"}`}>{brl(d.revenue)}</td>
                    <td className={`px-4 py-3 text-right ${d.refunds > 0 ? "text-red-400" : "text-slate-500"}`}>{brl(d.refunds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
