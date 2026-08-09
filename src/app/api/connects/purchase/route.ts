import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { package_id, card } = body;

    if (!package_id || !card?.token || !card?.payment_method_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    // Buscar detalhes do pacote
    const { data: package_, error: pkgError } = await serviceClient
      .from("connects_packages")
      .select("*")
      .eq("id", package_id)
      .single();

    if (pkgError || !package_ || !package_.is_active) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Criar registro de compra
    const { data: purchase, error: insertError } = await serviceClient
      .from("connects_purchases")
      .insert({
        user_id: user.id,
        package_id,
        connects_amount: package_.connects_amount,
        price: package_.price,
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
      amount: Number(package_.price),
      externalReference: purchase.id,
      payerEmail: user.email ?? "",
      card,
    });

    const isHeld = order.status === "action_required" || order.status_detail === "waiting_capture";

    await serviceClient
      .from("connects_purchases")
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

    // Adicionar conectares à cota do usuário
    await serviceClient.rpc("reset_monthly_connects");

    await serviceClient
      .from("user_connects_quota")
      .update({
        connects_available: serviceClient.sql`connects_available + ${package_.connects_amount}`,
      })
      .eq("user_id", user.id);

    // Registrar transação
    await serviceClient.from("connects_transactions").insert({
      user_id: user.id,
      connects_spent: -package_.connects_amount, // Negativo = ganho
      transaction_type: "purchase",
      reason: `Compra: ${package_.name}`,
    });

    // Registrar evento de receita
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      event_type: "connects_purchase",
      amount: package_.price,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      purchase_id: purchase.id,
      connects_purchased: package_.connects_amount,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[CONNECTS PURCHASE ERROR]", error);
    const message =
      error instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(error.statusDetail)
        : "Falha ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
