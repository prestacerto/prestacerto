import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const db = createServiceClient();

    // Gerar código de referral único
    const referralCode = `ref_${nanoid(12)}`;

    // Salvar convite
    const { error } = await db.from("referral_invites").insert({
      referrer_id: userId,
      referee_email: "", // será preenchido no signup
      referral_code: referralCode,
      status: "pending",
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    if (error) throw error;

    // Gerar link compartilhável
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${referralCode}`;

    return NextResponse.json({
      referralCode,
      referralLink,
      expiresIn: "90 days",
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
