import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const proposalId = body.proposalId as string;
    const messageBody = (body.body as string)?.trim();

    if (!messageBody) {
      return NextResponse.json({ error: "Escreva uma mensagem." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, freelancer_id, project:projects(client_id, title)")
      .eq("id", proposalId)
      .single();

    const project = proposal?.project as unknown as { client_id: string; title: string } | null;
    const isParticipant =
      proposal &&
      (proposal.freelancer_id === user.id || project?.client_id === user.id);

    if (!proposal || !isParticipant) {
      return NextResponse.json(
        { error: "Você não faz parte desta conversa." },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("messages").insert({
      proposal_id: proposalId,
      sender_id: user.id,
      body: messageBody,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const recipientId = user.id === proposal.freelancer_id ? project?.client_id : proposal.freelancer_id;
    if (recipientId && project) {
      const [recipientEmail, senderProfile] = await Promise.all([
        getUserEmailById(recipientId),
        getProfile(),
      ]);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      await sendNewMessageEmail({
        to: recipientEmail,
        senderName: senderProfile?.full_name ?? "Alguém",
        projectTitle: project.title,
        threadUrl: `${siteUrl}/dashboard/messages/${proposalId}`,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
