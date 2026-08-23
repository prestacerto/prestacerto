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

    const formatted = messages?.map((m: any) => ({
      id: m.id,
      body: m.body,
      created_at: m.created_at,
      sender_name: m.profiles?.full_name,
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
    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { body: messageBody } = body;

    if (!messageBody) {
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

    const recipientId = proposal?.freelancer_id === user.id
      ? proposal?.projects?.[0]?.client_id
      : proposal?.freelancer_id;

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        proposal_id: id,
        sender_id: user.id,
        body: messageBody,
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
    if (recipientId) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send-message-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

    const formatted = {
      id: message.id,
      body: message.body,
      created_at: message.created_at,
      sender_name: message.profiles?.[0]?.full_name,
    };

    return NextResponse.json({ message: formatted }, { status: 201 });
  } catch (error) {
    console.error("[MESSAGES API] Exception:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
