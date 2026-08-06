import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/firebase/auth";
import { addProjectHighlight } from "@/lib/firebase/monetization";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId, days } = await request.json();

    if (!projectId || !days) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP com valor baseado em dias
    // 2. Retornar preference ID pra frontend renderizar Brick
    // 3. Webhook pra confirmar pagamento e chamar addProjectHighlight()

    const prices: Record<number, number> = {
      7: 29.9,
      14: 49.9,
      30: 79.9,
    };

    const price = prices[days] || 29.9;

    // Placeholder: simular sucesso
    await addProjectHighlight(projectId, days, "mp_placeholder_123");

    return NextResponse.json({
      success: true,
      message: "Projeto destacado com sucesso",
      preferenceId: "mp_placeholder_123",
    });
  } catch (error) {
    console.error("Highlight error:", error);
    return NextResponse.json(
      { error: "Failed to create highlight" },
      { status: 500 }
    );
  }
}
