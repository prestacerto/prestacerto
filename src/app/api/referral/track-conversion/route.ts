import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { readJsonObject } from "@/lib/http/request-body";

const REFERRAL_CODE = /^ref_[A-Za-z0-9_-]{6,40}$/;
const REFERRAL_CREDIT_BRL = 50;

// Esta rota concede crédito em dinheiro. Antes ela era pública e aceitava
// refereeId do corpo, permitindo farmar R$50 em loop. Agora:
//   1. exige sessão — quem converte é o próprio indicado (nunca o corpo);
//   2. proíbe autoindicação;
//   3. um indicado só gera bônus uma vez, para sempre;
//   4. o convite é "reivindicado" com um UPDATE condicional, o que torna a
//      concessão idempotente mesmo sob chamadas simultâneas.
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await readJsonObject(req);
    if (body.response) return body.response;

    const referralCode = body.data.referralCode;
    if (typeof referralCode !== "string" || !REFERRAL_CODE.test(referralCode)) {
      return NextResponse.json({ error: "Código de indicação inválido." }, { status: 400 });
    }

    const db = createServiceClient();

    const { data: invite } = await db
      .from("referral_invites")
      .select("referrer_id, status, expires_at")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (!invite) {
      return NextResponse.json({ error: "Código de indicação inválido." }, { status: 400 });
    }

    if (invite.referrer_id === user.id) {
      return NextResponse.json({ error: "Você não pode usar sua própria indicação." }, { status: 400 });
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: "Este convite expirou." }, { status: 400 });
    }

    // Um indicado só vale bônus uma vez, mesmo com códigos diferentes.
    const { data: alreadyConverted } = await db
      .from("referral_conversions")
      .select("id")
      .eq("referee_id", user.id)
      .limit(1)
      .maybeSingle();

    if (alreadyConverted) {
      return NextResponse.json({ error: "Esta conta já foi contabilizada como indicação." }, { status: 409 });
    }

    // Reivindica o convite de forma atômica: só um pedido consegue sair de
    // "pending". Se nenhuma linha voltar, outro pedido já converteu.
    const { data: claimed } = await db
      .from("referral_invites")
      .update({ status: "converted", converted_at: new Date().toISOString() })
      .eq("referral_code", referralCode)
      .eq("status", "pending")
      .select("referral_code");

    if (!claimed || claimed.length === 0) {
      return NextResponse.json({ error: "Este convite já foi utilizado." }, { status: 409 });
    }

    const { error: conversionError } = await db.from("referral_conversions").insert({
      referrer_id: invite.referrer_id,
      referee_id: user.id,
      referral_code: referralCode,
      bonus_awarded: "1_month",
    });

    if (conversionError) throw conversionError;

    await db.rpc("award_referral_credit", {
      referrer_id: invite.referrer_id,
      amount: REFERRAL_CREDIT_BRL,
      description: "Bonus por indicação de novo freelancer",
    });

    return NextResponse.json({
      success: true,
      bonus: `R$ ${REFERRAL_CREDIT_BRL} em créditos`,
      message: "Referral converted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível registrar a indicação." },
      { status: 400 },
    );
  }
}
