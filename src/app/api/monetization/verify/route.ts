import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/firebase/auth";
import { addVerificationBadge } from "@/lib/firebase/monetization";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP (R$ 9,90)
    // 2. Retornar preference ID
    // 3. Webhook pra confirmar e chamar addVerificationBadge()

    // Placeholder: simular sucesso
    await addVerificationBadge(user.uid, "mp_verify_placeholder_123");

    return NextResponse.json({
      success: true,
      message: "Perfil verificado com sucesso",
      preferenceId: "mp_verify_placeholder_123",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to create verification" },
      { status: 500 }
    );
  }
}
