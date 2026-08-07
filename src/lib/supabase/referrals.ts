import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

// Programa de indicação — de propósito, um nível só: quem indica ganha pela
// própria indicação direta, nunca por quem a pessoa indicada indicou depois.
// Recompensa só vale quando o indicado vira usuário de verdade da
// plataforma (primeiro pagamento aprovado) — não por só se cadastrar, pra
// não virar incentivo a cadastro fake.
//
// Como ainda não existe cobrança recorrente automática (ver README —
// "Quero assinar" só registra interesse hoje), a recompensa é um upgrade de
// plano imediato, não um crédito com prazo — quando a assinatura
// automática existir, isso deve virar um crédito de N meses em vez de
// upgrade permanente.

const BUSINESS_TIER_THRESHOLD = 5; // indicações completas no mês corrente

// A indicação em si é registrada pelo trigger handle_new_user() direto no
// banco (ver 0008_referral_leaderboard.sql), lendo raw_user_meta_data —
// evita depender de uma chamada autenticada logo após o signUp, que falha
// silenciosamente se a confirmação de e-mail estiver ligada (sem sessão
// ainda nesse momento).

// Chamado quando um pagamento é aprovado (ver /api/projects/[id]/complete).
// Completa a indicação pendente do cliente e/ou do freelancer envolvidos,
// se for o primeiro pagamento aprovado de cada um.
export async function completeReferralIfFirstPayment(userId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id")
    .eq("referee_id", userId)
    .eq("status", "pending")
    .maybeSingle();
  if (!referral) return;

  const { count: priorApprovedPayments } = await supabase
    .from("payments")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved")
    .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`);

  // > 1 porque o próprio pagamento que disparou essa checagem já está
  // 'approved' nesse ponto — 1 significa que é o primeiro.
  if ((priorApprovedPayments ?? 0) > 1) return;

  await supabase
    .from("referrals")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", referral.id);

  await grantReferralReward(referral.referrer_id);
}

async function grantReferralReward(referrerId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", referrerId)
    .single();
  if (!profile) return;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: completedThisMonth } = await supabase
    .from("referrals")
    .select("id", { count: "exact", head: true })
    .eq("referrer_id", referrerId)
    .eq("status", "paid")
    .gte("paid_at", monthStart);

  const shouldBeBusiness = (completedThisMonth ?? 0) >= BUSINESS_TIER_THRESHOLD;

  if (shouldBeBusiness && profile.plan !== "business") {
    await supabase.from("profiles").update({ plan: "business" }).eq("id", referrerId);
  } else if (!shouldBeBusiness && profile.plan === "free") {
    await supabase.from("profiles").update({ plan: "pro" }).eq("id", referrerId);
  }
}

export async function getReferralStats(userId: string) {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [{ count: totalCompleted }, { count: monthCompleted }] = await Promise.all([
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId)
      .eq("status", "paid"),
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId)
      .eq("status", "paid")
      .gte("paid_at", monthStart),
  ]);

  return {
    totalCompleted: totalCompleted ?? 0,
    monthCompleted: monthCompleted ?? 0,
    remainingForBusiness: Math.max(0, BUSINESS_TIER_THRESHOLD - (monthCompleted ?? 0)),
  };
}

export async function getReferralLeaderboard() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("referral_leaderboard").select("*");
    return data ?? [];
  } catch (error) {
    console.error("getReferralLeaderboard falhou:", error);
    return [];
  }
}
