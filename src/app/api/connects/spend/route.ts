import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { proposal_id } = await req.json();
    if (!proposal_id) return NextResponse.json({ error: "proposal_id required" }, { status: 400 });

    const serviceClient = createServiceClient();

    // Chamar função PL/pgSQL pra validar e gastar conectar
    const { data, error } = await serviceClient.rpc("spend_connect", {
      p_user_id: user.id,
      p_proposal_id: proposal_id,
    });

    if (error || !data) {
      return NextResponse.json(
        { error: "Você não tem conectares disponíveis. Compre mais para continuar." },
        { status: 402 }
      );
    }

    // Marcar proposta como usando conectar
    await serviceClient.from("proposals").update({ used_connect: true }).eq("id", proposal_id);

    return NextResponse.json({ success: true, connectSpent: 1 });
  } catch (error) {
    console.error("[CONNECTS SPEND ERROR]", error);
    return NextResponse.json({ error: "Failed to spend connect" }, { status: 500 });
  }
}
