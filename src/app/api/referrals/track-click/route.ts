import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { referral_code } = await req.json();

    if (!referral_code) {
      return NextResponse.json(
        { error: "referral_code required" },
        { status: 400 }
      );
    }

    const { data: code } = await supabase
      .from("referral_codes")
      .select("id, clicks")
      .eq("code", referral_code)
      .single();

    if (!code) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    await supabase
      .from("referral_codes")
      .update({
        clicks: (code.clicks || 0) + 1,
        last_clicked: new Date().toISOString(),
      })
      .eq("code", referral_code);

    return NextResponse.json({ success: true, clicks: (code.clicks || 0) + 1 });
  } catch (error) {
    console.error("[REFERRAL TRACK ERROR]", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
