import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { referralCode, refereeId } = await req.json();
    const db = createServiceClient();

    // Encontrar referrer
    const { data: invite, error: inviteError } = await db
      .from("referral_invites")
      .select("referrer_id")
      .eq("referral_code", referralCode)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Registrar conversão
    const { error: conversionError } = await db
      .from("referral_conversions")
      .insert({
        referrer_id: invite.referrer_id,
        referee_id: refereeId,
        referral_code: referralCode,
        bonus_awarded: "1_month",
      });

    if (conversionError) throw conversionError;

    // Atualizar invite status
    await db
      .from("referral_invites")
      .update({ status: "converted", converted_at: new Date() })
      .eq("referral_code", referralCode);

    // Dar R$ 50 de crédito ao referrer
    await db.rpc("award_referral_credit", {
      referrer_id: invite.referrer_id,
      amount: 50,
      description: "Bonus por indicação de novo freelancer",
    });

    return NextResponse.json({
      success: true,
      bonus: "R$ 50 em créditos",
      message: "Referral converted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
