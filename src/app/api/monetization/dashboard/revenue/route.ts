import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Total de hoje
    const today = new Date().toISOString().split("T")[0];
    const { data: todayEvents } = await supabase
      .from("revenue_events")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("created_at", `${today}T00:00:00`);

    const todayRevenue = (todayEvents || []).reduce((sum, e) => sum + (e.amount || 0), 0);

    // Total do mês
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split("T")[0];
    const { data: monthEvents } = await supabase
      .from("revenue_events")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("created_at", `${monthStartStr}T00:00:00`);

    const monthRevenue = (monthEvents || []).reduce((sum, e) => sum + (e.amount || 0), 0);

    // Total histórico
    const { data: allEvents } = await supabase
      .from("revenue_events")
      .select("amount")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const totalRevenue = (allEvents || []).reduce((sum, e) => sum + (e.amount || 0), 0);

    // Breakdown por tipo
    const { data: breakdown } = await supabase
      .from("revenue_events")
      .select("event_type, amount")
      .eq("user_id", user.id)
      .eq("status", "completed");

    const byType = (breakdown || []).reduce((acc, e) => {
      const key = e.event_type || "other";
      acc[key] = (acc[key] || 0) + (e.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      today: todayRevenue,
      month: monthRevenue,
      total: totalRevenue,
      breakdown: byType,
      currency: "BRL",
    });
  } catch (error) {
    console.error("[REVENUE DASHBOARD ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
