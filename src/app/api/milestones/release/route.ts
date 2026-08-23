/**
 * POST /api/milestones/release
 *
 * Cliente libera pagamento de um milestone
 * Freelancer só recebe depois que cliente confirma conclusão
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { milestone_id, approved = true } = await req.json();

    if (!milestone_id) {
      return NextResponse.json(
        { error: "milestone_id required" },
        { status: 400 }
      );
    }

    // Obter milestone e projeto
    const { data: milestone, error: milestoneError } = await supabase
      .from("project_milestones")
      .select("*, projects(client_id, budget_max)")
      .eq("id", milestone_id)
      .single();

    if (milestoneError || !milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }

    const project = milestone.projects;

    // Verificar autenticação (só cliente pode liberar)
    const userIdHeader = req.headers.get("x-user-id");
    if (userIdHeader !== project.client_id) {
      return NextResponse.json(
        { error: "Only client can release payment" },
        { status: 403 }
      );
    }

    // Atualizar status do milestone
    const newStatus = approved ? "released" : "disputed";

    const { error: updateError } = await supabase
      .from("project_milestones")
      .update({
        status: newStatus,
        completed_at: approved ? new Date() : null,
        updated_at: new Date(),
      })
      .eq("id", milestone_id);

    if (updateError) throw updateError;

    // Registrar transação
    if (approved) {
      await supabase.from("monetization_transactions").insert({
        project_id: milestone.project_id,
        transaction_type: "milestone_release",
        amount: milestone.amount,
        status: "completed",
        completed_at: new Date(),
      });
    }

    return NextResponse.json(
      {
        milestone_id,
        status: newStatus,
        amount: milestone.amount,
        message: approved
          ? "Pagamento liberado para o freelancer"
          : "Disputa criada, suporte será contatado",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MILESTONE RELEASE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to release milestone" },
      { status: 500 }
    );
  }
}
