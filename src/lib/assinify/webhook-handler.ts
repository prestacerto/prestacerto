// ASSINIFY WEBHOOK HANDLER
// Processa eventos de pagamento Assinify
// Atualiza subscriptions, pontos, acesso do user

import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export interface AssinifyWebhookPayload {
  id: string;
  event: "subscription.created" | "subscription.updated" | "subscription.cancelled" | "payment.completed" | "payment.failed";
  timestamp: number;
  data: {
    subscription_id?: string;
    product_id: string;
    customer_id: string;
    customer_email: string;
    amount: number;
    status: "active" | "cancelled" | "pending";
    next_billing_date?: string;
  };
}

export async function handleAssinifyWebhook(
  payload: AssinifyWebhookPayload,
  supabaseUrl: string,
  supabaseKey: string
) {
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });

  try {
    const { data: user } = await supabase
      .from("auth.users")
      .select("id")
      .eq("email", payload.data.customer_email)
      .single();

    if (!user) {
      console.warn(`User not found: ${payload.data.customer_email}`);
      return { success: false, error: "User not found" };
    }

    // Handle different webhook events
    switch (payload.event) {
      case "subscription.created":
      case "subscription.updated":
        return await handleSubscriptionCreated(
          supabase,
          user.id,
          payload.data
        );

      case "subscription.cancelled":
        return await handleSubscriptionCancelled(
          supabase,
          user.id,
          payload.data
        );

      case "payment.completed":
        return await handlePaymentCompleted(supabase, user.id, payload.data);

      case "payment.failed":
        return await handlePaymentFailed(supabase, user.id, payload.data);

      default:
        return { success: false, error: "Unknown event" };
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return { success: false, error: String(error) };
  }
}

async function handleSubscriptionCreated(
  supabase: any,
  userId: string,
  data: any
) {
  try {
    // Update or create certo_user_products
    const { error: insertError } = await supabase
      .from("certo_user_products")
      .upsert(
        {
          user_id: userId,
          product_id: data.product_id,
          subscription_id: data.subscription_id,
          subscription_status: "active",
          billing_amount: data.amount,
          next_billing_date: data.next_billing_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,product_id",
        }
      );

    if (insertError) throw insertError;

    // Award points for subscription
    await supabase
      .from("certo_user_points")
      .update({
        total_points: supabase.raw("total_points + 50"),
      })
      .eq("user_id", userId);

    // Log usage
    await supabase.from("certo_product_usage").insert({
      user_id: userId,
      product_id: data.product_id,
      action: "subscription_created",
      metadata: {
        amount: data.amount,
        subscription_id: data.subscription_id,
      },
    });

    return { success: true, action: "subscription_created" };
  } catch (error) {
    console.error("Error handling subscription created:", error);
    throw error;
  }
}

async function handleSubscriptionCancelled(
  supabase: any,
  userId: string,
  data: any
) {
  try {
    const { error } = await supabase
      .from("certo_user_products")
      .update({
        subscription_status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("product_id", data.product_id);

    if (error) throw error;

    return { success: true, action: "subscription_cancelled" };
  } catch (error) {
    console.error("Error handling subscription cancelled:", error);
    throw error;
  }
}

async function handlePaymentCompleted(
  supabase: any,
  userId: string,
  data: any
) {
  try {
    // Create transaction record
    const { error } = await supabase.from("certo_transactions").insert({
      user_id: userId,
      product_id: data.product_id,
      amount: data.amount,
      transaction_type: "subscription_payment",
      status: "completed",
      assinify_transaction_id: data.subscription_id,
      metadata: {
        customer_email: data.customer_email,
      },
    });

    if (error) throw error;

    return { success: true, action: "payment_completed" };
  } catch (error) {
    console.error("Error handling payment completed:", error);
    throw error;
  }
}

async function handlePaymentFailed(
  supabase: any,
  userId: string,
  data: any
) {
  try {
    // Log failed payment
    const { error } = await supabase.from("certo_transactions").insert({
      user_id: userId,
      product_id: data.product_id,
      amount: data.amount,
      transaction_type: "subscription_payment",
      status: "failed",
      assinify_transaction_id: data.subscription_id,
      metadata: {
        customer_email: data.customer_email,
        error_reason: "Payment failed",
      },
    });

    if (error) throw error;

    // TODO: Send email notification to user about failed payment

    return { success: true, action: "payment_failed" };
  } catch (error) {
    console.error("Error handling payment failed:", error);
    throw error;
  }
}
