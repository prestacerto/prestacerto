import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const VERIFIED_BADGE_FEE = 5; // R$ 5/mês
const BILLING_CYCLE = 30; // dias

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const verified_badge_expires = new Date(Date.now() + BILLING_CYCLE * 24 * 60 * 60 * 1000);

    // Ativar badge
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_verified: true,
        verified_badge_active: true,
        verified_badge_expires,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Criar subscription
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      subscription_type: "verified_badge",
      price: VERIFIED_BADGE_FEE,
      status: "active",
      expires_at: verified_badge_expires,
    });

    // Registrar evento
    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "verified_badge",
      amount: VERIFIED_BADGE_FEE,
      status: "completed",
    });

    return NextResponse.json({
      verified: true,
      expires_at: verified_badge_expires,
      monthly_fee: VERIFIED_BADGE_FEE,
    });
  } catch (error) {
    console.error("[VERIFIED BADGE ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
