import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@/lib/supabase/server";
import { createEarlyPaymentRequest } from "@/lib/supabase/monetization";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { proposalId } = await request.json();
    if (!proposalId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // O valor nunca vem do cliente — só do pagamento retido de verdade,
    // e só o próprio freelancer da proposta pode pedir antecipação dele.
    const supabase = await createClient();
    const { data: payment } = await supabase
      .from("payments")
      .select("amount, freelancer_id, status")
      .eq("proposal_id", proposalId)
      .maybeSingle();

    if (!payment || payment.freelancer_id !== user.id) {
      return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
    }
    if (payment.status !== "authorized") {
      return NextResponse.json(
        { error: "Só dá pra antecipar um pagamento retido, aguardando confirmação." },
        { status: 400 }
      );
    }

    const FEE_PERCENTAGE = 0.0299; // 2.99%
    const amount = payment.amount;
    const fee = amount * FEE_PERCENTAGE;

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP com valor da taxa
    // 2. Retornar preference ID
    // 3. Webhook pra confirmar pagamento e:
    //    - Chamar createEarlyPaymentRequest()
    //    - Capturar pagamento original no MP
    //    - Transferir valor (amount - fee) pro freelancer

    // Placeholder: simular sucesso
    const requestId = await createEarlyPaymentRequest(
      proposalId,
      user.id,
      amount,
      FEE_PERCENTAGE
    );

    return NextResponse.json({
      success: true,
      message: "Pagamento antecipado criado",
      requestId,
      fee: fee.toFixed(2),
      netAmount: (amount - fee).toFixed(2),
      preferenceId: "mp_early_placeholder_123",
    });
  } catch (error) {
    console.error("Early payment error:", error);
    return NextResponse.json(
      { error: "Failed to create early payment request" },
      { status: 500 }
    );
  }
}
