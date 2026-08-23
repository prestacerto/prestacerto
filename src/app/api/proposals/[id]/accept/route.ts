import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(
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

    // Get proposal to check if user is client
    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .select(`
        id,
        status,
        project_id,
        projects (
          client_id
        )
      `)
      .eq("id", id)
      .single();

    if (propError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Verify user is the client
    if (proposal.projects?.[0]?.client_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Accept proposal
    const { data: updated, error: updateError } = await supabase
      .from("proposals")
      .update({ status: "accepted" })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to accept proposal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposal: updated });
  } catch (error) {
    console.error("[ACCEPT PROPOSAL] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
