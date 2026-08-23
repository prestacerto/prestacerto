import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: refCode } = await supabase
      .from("referral_codes")
      .select("code, clicks, conversions, created_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!refCode) {
      return NextResponse.json({
        total_clicks: 0,
        total_conversions: 0,
        conversion_rate: 0,
        estimated_earnings: 0,
        referrals: [],
      });
    }

    const { data: referrals } = await supabase
      .from("referral_conversions")
      .select("id, referred_user_id, created_at, bonus_amount, status")
      .eq("referrer_id", user.id)
      .eq("status", "completed");

    const totalEarnings = (referrals || []).reduce(
      (sum, ref) => sum + (ref.bonus_amount || 50),
      0
    );

    return NextResponse.json({
      total_clicks: refCode.clicks || 0,
      total_conversions: refCode.conversions || (referrals || []).length,
      conversion_rate:
        (refCode.clicks || 0) > 0
          ? (((refCode.conversions || (referrals || []).length) / (refCode.clicks || 1)) * 100).toFixed(2)
          : "0.00",
      estimated_earnings: totalEarnings,
      referrals: (referrals || []).map((ref) => ({
        id: ref.id,
        referred_user_id: ref.referred_user_id,
        created_at: ref.created_at,
        bonus_amount: ref.bonus_amount || 50,
        status: ref.status,
      })),
      code: refCode.code,
    });
  } catch (error) {
    console.error("[REFERRAL STATS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
