import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getOrderById } from "@/lib/payments/mercadopago";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendPaymentApprovedEmail } from "@/lib/email/resend";

// Docs: https://www.mercadopago.com.br/developers/en/docs/checkout-pro/payment-notifications
function isValidSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Em produção isso não é "modo permissivo de dev", é uma notificação
      // de pagamento sem verificação — recusa em vez de aceitar qualquer um.
      console.error(
        "MERCADOPAGO_WEBHOOK_SECRET ausente em produção — recusando notificação do webhook."
      );
      return false;
    }
    return true; // assinatura não configurada — pula validação (dev/sandbox)
  }

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  const dataId = request.nextUrl.searchParams.get("data.id");
  if (!signatureHeader || !requestId || !dataId) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key.trim(), value?.trim()];
    })
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expectedHash);
  const b = Buffer.from(receivedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Mapeia o status da order do Mercado Pago pro nosso enum de payments.
// NOTA: os valores exatos de status/status_detail de notificação da API de
// Orders não foram confirmados contra o sandbox — ver aviso em
// lib/payments/mercadopago.ts. Em caso de valor desconhecido, não altera o
// registro (melhor não mexer do que gravar um estado errado).
function mapOrderStatus(order: { status: string; status_detail?: string }): string | null {
  if (order.status === "cancelled") return "expired";
  if (order.status === "processed" || order.status === "approved") return "approved";
  if (order.status === "action_required" && order.status_detail === "waiting_capture") {
    return "authorized";
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!isValidSignature(request)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const orderId = body?.data?.id;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  try {
    const order = await getOrderById(String(orderId));
    if (!order.external_reference) {
      return NextResponse.json({ received: true });
    }

    const newStatus = mapOrderStatus(order);
    if (!newStatus) {
      console.error("Webhook MP: status de order não reconhecido, ignorando.", order);
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceClient();
    const { data: current } = await supabase
      .from("payments")
      .select("status, freelancer_id, amount, project_id, project:projects(title)")
      .eq("id", order.external_reference)
      .single();

    if (!current || current.status === newStatus) {
      return NextResponse.json({ received: true });
    }

    // "approved" já é setado de forma síncrona por /api/projects/[id]/complete
    // quando o cliente confirma a entrega — o webhook só reconcilia (ex.: se
    // o cliente não confirmar em 5 dias, é aqui que viramos "expired").
    await supabase
      .from("payments")
      .update({ status: newStatus, mp_order_id: String(order.id) })
      .eq("id", order.external_reference);

    if (newStatus === "approved" && current.status !== "approved") {
      const project = current.project as unknown as { title: string } | null;
      const freelancerEmail = await getUserEmailById(current.freelancer_id);
      await sendPaymentApprovedEmail({
        to: freelancerEmail,
        projectTitle: project?.title ?? "seu projeto",
        amount: current.amount,
      });
    }
  } catch (err) {
    console.error("mercadopago webhook falhou:", err);
    // Retorna 200 mesmo com erro interno pra evitar reenvio em loop pelo MP;
    // o erro fica registrado no log do servidor.
  }

  return NextResponse.json({ received: true });
}
