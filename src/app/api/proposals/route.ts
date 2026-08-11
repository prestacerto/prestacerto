import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
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

    const formattedProposals = proposals?.map((p: any) => ({
      id: p.id,
      project_title: p.projects?.title,
      budget: p.proposed_price || p.projects?.budget_max,
      status: p.status,
      created_at: p.created_at,
      client_name: p.projects?.profiles?.full_name,
    })) || [];

    return NextResponse.json({ proposals: formattedProposals });
  } catch (error) {
    console.error("[PROPOSALS API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, message, proposedPrice } = body;

    if (!projectId || !message || !proposedPrice) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
      .select("title, client_id")
      .eq("id", projectId)
      .single();

    // Create proposal
    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        project_id: projectId,
        freelancer_id: user.id,
        message,
        proposed_price: proposedPrice,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[PROPOSALS API] Insert error:", error);
      return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 });
    }

    // Send notification to client
    if (project?.client_id) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send-proposal-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
