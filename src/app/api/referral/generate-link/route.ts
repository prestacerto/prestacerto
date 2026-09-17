import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

// O referrer é SEMPRE o usuário da sessão. Nunca aceite um userId vindo do
// corpo da requisição: isso permitia forjar convites em nome de qualquer conta.
export async function POST(_req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServiceClient();

    // Reaproveita um convite pendente ainda válido em vez de criar um novo a
    // cada chamada (evita inflar a tabela e gerar códigos infinitos).
    const { data: existing } = await db
      .from("referral_invites")
      .select("referral_code, expires_at")
      .eq("referrer_id", user.id)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.referral_code) {
      return NextResponse.json({
        referralCode: existing.referral_code,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${existing.referral_code}`,
        expiresIn: "90 days",
      });
    }

    const referralCode = `ref_${nanoid(12)}`;

    const { error } = await db.from("referral_invites").insert({
      referrer_id: user.id,
      referee_email: "", // será preenchido no signup
      referral_code: referralCode,
      status: "pending",
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    if (error) throw error;

    return NextResponse.json({
      referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${referralCode}`,
      expiresIn: "90 days",
    });
  } catch {
    // Não devolva a mensagem crua do banco ao cliente.
    return NextResponse.json(
      { error: "Não foi possível gerar o link de indicação." },
      { status: 400 },
    );
  }
}
