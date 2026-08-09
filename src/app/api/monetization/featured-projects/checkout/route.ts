import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import {
  createHeldOrder,
  MercadoPagoOrderError,
  getFriendlyDeclineMessage,
} from "@/lib/payments/mercadopago";
import { decryptSecret } from "@/lib/crypto/token-cipher";

const FEATURED_PROJECT_FEE = 50; // R$ 50
const FEATURED_DAYS = 7;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { project_id, card } = body;

    if (!project_id || !card?.token || !card?.payment_method_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const serviceClient = createServiceClient();

    // Verificar que é o dono do projeto
    const { data: project, error: projError } = await supabase
      .from("projects")
      .select("client_id")
      .eq("id", project_id)
      .single();

    if (projError || !project || project.client_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Criar pagamento no banco
    const { data: payment, error: insertError } = await serviceClient
      .from("payments")
      .insert({
        project_id,
        client_id: user.id,
        amount: FEATURED_PROJECT_FEE,
        status: "pending",
        type: "featured_project",
      })
      .select("id")
      .single();

    if (insertError || !payment) {
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
    }

    // Processar pagamento via Mercado Pago
    // Usar PUBLIC KEY do PrestaCerto (não do freelancer)
    const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
    }

    const order = await createHeldOrder({
      sellerAccessToken: mpAccessToken,
      amount: FEATURED_PROJECT_FEE,
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

    // Ativar featured (confirmamos o pagamento)
    const featured_until = new Date(Date.now() + FEATURED_DAYS * 24 * 60 * 60 * 1000);

    await supabase
      .from("projects")
      .update({
        is_featured: true,
        featured_until,
        featured_fee: FEATURED_PROJECT_FEE,
      })
      .eq("id", project_id);

    // Registrar evento de receita
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      project_id,
      event_type: "featured_project",
      amount: FEATURED_PROJECT_FEE,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      project_id,
      featured: true,
      featured_until,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[FEATURED CHECKOUT ERROR]", error);
    const message =
      error instanceof MercadoPagoOrderError
        ? getFriendlyDeclineMessage(error.statusDetail)
        : "Falha ao processar pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
