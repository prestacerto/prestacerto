import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/firebase/auth";
import { createEarlyPaymentRequest } from "@/lib/firebase/monetization";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { proposalId, amount } = await request.json();

    if (!proposalId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const FEE_PERCENTAGE = 0.0299; // 2.99%
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
      user.uid,
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
