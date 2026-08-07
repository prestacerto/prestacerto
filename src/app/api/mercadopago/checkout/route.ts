import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  CAPTURE_WINDOW_DAYS,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";
import { decryptSecret } from "@/lib/crypto/token-cipher";

// Cria uma cobrança RETIDA: o cartão do cliente é autorizado, mas o dinheiro
// fica reservado no Mercado Pago — não cai pro freelancer ainda. Só é
// liberado quando o cliente confirma a entrega (ver /api/projects/[id]/complete).
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const projectId = body.projectId as string;
    const card = body.card as {
      token: string;
      payment_method_id: string;
      issuer_id?: string;
      installments: number;
    };

    if (!card?.token || !card?.payment_method_id) {
      return NextResponse.json({ error: "Dados do cartão incompletos." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: project } = await supabase
      .from("projects")
      .select("id, title, client_id, status")
      .eq("id", projectId)
      .single();

    if (!project || project.client_id !== user.id) {
      return NextResponse.json(
        { error: "Você não é o dono deste projeto." },
        { status: 403 }
      );
    }

    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, freelancer_id, proposed_price")
      .eq("project_id", projectId)
      .eq("status", "accepted")
      .maybeSingle();

    if (!proposal) {
      return NextResponse.json(
        { error: "Nenhuma proposta aceita neste projeto ainda." },
        { status: 400 }
      );
    }
    if (!proposal.proposed_price) {
      return NextResponse.json(
        { error: "Essa proposta não tem um valor definido pra cobrar." },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    const { data: connection } = await serviceClient
      .from("mp_connections")
      .select("access_token")
      .eq("freelancer_id", proposal.freelancer_id)
      .maybeSingle();

    if (!connection) {
      return NextResponse.json(
        { error: "O freelancer ainda não conectou uma conta Mercado Pago para receber." },
        { status: 400 }
      );
    }

    const { data: payment, error: insertError } = await serviceClient
      .from("payments")
      .upsert(
        {
          proposal_id: proposal.id,
          project_id: project.id,
          client_id: project.client_id,
          freelancer_id: proposal.freelancer_id,
          amount: proposal.proposed_price,
          status: "pending",
        },
        { onConflict: "proposal_id" }
      )
      .select("id")
      .single();

    if (insertError || !payment) {
      return NextResponse.json(
        { error: "Não foi possível iniciar o pagamento." },
        { status: 500 }
      );
    }

    const sellerAccessToken = decryptSecret(connection.access_token);

    const order = await createHeldOrder({
      sellerAccessToken,
      amount: proposal.proposed_price,
      externalReference: payment.id,
      payerEmail: user.email ?? "",
      card,
    });

    const isHeld = order.status === "action_required" || order.status_detail === "waiting_capture";
    const captureDeadline = new Date(
      Date.now() + CAPTURE_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    await serviceClient
      .from("payments")
      .update({
        mp_order_id: order.id,
        status: isHeld ? "authorized" : "pending",
        authorized_at: isHeld ? new Date().toISOString() : null,
        capture_deadline: isHeld ? captureDeadline : null,
      })
      .eq("id", payment.id);

    if (!isHeld) {
      return NextResponse.json(
        {
          error:
            "O pagamento não ficou retido como esperado — não prosseguir sem confirmar isso com o suporte do Mercado Pago.",
          orderStatus: order.status,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("mercadopago checkout falhou:", err);
    const message =
      err instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(err.statusDetail)
        : "Não foi possível criar a cobrança no Mercado Pago.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
