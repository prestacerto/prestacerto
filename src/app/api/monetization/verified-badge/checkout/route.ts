import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";

const VERIFIED_BADGE_FEE = 5; // R$ 5/mês
const BILLING_CYCLE = 30; // dias

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { card } = body;

    if (!card?.token || !card?.payment_method_id) {
      return NextResponse.json({ error: "Missing card data" }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    // Criar pagamento no banco
    const { data: payment, error: insertError } = await serviceClient
      .from("payments")
      .insert({
        client_id: user.id,
        amount: VERIFIED_BADGE_FEE,
        status: "pending",
        type: "verified_badge",
      })
      .select("id")
      .single();

    if (insertError || !payment) {
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
    }

    // Processar pagamento via Mercado Pago
    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const order = await createHeldOrder({
      sellerAccessToken: mpAccessToken,
      amount: VERIFIED_BADGE_FEE,
      externalReference: payment.id,
      payerEmail: user.email ?? "",
      card,
    });

    const isHeld = order.status === "action_required" || order.status_detail === "waiting_capture";

    await serviceClient
      .from("payments")
      .update({
        mp_order_id: order.id,
        status: isHeld ? "authorized" : "pending",
        authorized_at: isHeld ? new Date().toISOString() : null,
      })
      .eq("id", payment.id);

    if (!isHeld) {
      return NextResponse.json(
        { error: "Payment not held as expected" },
        { status: 502 }
      );
    }

    const supabase = await createClient();
    const verified_badge_expires = new Date(Date.now() + BILLING_CYCLE * 24 * 60 * 60 * 1000);

    // Ativar badge
    await supabase
      .from("profiles")
      .update({
        is_verified: true,
        verified_badge_active: true,
        verified_badge_expires,
      })
      .eq("id", user.id);

    // Criar subscription
    await serviceClient.from("subscriptions").insert({
      user_id: user.id,
      subscription_type: "verified_badge",
      price: VERIFIED_BADGE_FEE,
      status: "active",
      expires_at: verified_badge_expires,
      billing_cycle: BILLING_CYCLE,
    });

    // Registrar evento
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      event_type: "verified_badge",
      amount: VERIFIED_BADGE_FEE,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      verified: true,
      expires_at: verified_badge_expires,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[VERIFIED BADGE CHECKOUT ERROR]", error);
    const message =
      error instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(error.statusDetail)
        : "Falha ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
