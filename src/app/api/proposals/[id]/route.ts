import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .select(`
        id,
        status,
        proposed_price,
        message,
        created_at,
        freelancer_id,
        projects (
          title,
          client_id,
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

    // Check if user has access (freelancer or client)
    const isFreelancer = proposal.freelancer_id === user.id;
    const isClient = proposal.projects?.[0]?.client_id === user.id;

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

    const formatted = {
      id: proposal.id,
      status: proposal.status,
      proposed_price: proposal.proposed_price,
      message: proposal.message,
      created_at: proposal.created_at,
      project_title: proposal.projects?.[0]?.title,
      client_name: proposal.projects?.[0]?.profiles?.[0]?.full_name,
    };

    const formattedMessages = messages?.map((m: any) => ({
      id: m.id,
      body: m.body,
      created_at: m.created_at,
      sender_name: m.profiles?.[0]?.full_name,
    })) || [];

    return NextResponse.json({ proposal: formatted, messages: formattedMessages });
  } catch (error) {
    console.error("[PROPOSAL GET] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
