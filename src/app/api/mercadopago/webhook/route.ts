import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getPaymentById } from "@/lib/payments/mercadopago";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendPaymentApprovedEmail } from "@/lib/email/resend";

// Docs: https://www.mercadopago.com.br/developers/en/docs/checkout-pro/payment-notifications
function isValidSignature(request: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // assinatura não configurada — pula validação (dev/sandbox)

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

export async function POST(request: NextRequest) {
  if (!isValidSignature(request)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (body?.type !== "payment" || !body?.data?.id) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPaymentById(String(body.data.id));
    if (!payment.external_reference) {
      return NextResponse.json({ received: true });
    }

    const newStatus = payment.status === "cancelled" ? "rejected" : payment.status;
    const supabase = createServiceClient();
    const { data: updated } = await supabase
      .from("payments")
      .update({ status: newStatus, mp_payment_id: String(payment.id) })
      .eq("id", payment.external_reference)
      .select("freelancer_id, amount, project_id, project:projects(title)")
      .single();

    if (updated && newStatus === "approved") {
      const project = updated.project as unknown as { title: string } | null;
      const freelancerEmail = await getUserEmailById(updated.freelancer_id);
      await sendPaymentApprovedEmail({
        to: freelancerEmail,
        projectTitle: project?.title ?? "seu projeto",
        amount: updated.amount,
      });
    }
  } catch (err) {
    console.error("mercadopago webhook falhou:", err);
    // Retorna 200 mesmo com erro interno pra evitar reenvio em loop pelo MP;
    // o erro fica registrado no log do servidor.
  }

  return NextResponse.json({ received: true });
}
