import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";

const PRIORITY_TIERS = {
  gold: { days: 3, price: 15.90 },
  platinum: { days: 7, price: 25.90 },
  diamond: { days: 14, price: 40.90 },
};

type TierKey = keyof typeof PRIORITY_TIERS;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { tier, card } = body;

    if (!tier || !Object.keys(PRIORITY_TIERS).includes(tier) || !card?.token) {
      return NextResponse.json({ error: "Invalid tier or missing card data" }, { status: 400 });
    }

    const tierData = PRIORITY_TIERS[tier as TierKey];
    const serviceClient = createServiceClient();

    // Registrar compra
    const { data: purchase, error: insertError } = await serviceClient
      .from("priority_queue_purchases")
      .insert({
        user_id: user.id,
        tier,
        duration_days: tierData.days,
        price: tierData.price,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !purchase) {
      return NextResponse.json({ error: "Failed to create purchase record" }, { status: 500 });
    }

    // Processar pagamento via Mercado Pago
    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const order = await createHeldOrder({
      sellerAccessToken: mpAccessToken,
      amount: tierData.price,
      externalReference: purchase.id,
      payerEmail: user.email ?? "",
      card,
    });

    const isHeld = order.status === "action_required" || order.status_detail === "waiting_capture";

    await serviceClient
      .from("priority_queue_purchases")
      .update({
        mp_order_id: order.id,
        status: isHeld ? "completed" : "pending",
        completed_at: isHeld ? new Date().toISOString() : null,
      })
      .eq("id", purchase.id);

    if (!isHeld) {
      return NextResponse.json(
        { error: "Payment not held as expected" },
        { status: 502 }
      );
    }

    // Ativar priority queue
    const expiresAt = new Date(Date.now() + tierData.days * 24 * 60 * 60 * 1000);

    const supabase = await createClient();
    await supabase
      .from("profiles")
      .update({
        priority_queue_active: true,
        priority_queue_expires: expiresAt,
        priority_queue_tier: tier,
      })
      .eq("id", user.id);

    // Criar subscription record
    await serviceClient.from("priority_queue_subscriptions").insert({
      user_id: user.id,
      tier,
      status: "active",
      expires_at: expiresAt,
      price: tierData.price,
      mp_order_id: order.id,
    });

    // Registrar evento de receita
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      event_type: "priority_queue",
      amount: tierData.price,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      tier,
      duration_days: tierData.days,
      expires_at: expiresAt,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[PRIORITY QUEUE ERROR]", error);
    const message =
      error instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(error.statusDetail)
        : "Falha ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
