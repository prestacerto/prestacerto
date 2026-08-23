import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const REFERRAL_BONUS = 50; // R$ 50

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { referral_code } = await req.json();
    if (!referral_code) return NextResponse.json({ error: "referral_code required" }, { status: 400 });

    // Buscar quem tem esse código
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", referral_code)
      .neq("id", user.id)
      .single();

    if (!referrer) return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });

    // Dar bônus pro indicador
    await supabase.from("revenue_events").insert({
      user_id: referrer.id,
      event_type: "referral_bonus",
      amount: REFERRAL_BONUS,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      bonus_credited: REFERRAL_BONUS,
      referrer_id: referrer.id,
    });
  } catch (error) {
    console.error("[REFERRAL ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
