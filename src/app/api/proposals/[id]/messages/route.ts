import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit';

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

    const { data: participantProposal } = await supabase.from("proposals")
      .select("freelancer_id, projects(client_id)").eq("id", id).maybeSingle();
    const participantProject = Array.isArray(participantProposal?.projects) ? participantProposal.projects[0] : participantProposal?.projects;
    if (!participantProposal || (participantProposal.freelancer_id !== user.id && participantProject?.client_id !== user.id)) {
      return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
    }

    const { data: messages, error } = await supabase
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

    if (error) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    const formatted = messages?.map((m) => ({
      id: m.id,
      body: m.body,
      created_at: m.created_at,
      sender_name: (Array.isArray(m.profiles) ? m.profiles[0] : m.profiles)?.full_name,
    })) || [];

    return NextResponse.json({ messages: formatted });
  } catch (error) {
    console.error("[MESSAGES API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
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

    const limit = await rateLimiters.messages.limit(user.id);
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request);
    if (input.response) return input.response;
    const body = input.data;
    const { body: messageBody } = body;

    if (typeof messageBody !== "string" || !messageBody.trim() || messageBody.length > 10000) {
      return NextResponse.json({ error: "Message body required" }, { status: 400 });
    }

    // Get sender profile
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // Get proposal to find other participant
    const { data: proposal } = await supabase
      .from("proposals")
      .select("freelancer_id, projects(client_id)")
      .eq("id", id)
      .single();

    const projectRelation = Array.isArray(proposal?.projects) ? proposal?.projects[0] : proposal?.projects;
    if (!proposal || (proposal.freelancer_id !== user.id && projectRelation?.client_id !== user.id)) {
      return NextResponse.json({ error: "Proposta não encontrada." }, { status: 404 });
    }
    const recipientId = proposal?.freelancer_id === user.id
      ? projectRelation?.client_id
      : proposal?.freelancer_id;

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        proposal_id: id,
        sender_id: user.id,
        body: messageBody.trim(),
      })
      .select(`
        id,
        body,
        created_at,
        profiles!messages_sender_id_fkey (
          full_name
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    // Send notification to recipient
    if (recipientId && process.env.INTERNAL_NOTIFICATION_SECRET && process.env.VAPID_PRIVATE_KEY) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send-message-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-notification-secret": process.env.INTERNAL_NOTIFICATION_SECRET },
          signal: AbortSignal.timeout(2000),
          body: JSON.stringify({
            recipientId,
            senderName: senderProfile?.full_name || "Usuário",
            proposalId: id,
            messagePreview: messageBody,
          }),
        });
      } catch (notifError) {
        console.error("[MESSAGES API] Notification error:", notifError);
      }
    }

    const messageProfile = (Array.isArray(message.profiles) ? message.profiles[0] : message.profiles) as { full_name?: string } | null;
    const formatted = {
      id: message.id,
      body: message.body,
      created_at: message.created_at,
      sender_name: messageProfile?.full_name,
    };

    return NextResponse.json({ message: formatted }, { status: 201 });
  } catch (error) {
    console.error("[MESSAGES API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
