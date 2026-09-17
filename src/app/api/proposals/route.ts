import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get proposals where user is the freelancer
    const { data: proposals, error } = await supabase
      .from("proposals")
      .select(`
        id,
        status,
        proposed_price,
        message,
        created_at,
        projects (
          title,
          budget_min,
          budget_max,
          profiles!projects_client_id_fkey (
            full_name
          )
        )
      `)
      .eq("freelancer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PROPOSALS API] Error:", error);
      return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
    }

    const formattedProposals = proposals?.map((p) => {
      const project = Array.isArray(p.projects) ? p.projects[0] : p.projects;
      const client = Array.isArray(project?.profiles) ? project.profiles[0] : project?.profiles;
      return { id: p.id, project_title: project?.title, budget: p.proposed_price ?? project?.budget_max,
        status: p.status, created_at: p.created_at, client_name: client?.full_name };
    }) || [];

    return NextResponse.json({ proposals: formattedProposals });
  } catch (error) {
    console.error("[PROPOSALS API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await rateLimiters.proposals.limit(user.id);
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request);
    if (input.response) return input.response;
    const body = input.data;
    const { projectId, message, proposedPrice } = body;

    if (typeof projectId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)
      || typeof message !== "string" || message.trim().length < 10 || message.length > 10000
      || (proposedPrice != null && (typeof proposedPrice !== "number" || !Number.isFinite(proposedPrice) || proposedPrice <= 0 || proposedPrice > 99999999))) {
      return NextResponse.json({ error: "Confira a mensagem e o valor da proposta." }, { status: 400 });
    }

    // Get freelancer profile
    const { data: freelancerProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // Get project details
    const { data: project } = await supabase
      .from("projects")
      .select("title, client_id, status")
      .eq("id", projectId)
      .single();

    if (!project) return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    if (project.client_id === user.id) return NextResponse.json({ error: "Você não pode enviar uma proposta para seu próprio projeto." }, { status: 403 });
    if (project.status !== "open") return NextResponse.json({ error: "Este projeto não está recebendo propostas." }, { status: 409 });

    // Create proposal
    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        project_id: projectId,
        freelancer_id: user.id,
        message: message.trim(),
        proposed_price: proposedPrice ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[PROPOSALS API] Insert error:", error);
      if (error.message.includes("monthly_proposal_limit")) return NextResponse.json({ error: "Você atingiu as 3 propostas gratuitas deste mês. Seu texto foi preservado." }, { status: 429 });
      if (error.code === "23505") return NextResponse.json({ error: "Você já enviou uma proposta para este projeto." }, { status: 409 });
      return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
    }

    // Send notification to client
    if (project?.client_id && process.env.INTERNAL_NOTIFICATION_SECRET && process.env.VAPID_PRIVATE_KEY) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send-proposal-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-notification-secret": process.env.INTERNAL_NOTIFICATION_SECRET },
          signal: AbortSignal.timeout(2000),
          body: JSON.stringify({
            clientId: project.client_id,
            projectTitle: project.title,
            freelancerName: freelancerProfile?.full_name || "Freelancer",
            proposalId: proposal.id,
          }),
        });
      } catch (notifError) {
        console.error("[PROPOSALS API] Notification error:", notifError);
        // Don't fail the proposal creation if notification fails
      }
    }

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error("[PROPOSALS API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
