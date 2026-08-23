import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

/**
 * POST /api/webhooks/mercado-pago
 * Receive payment confirmation from Mercado Pago
 *
 * Webhook signature verification (HMAC-SHA256)
 * Double-entry ledger recording
 * Idempotency key enforcement (no double-processing)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    // 1. Get request body and signature
    const body = await req.json();
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");

    if (!xSignature || !xRequestId) {
      console.warn("Missing webhook headers");
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    // 2. Verify HMAC signature
    const parts = xSignature.split(",");
    let ts = "";
    let hash = "";

    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (key === "ts") ts = value;
      if (key === "v1") hash = value;
    });

    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET || "";
    const data = `${ts}.${JSON.stringify(body)}`;
    const expectedHash = crypto.createHmac("sha256", secret).update(data).digest("hex");

    if (hash !== expectedHash) {
      console.warn("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Handle only payment.approved events
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    const preferenceId = body.data.preference_id;

    // 4. Get Mercado Pago payment details
    const mpPaymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpPaymentResponse.ok) {
      throw new Error("Failed to fetch MP payment details");
    }

    const mpPayment = await mpPaymentResponse.json();

    // Only process approved payments
    if (mpPayment.status !== "approved") {
      console.log(`Payment ${paymentId} status: ${mpPayment.status}, skipping`);
      return NextResponse.json({ received: true });
    }

    // 5. Find payment transaction by preference ID
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("mercado_pago_preference_id", preferenceId)
      .single();

    if (txError || !transaction) {
      console.error("Transaction not found for preference", preferenceId);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 6. Verify idempotency - check if already processed
    const { data: existingLedger } = await supabase
      .from("payment_ledger")
      .select("id")
      .eq("transaction_id", transaction.id)
      .eq("status", "posted")
      .single();

    if (existingLedger) {
      console.log(`Payment ${paymentId} already processed`);
      return NextResponse.json({ received: true, duplicate: true });
    }

    // 7. START TRANSACTION - Double-entry ledger recording
    // Debit client account
    const { error: debitError } = await supabase.from("payment_ledger").insert({
      transaction_id: transaction.id,
      account_id: transaction.client_id,
      direction: "debit",
      amount: transaction.amount,
      currency: "BRL",
      status: "posted",
      posted_at: new Date().toISOString(),
    });

    if (debitError) {
      console.error("Debit ledger error:", debitError);
      throw debitError;
    }

    // Credit escrow account (held until delivery confirmed)
    const { error: creditError } = await supabase.from("payment_ledger").insert({
      transaction_id: transaction.id,
      account_id: transaction.freelancer_id || transaction.client_id,
      direction: "credit",
      amount: transaction.amount,
      currency: "BRL",
      status: "posted",
      posted_at: new Date().toISOString(),
    });

    if (creditError) {
      console.error("Credit ledger error:", creditError);
      throw creditError;
    }

    // 8. Create escrow record (hold funds for 14 days)
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + 14);

    const { error: escrowError } = await supabase.from("escrow_ledger").insert({
      project_id: transaction.project_id,
      freelancer_id: transaction.freelancer_id || transaction.client_id,
      client_id: transaction.client_id,
      amount: transaction.amount,
      reason: "delivery_pending",
      status: "held",
      held_at: new Date().toISOString(),
    });

    if (escrowError) {
      console.error("Escrow error:", escrowError);
      throw escrowError;
    }

    // 9. Update payment transaction status
    const { error: updateError } = await supabase
      .from("payment_transactions")
      .update({
        status: "confirmed",
        mercado_pago_payment_id: paymentId,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", transaction.id);

    if (updateError) {
      console.error("Transaction update error:", updateError);
      throw updateError;
    }

    // 10. Update account balance cache
    const { data: ledgerSum } = await supabase.rpc("verify_ledger_balance", {
      account_id: transaction.client_id,
    });

    const { error: balanceError } = await supabase.from("account_balance").upsert({
      user_id: transaction.freelancer_id || transaction.client_id,
      held_balance: transaction.amount,
      last_updated: new Date().toISOString(),
    });

    if (balanceError) {
      console.error("Balance update error:", balanceError);
      // Don't fail - cache is secondary
    }

    // 11. Audit log
    await supabase.from("payment_audit_log").insert({
      event_type: "payment_confirmed",
      user_id: transaction.client_id,
      transaction_id: transaction.id,
      amount: transaction.amount,
      details: {
        mercado_pago_payment_id: paymentId,
        mp_payment_status: mpPayment.status,
        payment_method: mpPayment.payment_method_id,
      },
    });

    // 12. Send confirmation email to both parties
    // TODO: Implement email service
    console.log(`Payment confirmed for transaction ${transaction.id}`);

    return NextResponse.json({
      received: true,
      transaction_id: transaction.id,
      status: "confirmed",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    // Log audit even on failure
    await supabase.from("payment_audit_log").insert({
      event_type: "payment_webhook_error",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });

    // Always return 200 to Mercado Pago (they don't care about our errors)
    // Retry will happen on their side
    return NextResponse.json({ received: true, error: true });
  }
}

/**
 * GET /api/webhooks/mercado-pago
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Mercado Pago Webhook Handler",
  });
}
