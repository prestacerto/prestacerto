import { NextRequest, NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

type PaymentRow = {
  amount: number | string | null;
  item_type: string | null;
  status: string | null;
  created_at: string | null;
};

type ProfileRow = {
  id: string;
  plan: string | null;
  created_at: string | null;
};

type EventRow = {
  type: string | null;
  plan_id: string | null;
  created_at: string | null;
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function amount(value: PaymentRow["amount"]) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function periodStart(now: Date, kind: "today" | "week" | "month") {
  const start = new Date(now);
  if (kind === "today") start.setUTCHours(0, 0, 0, 0);
  if (kind === "week") start.setTime(now.getTime() - 7 * DAY_MS);
  if (kind === "month") start.setUTCDate(1), start.setUTCHours(0, 0, 0, 0);
  return start;
}

function sumBetween(rows: PaymentRow[], start: Date, end: Date) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return rows.reduce((total, row) => {
    const created = row.created_at ? new Date(row.created_at).getTime() : 0;
    return created >= startMs && created < endMs ? total + amount(row.amount) : total;
  }, 0);
}

function countBetween<T extends { created_at: string | null }>(rows: T[], start: Date, end: Date) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return rows.filter((row) => {
    const created = row.created_at ? new Date(row.created_at).getTime() : 0;
    return created >= startMs && created < endMs;
  }).length;
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function safeCount(service: ReturnType<typeof createServiceClient>, table: string) {
  try {
    const { count, error } = await service.from(table).select("id", { count: "exact", head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

async function listAllAuthUsers(service: ReturnType<typeof createServiceClient>) {
  const users: Array<{ id: string; email?: string; created_at?: string; last_sign_in_at?: string }> = [];
  let page = 1;

  while (page <= 20) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    users.push(...data.users.map((user) => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? undefined,
    })));
    if (data.users.length < 1000) break;
    page += 1;
  }

  return users;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const requestedDays = Number(new URL(request.url).searchParams.get("days") ?? 30);
  const days = [7, 30, 90, 365].includes(requestedDays) ? requestedDays : 30;
  const now = new Date();
  const since = new Date(now.getTime() - days * DAY_MS);
  const previousSince = new Date(since.getTime() - days * DAY_MS);
  const service = createServiceClient();

  try {
    const [users, profileResult, paymentsResult, eventsResult, counts] = await Promise.all([
      listAllAuthUsers(service),
      service.from("profiles").select("id, plan, created_at").gte("created_at", previousSince.toISOString()).limit(20000),
      service.from("payment_transactions").select("amount, item_type, status, created_at").in("status", ["completed", "refunded"]).gte("created_at", previousSince.toISOString()).order("created_at", { ascending: true }).limit(20000),
      service.from("monetization_events").select("type, plan_id, created_at").gte("created_at", previousSince.toISOString()).order("created_at", { ascending: true }).limit(20000),
      Promise.all([
        safeCount(service, "profiles"),
        safeCount(service, "projects"),
        safeCount(service, "services"),
        safeCount(service, "proposals"),
        safeCount(service, "messages"),
        safeCount(service, "referrals"),
        safeCount(service, "certo_ai_usage"),
      ]),
    ]);

    const profiles = (profileResult.data ?? []) as ProfileRow[];
    const payments = (paymentsResult.data ?? []) as PaymentRow[];
    const events = (eventsResult.data ?? []) as EventRow[];
    const paidPayments = payments.filter((payment) => payment.status === "completed");
    const paidProfiles = profiles.filter((profile) => profile.plan && profile.plan !== "free");
    const activeSince = new Date(now.getTime() - 30 * DAY_MS).getTime();
    const activeUsers = users.filter((user) => {
      const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0;
      return lastSignIn >= activeSince;
    }).length;

    const todayStart = periodStart(now, "today");
    const weekStart = periodStart(now, "week");
    const monthStart = periodStart(now, "month");
    const priorTodayStart = new Date(todayStart.getTime() - DAY_MS);
    const priorWeekStart = new Date(weekStart.getTime() - 7 * DAY_MS);
    const priorMonthStart = new Date(monthStart);
    priorMonthStart.setUTCMonth(priorMonthStart.getUTCMonth() - 1);

    const revenueToday = sumBetween(paidPayments, todayStart, now);
    const revenueWeek = sumBetween(paidPayments, weekStart, now);
    const revenueMonth = sumBetween(paidPayments, monthStart, now);
    const mrr = paidProfiles.reduce((total, profile) => {
      if (profile.plan === "business") return total + 129;
      if (profile.plan === "pro") return total + 49;
      if (profile.plan === "starter") return total + 14.9;
      return total;
    }, 0);

    const revenueBySource = paidPayments.reduce<Record<string, number>>((result, payment) => {
      const key = payment.item_type || "outros";
      result[key] = (result[key] ?? 0) + amount(payment.amount);
      return result;
    }, {});

    const series = Array.from({ length: days }, (_, index) => {
      const date = new Date(since.getTime() + index * DAY_MS);
      const next = new Date(date.getTime() + DAY_MS);
      return {
        date: isoDate(date),
        revenue: sumBetween(paidPayments, date, next),
        transactions: countBetween(paidPayments, date, next),
        newUsers: countBetween(profiles, date, next),
      };
    });

    const planBreakdown = paidProfiles.reduce<Record<string, number>>((result, profile) => {
      const key = profile.plan || "free";
      result[key] = (result[key] ?? 0) + 1;
      return result;
    }, { free: profiles.filter((profile) => !profile.plan || profile.plan === "free").length });

    const expiredEvents = events.filter((event) => event.type === "plan_expired");
    const activatedEvents = events.filter((event) => event.type === "plan_activated");
    const paidBaseAtStart = Math.max(paidProfiles.length - activatedEvents.length + expiredEvents.length, 0);
    const churnRate = paidBaseAtStart > 0 ? (expiredEvents.length / paidBaseAtStart) * 100 : null;
    const currentPeriodPayments = paidPayments.filter((payment) => payment.created_at && new Date(payment.created_at) >= since);
    const previousPeriodPayments = paidPayments.filter((payment) => payment.created_at && new Date(payment.created_at) >= previousSince && new Date(payment.created_at) < since);

    return NextResponse.json({
      generatedAt: now.toISOString(),
      range: { days, since: since.toISOString(), until: now.toISOString() },
      viewer: { email: admin.user.email, role: admin.role },
      kpis: {
        totalUsers: users.length,
        activeUsers,
        newUsers: countBetween(profiles, since, now),
        revenueToday,
        revenueWeek,
        revenueMonth,
        mrr,
        arr: mrr * 12,
        churnRate,
        paidUsers: paidProfiles.length,
        conversionRate: users.length > 0 ? (paidProfiles.length / users.length) * 100 : 0,
        projects: counts[1],
        activeProjects: null,
        services: counts[2],
        proposals: counts[3],
        messages: counts[4],
        referrals: counts[5],
        certoAiUses: counts[6],
        paymentCount: currentPeriodPayments.length,
        revenueChange: percentageChange(sumBetween(currentPeriodPayments, since, now), sumBetween(previousPeriodPayments, previousSince, since)),
        revenueTodayChange: percentageChange(revenueToday, sumBetween(paidPayments, priorTodayStart, todayStart)),
        revenueWeekChange: percentageChange(revenueWeek, sumBetween(paidPayments, priorWeekStart, weekStart)),
        revenueMonthChange: percentageChange(revenueMonth, sumBetween(paidPayments, priorMonthStart, monthStart)),
      },
      revenueBySource: Object.entries(revenueBySource).map(([source, revenue]) => ({ source, revenue })),
      planBreakdown: Object.entries(planBreakdown).map(([plan, usersCount]) => ({ plan, users: usersCount })),
      series,
      alerts: [
        ...(churnRate !== null && churnRate > 8 ? [{ level: "warning", title: "Churn acima do limite", detail: `${churnRate.toFixed(1)}% no período selecionado.` }] : []),
        ...(counts[1] !== null && counts[3] === 0 ? [{ level: "info", title: "Projetos sem propostas", detail: "Revise a liquidez do marketplace e os alertas de matching." }] : []),
        ...(paymentsResult.error ? [{ level: "warning", title: "Receita indisponível", detail: "A tabela payment_transactions não respondeu; os KPIs financeiros ficaram zerados." }] : []),
      ],
    });
  } catch (error) {
    console.error("[admin-overview] Falha ao agregar métricas:", error);
    return NextResponse.json({ error: "Não foi possível carregar as métricas agora." }, { status: 500 });
  }
}
