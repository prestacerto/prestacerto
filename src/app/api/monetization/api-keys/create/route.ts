import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { randomBytes } from "crypto";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const PLAN_PRICING: Record<string, { fee: number; limit: number }> = {
  free: { fee: 0, limit: 1000 },
  starter: { fee: 99, limit: 50000 },
  pro: { fee: 299, limit: 500000 },
  enterprise: { fee: 999, limit: 10000000 },
};

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key_name, plan = "free" } = await req.json();
    if (!key_name) return NextResponse.json({ error: "key_name required" }, { status: 400 });

    const pricing = PLAN_PRICING[plan] || PLAN_PRICING.free;
    const secret_key = `pk_live_${randomBytes(32).toString("hex")}`;
    const subscription_expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Criar API key
    const { data: apiKey, error: keyError } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key_name,
        secret_key,
        plan,
        request_limit: pricing.limit,
        subscription_expires: plan === "free" ? null : subscription_expires,
      })
      .select("id, key_name, plan, request_limit")
      .single();

    if (keyError) throw keyError;

    // Se plan pago, criar subscription
    if (plan !== "free") {
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        subscription_type: `api_${plan}`,
        price: pricing.fee,
        status: "active",
        expires_at: subscription_expires,
      });

      // Registrar evento
      await supabase.from("revenue_events").insert({
        user_id: user.id,
        event_type: "api_plan",
        amount: pricing.fee,
        status: "completed",
      });
    }

    return NextResponse.json(
      {
        id: apiKey.id,
        key_name: apiKey.key_name,
        secret_key, // Mostrar só uma vez!
        plan: apiKey.plan,
        monthly_fee: pricing.fee,
        request_limit: apiKey.request_limit,
        message: "⚠️ Copy your secret key now. You won't see it again.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API KEY ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
