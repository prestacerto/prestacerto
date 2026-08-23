import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const PRIORITY_SUPPORT_FEE = 20; // R$ 20/mês
const BILLING_CYCLE = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const priority_support_expires = new Date(Date.now() + BILLING_CYCLE * 24 * 60 * 60 * 1000);

    // Ativar suporte prioritário
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        has_priority_support: true,
        priority_support_expires,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Criar subscription
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      subscription_type: "priority_support",
      price: PRIORITY_SUPPORT_FEE,
      status: "active",
      expires_at: priority_support_expires,
    });

    // Registrar evento
    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "priority_support",
      amount: PRIORITY_SUPPORT_FEE,
      status: "completed",
    });

    return NextResponse.json({
      priority_support: true,
      expires_at: priority_support_expires,
      monthly_fee: PRIORITY_SUPPORT_FEE,
    });
  } catch (error) {
    console.error("[PRIORITY SUPPORT ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
