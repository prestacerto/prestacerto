import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendNewProposalEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = await createClient();
    const serviceClient = createServiceClient();

    // Criar proposta primeiro (sem validação de conectares, pra teste)
    const { data: proposal, error: propError } = await supabase
      .from("proposals")
      .insert({
        project_id: body.projectId,
        freelancer_id: user.id,
        message: body.message,
        proposed_price: body.proposedPrice || null,
        used_connect: false, // Será atualizado após validar conectares
      })
      .select("id")
      .single();

    if (propError) {
      return NextResponse.json({ error: propError.message }, { status: 400 });
    }

    // Gastar um conectar (função RLS-protected do Supabase)
    const { data: connectSpent, error: connectError } = await serviceClient.rpc("spend_connect", {
      p_user_id: user.id,
      p_proposal_id: proposal.id,
    });

    if (connectError || !connectSpent) {
      // Se não tiver conectares, deletar a proposta e retornar erro
      await supabase.from("proposals").delete().eq("id", proposal.id);

      return NextResponse.json(
        {
          error: "Você não tem conectares disponíveis para enviar esta proposta",
          connectsRemaining: 0,
          action: "purchase_connects",
        },
        { status: 402 }
      );
    }

    // Marcar proposta como usando conectar
    await supabase.from("proposals").update({ used_connect: true }).eq("id", proposal.id);

    // Enviar email ao cliente
    const [{ data: project }, profile] = await Promise.all([
      supabase.from("projects").select("title, client_id").eq("id", body.projectId).single(),
      getProfile(),
    ]);

    if (project) {
      const clientEmail = await getUserEmailById(project.client_id);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      await sendNewProposalEmail({
        to: clientEmail,
        projectTitle: project.title,
        freelancerName: profile?.full_name ?? "Um freelancer",
        projectUrl: `${siteUrl}/dashboard/projects/${body.projectId}`,
      });
    }

    return NextResponse.json({ ...proposal, connectSpent: 1 }, { status: 201 });
  } catch (error) {
    console.error("[PROPOSALS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
