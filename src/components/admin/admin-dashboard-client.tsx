"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Overview = {
  generatedAt: string;
  range: { days: number; since: string; until: string };
  viewer: { email?: string | null; role: string };
  kpis: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    revenueToday: number;
    revenueWeek: number;
    revenueMonth: number;
    mrr: number;
    arr: number;
    churnRate: number | null;
    paidUsers: number;
    conversionRate: number;
    projects: number | null;
    activeProjects: number | null;
    services: number | null;
    proposals: number | null;
    messages: number | null;
    referrals: number | null;
    certoAiUses: number | null;
    paymentCount: number;
    revenueChange: number;
    revenueTodayChange: number;
    revenueWeekChange: number;
    revenueMonthChange: number;
  };
  revenueBySource: Array<{ source: string; revenue: number }>;
  planBreakdown: Array<{ plan: string; users: number }>;
  series: Array<{ date: string; revenue: number; transactions: number; newUsers: number }>;
  alerts: Array<{ level: string; title: string; detail: string }>;
};

const chartColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

function formatBRL(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("pt-BR");
}

function formatPct(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(" de ", " ");
}

function changeLabel(value: number) {
  if (!Number.isFinite(value)) return "sem base anterior";
  return `${value >= 0 ? "+" : ""}${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change?: number;
  icon: typeof Users;
  tone: string;
}) {
  const positive = change === undefined || change >= 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="size-5" />
        </div>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {changeLabel(change)}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
    </div>
  );
}

function Panel({ title, description, children, className = "" }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.14)] ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-white">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function AdminDashboardClient({ viewer, role }: { viewer: string; role: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/overview?days=${days}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Falha ao carregar painel");
      setData(payload as Overview);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar painel");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const chartData = useMemo(() => data?.series.map((item) => ({ ...item, label: formatDate(item.date) })) ?? [], [data]);
  const sourceData = data?.revenueBySource ?? [];
  const planData = data?.planBreakdown ?? [];

  return (
    <div className="min-h-screen bg-[#070b17] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
              <ShieldCheck className="size-3.5" /> Área privada · {role.replace("_", " ")}
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Centro de comando</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">O painel executivo do PrestaCerto: crescimento, receita, liquidez, retenção e operação em uma única visão.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-xs text-slate-500 lg:inline">{viewer}</span>
            <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 outline-none transition focus:border-blue-400">
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
              <option value={365}>Últimos 12 meses</option>
            </select>
            <button type="button" onClick={() => void loadOverview()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-blue-400/50 hover:bg-blue-500/10 disabled:opacity-50">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div><strong>Não foi possível carregar o painel.</strong><p className="mt-1 text-rose-200/80">{error}</p></div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Usuários totais" value={loading ? "…" : formatNumber(data?.kpis.totalUsers)} change={data?.kpis.newUsers} icon={Users} tone="bg-blue-500/15 text-blue-300" />
          <KpiCard label="Ativos nos últimos 30 dias" value={loading ? "…" : formatNumber(data?.kpis.activeUsers)} icon={Activity} tone="bg-emerald-500/15 text-emerald-300" />
          <KpiCard label="Receita no mês" value={loading ? "…" : formatBRL(data?.kpis.revenueMonth)} change={data?.kpis.revenueMonthChange} icon={CircleDollarSign} tone="bg-violet-500/15 text-violet-300" />
          <KpiCard label="MRR estimado" value={loading ? "…" : formatBRL(data?.kpis.mrr)} icon={WalletCards} tone="bg-amber-500/15 text-amber-300" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Churn no período" value={loading ? "…" : formatPct(data?.kpis.churnRate)} icon={RefreshCw} tone="bg-rose-500/15 text-rose-300" />
          <KpiCard label="Conversão para pago" value={loading ? "…" : formatPct(data?.kpis.conversionRate)} icon={CheckCircle2} tone="bg-cyan-500/15 text-cyan-300" />
          <KpiCard label="Projetos publicados" value={loading ? "…" : formatNumber(data?.kpis.projects)} icon={ShoppingBag} tone="bg-fuchsia-500/15 text-fuchsia-300" />
          <KpiCard label="Uso do Certo AI" value={loading ? "…" : formatNumber(data?.kpis.certoAiUses)} icon={Sparkles} tone="bg-blue-500/15 text-blue-300" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <Panel title="Receita e aquisição" description="Valores agregados da tabela de pagamentos. Receita considera apenas transações concluídas.">
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">Hoje</p><p className="mt-1 font-bold text-white">{formatBRL(data?.kpis.revenueToday)}</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">7 dias</p><p className="mt-1 font-bold text-white">{formatBRL(data?.kpis.revenueWeek)}</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">Pagamentos</p><p className="mt-1 font-bold text-white">{formatNumber(data?.kpis.paymentCount)}</p></div>
            </div>
            <div className="h-[280px] w-full">
              {loading ? <div className="flex h-full items-center justify-center text-sm text-slate-500">Carregando série real…</div> : <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid stroke="#ffffff12" vertical={false} /><XAxis dataKey="label" stroke="#64748b" fontSize={11} minTickGap={28} /><YAxis stroke="#64748b" fontSize={11} tickFormatter={(value) => `R$${value}`} /><Tooltip contentStyle={{ background: "#101827", border: "1px solid #ffffff1a", borderRadius: 12, color: "#fff" }} formatter={(value, name) => [name === "revenue" ? formatBRL(Number(value)) : value, name === "revenue" ? "Receita" : "Transações"]} /><Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#60a5fa" }} /></LineChart></ResponsiveContainer>}
            </div>
          </Panel>

          <Panel title="Receita por origem" description="Distribuição do período selecionado.">
            <div className="h-[280px] w-full">
              {sourceData.length === 0 ? <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">Sem pagamentos concluídos no período.</div> : <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} dataKey="revenue" nameKey="source" innerRadius={60} outerRadius={88} paddingAngle={4}>{sourceData.map((item, index) => <Cell key={item.source} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "#101827", border: "1px solid #ffffff1a", borderRadius: 12, color: "#fff" }} formatter={(value) => formatBRL(Number(value))} /></PieChart></ResponsiveContainer>}
            </div>
            <div className="space-y-2">
              {sourceData.slice(0, 5).map((item, index) => <div key={item.source} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-400"><span className="size-2 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />{item.source}</span><strong className="text-slate-200">{formatBRL(item.revenue)}</strong></div>)}
            </div>
          </Panel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel title="Base pagante" description="Distribuição por plano registrada nos perfis.">
            <div className="space-y-4">
              {planData.map((item, index) => <div key={item.plan}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="capitalize text-slate-300">{item.plan}</span><strong className="text-white">{formatNumber(item.users)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.users / Math.max(1, data?.kpis.totalUsers ?? 1)) * 100)}%`, background: chartColors[index % chartColors.length] }} /></div></div>)}
              {planData.length === 0 && <p className="text-sm text-slate-500">Sem dados de planos.</p>}
            </div>
          </Panel>
          <Panel title="Operação do marketplace" description="Volume acumulado disponível no banco.">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><ShoppingBag className="size-4 text-blue-300" /><p className="mt-3 text-xs text-slate-500">Serviços</p><p className="mt-1 text-xl font-black">{formatNumber(data?.kpis.services)}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><Send className="size-4 text-violet-300" /><p className="mt-3 text-xs text-slate-500">Propostas</p><p className="mt-1 text-xl font-black">{formatNumber(data?.kpis.proposals)}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><MessageSquare className="size-4 text-emerald-300" /><p className="mt-3 text-xs text-slate-500">Mensagens</p><p className="mt-1 text-xl font-black">{formatNumber(data?.kpis.messages)}</p></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><Users className="size-4 text-amber-300" /><p className="mt-3 text-xs text-slate-500">Indicações</p><p className="mt-1 text-xl font-black">{formatNumber(data?.kpis.referrals)}</p></div>
            </div>
          </Panel>
          <Panel title="Alertas executivos" description="Sinais que merecem decisão ou investigação.">
            <div className="space-y-3">
              {(data?.alerts ?? []).map((alert) => <div key={`${alert.title}-${alert.detail}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><AlertTriangle className={`mt-0.5 size-4 shrink-0 ${alert.level === "warning" ? "text-amber-300" : "text-blue-300"}`} /><div><p className="text-sm font-bold text-slate-200">{alert.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{alert.detail}</p></div></div>)}
              {!loading && (data?.alerts.length ?? 0) === 0 && <div className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" /><p className="text-sm text-emerald-200">Nenhum alerta crítico no período.</p></div>}
              {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Clock3 className="size-4" /> Analisando sinais…</div>}
            </div>
          </Panel>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2"><LayoutDashboard className="size-3.5" /> Dados privados do PrestaCerto</span>
          <span>{data ? `Atualizado em ${new Date(data.generatedAt).toLocaleString("pt-BR")}` : "Aguardando dados"}</span>
        </footer>
      </div>
    </div>
  );
}
