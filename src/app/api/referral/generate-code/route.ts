import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

    // Verificar se já tem código
    const { data: existing } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({
        code: existing.code,
        commission_rate: existing.commission_rate,
        created_at: existing.created_at,
      });
    }

    // Gerar novo código único
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Criar código
    const { data: referralCode, error } = await supabase
      .from("referral_codes")
      .insert({
        user_id: user.id,
        code,
        commission_rate: 0.1, // 10%
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      code: referralCode.code,
      commission_rate: referralCode.commission_rate,
      referral_link: `https://prestacerto.com.br/register?ref=${referralCode.code}`,
    });
  } catch (error) {
    console.error("[REFERRAL CODE ERROR]", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}
