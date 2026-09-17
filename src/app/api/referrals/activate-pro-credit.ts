import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Quando um usuário compra Pro pela primeira vez com referência,
    // ativa o crédito para o referrer e para o referee

    const { referrerId, refereePlan } = await request.json();

    if (!referrerId || !refereePlan) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Determinar valor do crédito baseado no plano
    const creditValues: Record<string, number> = {
      starter: 29.9,
      pro: 59.9,
      unlimited: 99.9,
    };

    const creditValue = creditValues[refereePlan] || 49.9;

    // 1. Criar referral record como "paid"
    await supabase
      .from("referrals")
      .insert({
        referrer_id: referrerId,
        referee_id: user.id,
        action_type: "subscription",
        reward: creditValue,
        status: "paid",
        paid_at: new Date().toISOString(),
      });

    // 2. Criar subscription credential para referrer (1 mês grátis)
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await supabase
      .from("credits_subscriptions")
      .upsert(
        {
          user_id: referrerId,
          plan: "pro",
          billing_cycle: "monthly",
          credits_per_month: 50,
          price: 0,
          status: "active",
          billing_cycle_start: new Date().toISOString(),
          billing_cycle_end: nextMonth.toISOString(),
        },
        { onConflict: "user_id" }
      );

    // 3. Criar subscription credit para referee (1 mês grátis)
    const refereeNextMonth = new Date();
    refereeNextMonth.setMonth(refereeNextMonth.getMonth() + 1);

    await supabase
      .from("credits_subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan: "pro",
          billing_cycle: "monthly",
          credits_per_month: 50,
          price: 0,
          status: "active",
          billing_cycle_start: new Date().toISOString(),
          billing_cycle_end: refereeNextMonth.toISOString(),
        },
        { onConflict: "user_id" }
      );

    // 4. Log na monetização
    console.log(`✅ Referral Pro Credit Activated:
      Referrer: ${referrerId}
      Referee: ${user.id}
      Value: R$ ${creditValue}
    `);

    return NextResponse.json({
      success: true,
      message: "Crédito Pro ativado para ambos",
      referrerCredit: creditValue,
      refereeCredit: creditValue,
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao ativar crédito" },
      { status: 500 }
    );
  }
}
