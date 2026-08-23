import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const PORTFOLIO_PREMIUM_FEE = 10; // R$ 10/mês
const BILLING_CYCLE = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { custom_username } = await req.json();
    if (!custom_username) return NextResponse.json({ error: "custom_username required" }, { status: 400 });

    // Validar que username é único
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("custom_username", custom_username)
      .neq("id", user.id)
      .single();

    if (existing) return NextResponse.json({ error: "Username taken" }, { status: 400 });

    const portfolio_premium_expires = new Date(Date.now() + BILLING_CYCLE * 24 * 60 * 60 * 1000);

    // Ativar portfolio premium
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        has_premium_portfolio: true,
        custom_username,
        portfolio_analytics_active: true,
        portfolio_premium_expires,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Criar subscription
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      subscription_type: "portfolio_premium",
      price: PORTFOLIO_PREMIUM_FEE,
      status: "active",
      expires_at: portfolio_premium_expires,
    });

    // Registrar evento
    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "portfolio_premium",
      amount: PORTFOLIO_PREMIUM_FEE,
      status: "completed",
    });

    return NextResponse.json({
      portfolio_premium: true,
      custom_username,
      portfolio_url: `https://prestacerto.com/${custom_username}`,
      expires_at: portfolio_premium_expires,
      monthly_fee: PORTFOLIO_PREMIUM_FEE,
    });
  } catch (error) {
    console.error("[PORTFOLIO PREMIUM ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
