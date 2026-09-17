import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .select(`
        id,
        freelancer_id,
        status,
        proposed_price,
        message,
        created_at,
        projects (
          client_id,
          title,
          profiles!projects_client_id_fkey (
            full_name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (propError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Check if user has access (freelancer or client).
    const projectRelation = Array.isArray(proposal.projects) ? proposal.projects[0] : proposal.projects;
    const isFreelancer = proposal.freelancer_id === user.id;
    const isClient = projectRelation?.client_id === user.id;

    if (!isFreelancer && !isClient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get messages
    const { data: messages } = await supabase
      .from("messages")
      .select(`
        id,
        body,
        created_at,
        profiles!messages_sender_id_fkey (
          full_name
        )
      `)
      .eq("proposal_id", id)
      .order("created_at", { ascending: true });

    const clientProfile = (Array.isArray(projectRelation?.profiles) ? projectRelation?.profiles[0] : projectRelation?.profiles) as { full_name?: string } | null;
    const formatted = {
      id: proposal.id,
      status: proposal.status,
      proposed_price: proposal.proposed_price,
      message: proposal.message,
      created_at: proposal.created_at,
      project_title: projectRelation?.title,
      client_name: clientProfile?.full_name,
    };

    const formattedMessages = messages?.map((m) => ({
      id: m.id,
      body: m.body,
      created_at: m.created_at,
      sender_name: (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles)?.full_name,
    })) || [];

    return NextResponse.json({ proposal: formatted, messages: formattedMessages });
  } catch (error) {
    console.error("[PROPOSAL GET] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
