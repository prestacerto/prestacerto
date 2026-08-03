import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendProposalAcceptedEmail } from "@/lib/email/resend";

interface AcceptProposalParams {
  id: string;
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<AcceptProposalParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Busca a proposta e confirma que o usuário é o dono do projeto
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("project_id, freelancer_id")
      .eq("id", params.id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Confirma que o usuário é o dono do projeto (a RLS vai garantir, mas valida primeiro)
    const { data: project } = await supabase
      .from("projects")
      .select("title, client_id, status")
      .eq("id", proposal.project_id)
      .single();

    if (!project || project.client_id !== user.id) {
      return NextResponse.json(
        { error: "You don't own this project" },
        { status: 403 }
      );
    }

    if (project.status !== "open") {
      return NextResponse.json(
        { error: "Project is no longer open" },
        { status: 400 }
      );
    }

    // Atualiza proposta pra 'accepted'
    const { error: updateError } = await supabase
      .from("proposals")
      .update({ status: "accepted" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // As outras propostas do projeto deixam de fazer sentido — recusa todas.
    await supabase
      .from("proposals")
      .update({ status: "rejected" })
      .eq("project_id", proposal.project_id)
      .neq("id", params.id)
      .eq("status", "pending");

    // Projeto sai de "aberto" — para de aceitar novas propostas.
    await supabase
      .from("projects")
      .update({ status: "in_progress" })
      .eq("id", proposal.project_id);

    const freelancerEmail = await getUserEmailById(proposal.freelancer_id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    await sendProposalAcceptedEmail({
      to: freelancerEmail,
      projectTitle: project.title,
      threadUrl: `${siteUrl}/dashboard/messages/${params.id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to accept proposal" },
      { status: 500 }
    );
  }
}
