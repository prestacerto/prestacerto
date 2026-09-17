import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_CERTO_CURRICULO_WEBHOOK_SECRET && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export async function POST(request: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = new Stripe(process.env.STRIPE_SECRET_KEY!).webhooks.constructEvent(rawBody, signature, process.env.STRIPE_CERTO_CURRICULO_WEBHOOK_SECRET!);
  } catch (error) {
    console.error("Stripe webhook inválido:", error);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (session.payment_status !== "paid" || !orderId || session.metadata?.product !== "certo_curriculo") {
      return NextResponse.json({ received: true });
    }

    const service = createServiceClient();
    // Atualização condicional: refresh/reentrega do evento não cria outra venda.
    const { error } = await service
      .from("certo_resume_orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), stripe_session_id: session.id, stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null })
      .eq("id", orderId)
      .eq("user_id", session.metadata?.user_id)
      .neq("status", "paid");
    if (error) {
      console.error("Stripe webhook não conseguiu confirmar pedido:", error.message);
      return NextResponse.json({ error: "Não foi possível registrar o pagamento." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
