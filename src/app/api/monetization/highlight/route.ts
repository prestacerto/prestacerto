import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@/lib/supabase/server";
import { addProjectHighlight } from "@/lib/supabase/monetization";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId, days } = await request.json();
    if (!projectId || !days) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: project } = await supabase
      .from("projects")
      .select("client_id")
      .eq("id", projectId)
      .single();

    if (!project || project.client_id !== user.id) {
      return NextResponse.json(
        { error: "Você não é o dono deste projeto." },
        { status: 403 }
      );
    }

    const prices: Record<number, number> = {
      7: 29.9,
      14: 49.9,
      30: 79.9,
    };
    const price = prices[days] ?? 29.9;

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP com o valor de `price`
    // 2. Retornar preference ID pra frontend renderizar Brick
    // 3. Webhook pra confirmar pagamento e chamar addProjectHighlight()

    // Placeholder: simula sucesso sem cobrar de verdade ainda
    await addProjectHighlight(projectId, days, "mp_placeholder_123");

    return NextResponse.json({
      success: true,
      message: "Projeto destacado com sucesso",
      price,
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
