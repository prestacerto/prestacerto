import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { addVerificationBadge } from "@/lib/supabase/monetization";

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP (R$ 9,90)
    // 2. Retornar preference ID
    // 3. Webhook pra confirmar e chamar addVerificationBadge()

    // Placeholder: simular sucesso
    const placeholderPaymentId = `mp_verify_placeholder_${crypto.randomUUID()}`;
    await addVerificationBadge(user.id, 9.9, placeholderPaymentId);

    return NextResponse.json({
      success: true,
      message: "Perfil verificado com sucesso",
      preferenceId: placeholderPaymentId,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to create verification" },
      { status: 500 }
    );
  }
}
