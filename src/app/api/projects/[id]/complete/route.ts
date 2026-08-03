import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendProjectCompletedEmail, sendPaymentApprovedEmail } from "@/lib/email/resend";
import { captureOrder } from "@/lib/payments/mercadopago";
import { decryptSecret } from "@/lib/crypto/token-cipher";

interface CompleteProjectParams {
  id: string;
}

// "Marcar como concluído" é o gatilho de liberação: se existir um pagamento
// retido (status "authorized"), essa chamada CAPTURA — libera o dinheiro pro
// freelancer — antes de fechar o projeto. Se a captura falhar, o projeto
// continua "in_progress" de propósito: não faz sentido dizer que o projeto
// acabou se o freelancer não recebeu.
export async function POST(
  request: NextRequest,
  props: { params: Promise<CompleteProjectParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("title, client_id, status")
      .eq("id", params.id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.client_id !== user.id) {
      return NextResponse.json(
        { error: "You don't own this project" },
        { status: 403 }
      );
    }

    if (project.status !== "in_progress") {
      return NextResponse.json(
        { error: "Project is not in progress" },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    const { data: payment } = await serviceClient
      .from("payments")
      .select("id, status, mp_order_id, freelancer_id, amount")
      .eq("project_id", params.id)
      .maybeSingle();

    if (payment && payment.status === "authorized") {
      if (!payment.mp_order_id) {
        return NextResponse.json(
          { error: "Pagamento retido sem referência da cobrança — contate o suporte." },
          { status: 500 }
        );
      }

      const { data: connection } = await serviceClient
        .from("mp_connections")
        .select("access_token")
        .eq("freelancer_id", payment.freelancer_id)
        .maybeSingle();

      if (!connection) {
        return NextResponse.json(
          { error: "Não foi possível localizar a conta Mercado Pago do freelancer." },
          { status: 500 }
        );
      }

      try {
        await captureOrder(payment.mp_order_id, decryptSecret(connection.access_token));
      } catch (captureError) {
        console.error("Falha ao liberar pagamento retido:", captureError);
        return NextResponse.json(
          {
            error:
              "Não foi possível liberar o pagamento retido agora. O projeto não foi encerrado — tente novamente em instantes.",
          },
          { status: 502 }
        );
      }

      await serviceClient
        .from("payments")
        .update({ status: "approved" })
        .eq("id", payment.id);

      const freelancerEmail = await getUserEmailById(payment.freelancer_id);
      await sendPaymentApprovedEmail({
        to: freelancerEmail,
        projectTitle: project.title,
        amount: payment.amount,
      });
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: "closed" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    const { data: acceptedProposal } = await supabase
      .from("proposals")
      .select("id, freelancer_id")
      .eq("project_id", params.id)
      .eq("status", "accepted")
      .maybeSingle();

    if (acceptedProposal) {
      const freelancerEmail = await getUserEmailById(acceptedProposal.freelancer_id);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      await sendProjectCompletedEmail({
        to: freelancerEmail,
        projectTitle: project.title,
        reviewUrl: `${siteUrl}/projects/${params.id}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete project" },
      { status: 500 }
    );
  }
}
