import { NextRequest, NextResponse } from "next/server";
import { optimizeProposal, generateProposalTips, compareProposals } from "@/lib/ai/proposal-optimizer";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, proposal, proposal1, proposal2, category, budget } = body;

    // Registrar uso pra monetização
    await supabase.from("ai_usage_logs").insert({
      user_id: user.id,
      feature: "proposal_optimizer",
      action,
      tokens_used: 0, // será atualizado via webhook do Anthropic
    });

    let result;

    if (action === "optimize") {
      result = await optimizeProposal(proposal, { category, budget });
      // Isso seria pago: R$ 4.90 por otimização (ou modelo freemium: 3/mês grátis, depois R$ 4.90)
    } else if (action === "compare") {
      result = await compareProposals(proposal1, proposal2);
    } else if (action === "tips") {
      const tips = await generateProposalTips();
      result = { tips };
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    // Registrar sucesso
    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "ai_proposal_optimizer",
      amount: 4.9, // R$ 4.90
      status: "completed",
      metadata: { action },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PROPOSAL OPTIMIZER ERROR]", error);
    return NextResponse.json({ error: "Failed to optimize proposal" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Buscar tips grátis (sem custo)
    const tips = await generateProposalTips();
    return NextResponse.json({ tips, free: true });
  } catch (error) {
    console.error("[GET TIPS ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
