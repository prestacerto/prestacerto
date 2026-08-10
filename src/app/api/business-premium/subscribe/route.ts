import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";

const BUSINESS_PREMIUM_PRICE = 299.90; // R$ 299.90/mês

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { seats, card } = body;

    if (!seats || !card?.token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const serviceClient = createServiceClient();

    // Calcular preço baseado em seats
    const price = BUSINESS_PREMIUM_PRICE + (Math.max(0, seats - 5) * 50); // R$ 50 por seat extra

    // Criar registro de assinatura
    const { data: subscription, error: insertError } = await serviceClient
      .from("business_premium_subscriptions")
      .insert({
        user_id: user.id,
        seats,
        price,
        status: "pending",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .select("id")
      .single();

    if (insertError || !subscription) {
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }

    // Processar pagamento
    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const order = await createHeldOrder({
      sellerAccessToken: mpAccessToken,
      amount: price,
      externalReference: subscription.id,
      payerEmail: user.email ?? "",
      card,
    });

    const isHeld = order.status === "action_required" || order.status_detail === "waiting_capture";

    await serviceClient
      .from("business_premium_subscriptions")
      .update({
        mp_order_id: order.id,
        status: isHeld ? "active" : "pending",
      })
      .eq("id", subscription.id);

    if (!isHeld) {
      return NextResponse.json({ error: "Payment not held as expected" }, { status: 502 });
    }

    // Registrar evento
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      event_type: "business_premium",
      amount: price,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      subscription_id: subscription.id,
      seats,
      price,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[BUSINESS PREMIUM ERROR]", error);
    const message =
      error instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(error.statusDetail)
        : "Falha ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
