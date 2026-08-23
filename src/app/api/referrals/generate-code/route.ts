import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PREST${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing } = await supabase
      .from("referral_codes")
      .select("code, created_at, clicks, conversions")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (existing) {
      return NextResponse.json({
        code: existing.code,
        created_at: existing.created_at,
        clicks: existing.clicks || 0,
        conversions: existing.conversions || 0,
        is_new: false,
        referral_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://simaveiculos.grok.me"}/?ref=${existing.code}`,
      });
    }

    const code = generateReferralCode();
    const { data: newCode, error } = await supabase
      .from("referral_codes")
      .insert({
        user_id: user.id,
        code,
        status: "active",
        clicks: 0,
        conversions: 0,
      })
      .select("code, created_at")
      .single();

    if (error || !newCode) throw error;

    return NextResponse.json({
      code: newCode.code,
      created_at: newCode.created_at,
      is_new: true,
      clicks: 0,
      conversions: 0,
      referral_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://simaveiculos.grok.me"}/?ref=${newCode.code}`,
      potential_earnings: {
        per_freelancer: 50,
        per_client: 200,
        lifetime_percentage: 0.1,
      },
    });
  } catch (error) {
    console.error("[REFERRAL CODE GENERATION ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate referral code" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: code } = await supabase
      .from("referral_codes")
      .select("code, created_at, clicks, conversions")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!code) {
      return NextResponse.json({
        code: null,
        created_at: null,
        clicks: 0,
        conversions: 0,
        has_code: false,
      });
    }

    return NextResponse.json({
      code: code.code,
      created_at: code.created_at,
      clicks: code.clicks || 0,
      conversions: code.conversions || 0,
      has_code: true,
      referral_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://simaveiculos.grok.me"}/?ref=${code.code}`,
      potential_earnings: {
        per_freelancer: 50,
        per_client: 200,
        lifetime_percentage: 0.1,
      },
    });
  } catch (error) {
    console.error("[REFERRAL CODE FETCH ERROR]", error);
    return NextResponse.json({
      code: null,
      created_at: null,
      clicks: 0,
      conversions: 0,
      has_code: false,
    });
  }
}
