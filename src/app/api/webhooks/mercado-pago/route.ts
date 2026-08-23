import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, id } = body;

    if (topic !== "payment") {
      return NextResponse.json({ received: true });
    }

    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("[MP WEBHOOK] Failed to fetch payment");
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const payment = await response.json();
    console.log("[MP WEBHOOK] Payment status:", payment.status, "ID:", payment.id);

    if (payment.status === "approved") {
      const supabase = createServiceClient();
      const externalRef = payment.external_reference;
      const userId = externalRef?.split("_")[0];

      if (!userId) {
        console.error("[MP WEBHOOK] No user ID in reference");
        return NextResponse.json({ received: true });
      }

      // Activate features based on items
      const itemsNames = payment.description || "";
      const isConnectares = itemsNames.includes("Conectares");
      const isPriorityQueue = itemsNames.includes("Priority");

      const updates: Record<string, any> = {
        last_payment_date: new Date().toISOString(),
      };

      if (isConnectares) {
        updates.conectares_active = true;
        updates.conectares_expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      if (isPriorityQueue) {
        updates.priority_queue_active = true;
        updates.priority_queue_expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      // Update user profile with activated features
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (updateError) {
        console.error("[MP WEBHOOK] Error updating profile:", updateError);
        return NextResponse.json({ received: false }, { status: 500 });
      }

      // Activate premium monetization plans
      const description = payment.description || "";
      const monetizationPlans: Record<string, any> = {};

      if (description.includes("Destaque")) {
        const days = description.includes("30") ? 30 : 7;
        monetizationPlans.featured_listing_expires = new Date(
          Date.now() + days * 24 * 60 * 60 * 1000
        ).toISOString();
      }
      if (description.includes("Job Alerts Premium")) {
        monetizationPlans.job_alerts_premium_expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();
      }
      if (description.includes("Analytics Pro")) {
        monetizationPlans.analytics_pro_expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();
      }
      if (description.includes("Suporte Prioritário")) {
        monetizationPlans.priority_support_expires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();
      }

      if (Object.keys(monetizationPlans).length > 0) {
        await supabase
          .from("profiles")
          .update(monetizationPlans)
          .eq("id", userId);
      }

    // Log transaction
      const { error: logError } = await supabase.from("revenue_events").insert({
        user_id: userId,
        type: "payment_approved",
        amount: payment.transaction_amount,
        mercado_pago_payment_id: payment.id,
        status: "approved",
        metadata: {
          conectares: isConnectares,
          priority_queue: isPriorityQueue,
          monetization_plans: monetizationPlans,
        },
      });

      if (logError) {
        console.error("[MP WEBHOOK] Error logging:", logError);
      }

      console.log(`[MP WEBHOOK] Payment approved for user ${userId} - Amount: ${payment.transaction_amount}`);
      return NextResponse.json({ received: true });
    }

    if (payment.status === "rejected") {
      console.log(`[MP WEBHOOK] Payment rejected - ID: ${payment.id}`);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
