import 'server-only';
import { createServiceClient } from '@/lib/supabase/service';

export const PLAN_PRICE: Record<'pro' | 'business', number> = { pro: 59.9, business: 99.9 };
const PLAN_LABEL: Record<'pro' | 'business', string> = { pro: 'Pro', business: 'Business' };
const ACTIVE = new Set(['approved_purchase']);
const REFUND = new Set(['refunded_purchase', 'charged_back']);
const TZ = 'America/Sao_Paulo';

type LedgerRow = { event_id: string; event_type: string; plan: 'pro' | 'business'; occurred_at: string; outcome: string };
type PaymentRow = { event_id: string; event_type: string; amount_cents: number; payment_method: string | null; plan: 'pro' | 'business'; occurred_at: string };

const dayKey = (iso: string) => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
const monthKey = (iso: string) => dayKey(iso).slice(0, 7);

function todayKey() { return dayKey(new Date().toISOString()); }
function shiftDay(key: string, days: number) {
  const d = new Date(`${key}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type RevenueSnapshot = {
  hasData: boolean;
  goal: number;
  month: { revenue: number; refunds: number; sales: number; label: string };
  today: { revenue: number; sales: number };
  week: { revenue: number; sales: number };
  daily: { date: string; label: string; revenue: number; sales: number; refunds: number }[];
  monthly: { month: string; label: string; revenue: number; sales: number }[];
  byPlan: { plan: 'pro' | 'business'; label: string; sales: number; revenue: number; active: number; price: number }[];
  mrr: number;
  activeSubscriptions: number;
  methods: { method: string; amount: number; count: number }[] | null;
  lastSaleAt: string | null;
};

export async function loadRevenue(): Promise<RevenueSnapshot> {
  const db = createServiceClient();
  const since = new Date(); since.setUTCDate(since.getUTCDate() - 400);

  const [eventsRes, subsRes, paymentsRes] = await Promise.all([
    db.from('assiny_events').select('event_id,event_type,plan,occurred_at,outcome').eq('mode', 'live').gte('occurred_at', since.toISOString()).order('occurred_at', { ascending: true }).limit(20000),
    db.from('assiny_subscriptions').select('plan,active').eq('mode', 'live').eq('active', true),
    db.from('assiny_payments').select('event_id,event_type,amount_cents,payment_method,plan,occurred_at').eq('mode', 'live').gte('occurred_at', since.toISOString()).limit(20000),
  ]);

  const events = (eventsRes.error ? [] : (eventsRes.data ?? [])) as LedgerRow[];
  const payments = paymentsRes.error ? null : ((paymentsRes.data ?? []) as PaymentRow[]);
  const activeSubs = subsRes.error ? [] : (subsRes.data ?? []) as { plan: 'pro' | 'business' }[];
  if (eventsRes.error) console.warn("[REVENUE] assiny_events query failed", eventsRes.error);
  if (subsRes.error) console.warn("[REVENUE] assiny_subscriptions query failed", subsRes.error);
  if (paymentsRes.error) console.warn("[REVENUE] assiny_payments query failed", paymentsRes.error);

  // Valor real quando a tabela de pagamentos existir; senão, preço de tabela do plano.
  const amountByEvent = new Map<string, number>();
  for (const p of payments ?? []) amountByEvent.set(p.event_id, p.amount_cents / 100);
  const valueOf = (e: LedgerRow) => amountByEvent.get(e.event_id) ?? PLAN_PRICE[e.plan];

  const sales = events.filter((e) => ACTIVE.has(e.event_type) && e.outcome !== 'conflict');
  const refunds = events.filter((e) => REFUND.has(e.event_type) && e.outcome !== 'conflict');

  const today = todayKey();
  const weekStart = shiftDay(today, -6);
  const thisMonth = today.slice(0, 7);

  const dailyMap = new Map<string, { revenue: number; sales: number; refunds: number }>();
  for (let i = 29; i >= 0; i--) dailyMap.set(shiftDay(today, -i), { revenue: 0, sales: 0, refunds: 0 });
  for (const e of sales) { const k = dayKey(e.occurred_at); const d = dailyMap.get(k); if (d) { d.revenue += valueOf(e); d.sales += 1; } }
  for (const e of refunds) { const k = dayKey(e.occurred_at); const d = dailyMap.get(k); if (d) { d.refunds += valueOf(e); } }

  const monthlyMap = new Map<string, { revenue: number; sales: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(`${today}T12:00:00Z`); d.setUTCMonth(d.getUTCMonth() - i, 1);
    monthlyMap.set(d.toISOString().slice(0, 7), { revenue: 0, sales: 0 });
  }
  for (const e of sales) { const m = monthlyMap.get(monthKey(e.occurred_at)); if (m) { m.revenue += valueOf(e); m.sales += 1; } }

  const byPlan = (['pro', 'business'] as const).map((plan) => {
    const rows = sales.filter((e) => e.plan === plan);
    return { plan, label: PLAN_LABEL[plan], sales: rows.length, revenue: rows.reduce((s, e) => s + valueOf(e), 0), active: activeSubs.filter((s) => s.plan === plan).length, price: PLAN_PRICE[plan] };
  });

  const monthSales = sales.filter((e) => monthKey(e.occurred_at) === thisMonth);
  const monthRefunds = refunds.filter((e) => monthKey(e.occurred_at) === thisMonth);
  const todaySales = sales.filter((e) => dayKey(e.occurred_at) === today);
  const weekSales = sales.filter((e) => dayKey(e.occurred_at) >= weekStart);

  const methods = payments === null ? null : Object.values(
    payments.filter((p) => ACTIVE.has(p.event_type)).reduce<Record<string, { method: string; amount: number; count: number }>>((acc, p) => {
      const m = normalizeMethod(p.payment_method);
      acc[m] ??= { method: m, amount: 0, count: 0 };
      acc[m].amount += p.amount_cents / 100; acc[m].count += 1;
      return acc;
    }, {}),
  ).sort((a, b) => b.amount - a.amount);

  const fmtDay = (k: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(`${k}T12:00:00Z`)).replace('.', '');
  const fmtMonth = (k: string) => new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(`${k}-15T12:00:00Z`)).replace('.', '');

  return {
    hasData: sales.length > 0,
    goal: Number(process.env.ADMIN_MONTHLY_GOAL ?? 300000),
    month: { revenue: sum(monthSales.map(valueOf)), refunds: sum(monthRefunds.map(valueOf)), sales: monthSales.length, label: fmtMonth(thisMonth) },
    today: { revenue: sum(todaySales.map(valueOf)), sales: todaySales.length },
    week: { revenue: sum(weekSales.map(valueOf)), sales: weekSales.length },
    daily: [...dailyMap.entries()].map(([date, v]) => ({ date, label: fmtDay(date), ...v })),
    monthly: [...monthlyMap.entries()].map(([month, v]) => ({ month, label: fmtMonth(month), ...v })),
    byPlan,
    mrr: byPlan.reduce((s, p) => s + p.active * p.price, 0),
    activeSubscriptions: activeSubs.length,
    methods,
    lastSaleAt: sales.at(-1)?.occurred_at ?? null,
  };
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

function normalizeMethod(raw: string | null) {
  const m = (raw ?? '').toLowerCase();
  if (m.includes('pix')) return 'PIX';
  if (m.includes('card') || m.includes('cart') || m.includes('credit')) return 'Cartão';
  if (m.includes('boleto') || m.includes('slip')) return 'Boleto';
  return raw ? raw : 'Não informado';
}
