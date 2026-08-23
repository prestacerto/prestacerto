import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAuthenticatedUser as getUser } from "@/lib/auth/getUser";
import { checkRateLimit, getClientIP, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";
import crypto from "crypto";

function getSupabaseClient() {
  return createClient(
}
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
}
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}
);

// Validation schema
const initiatePaymentSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  amount: z.number().positive("Amount must be positive").max(999999, "Amount too large"),
  idempotency_key: z.string().min(10).max(100),
  payment_method: z.enum(["card", "pix"]),
});

type InitiatePaymentRequest = z.infer<typeof initiatePaymentSchema>;

/**
 * POST /api/monetization/payments/initiate
 * Create Mercado Pago preference and initiate payment
 *
 * Response: { preference_id, init_point, pix_qr_code?, expires_in }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (clients can't spam payments)
    const ip = getClientIP(req);
    const rateLimitCheck = await checkRateLimit(rateLimiters.proposals, ip);

    if (!rateLimitCheck.success) {
      return rateLimitResponse(rateLimitCheck.reset);
    }

    // 2. Authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Validate request body
    let body: InitiatePaymentRequest;
    try {
      const json = await req.json();
      body = initiatePaymentSchema.parse(json);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request body", details: error instanceof z.ZodError ? error.issues : [] },
        { status: 400 }
      );
    }

    // 4. Verify project exists and user is client
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, title, client_id")
      .eq("id", body.project_id)
      .eq("status", "open")
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found or already closed" },
        { status: 404 }
      );
    }

    if (project.client_id !== user.id) {
      return NextResponse.json(
        { error: "Only project client can make payment" },
        { status: 403 }
      );
    }

    // 5. Verify idempotency - check if this payment already exists
    const { data: existingTransaction } = await supabase
      .from("payment_transactions")
      .select("id, status, mercado_pago_preference_id")
      .eq("idempotency_key", body.idempotency_key)
      .single();

    if (existingTransaction) {
      // Return previous result (idempotent)
      return NextResponse.json(
        {
          preference_id: existingTransaction.mercado_pago_preference_id,
          idempotent: true,
          message: "This payment was already initiated",
        },
        { status: 200 }
      );
    }

    // 6. Calculate fee
    const { data: feeConfig } = await supabase
      .from("fee_config")
      .select("base_fee_percent")
      .eq("active", true)
      .is("category_id", null)
      .single();

    const feePercent = feeConfig?.base_fee_percent || 2.99;
    const fee = (body.amount * feePercent) / 100;
    const totalAmount = body.amount + fee;

    // 7. Create Mercado Pago preference
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `Projeto: ${project.title}`,
            description: `Pagamento do projeto ${project.id}`,
            quantity: 1,
            unit_price: totalAmount,
            currency_id: "BRL",
          },
        ],
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercado-pago`,
        auto_return: "approved",
        payment_methods:
          body.payment_method === "pix"
            ? {
                excluded_payment_types: [{ id: "ticket" }],
              }
            : undefined,
        metadata: {
          project_id: body.project_id,
          client_id: user.id,
          idempotency_key: body.idempotency_key,
        },
      }),
    });

    if (!mpResponse.ok) {
      console.error("MP error:", await mpResponse.text());
      return NextResponse.json(
        { error: "Failed to create payment preference" },
        { status: 502 }
      );
    }

    const preference = await mpResponse.json();

    // 8. Create payment transaction record
    const { data: transaction, error: txError } = await supabase
      .from("payment_transactions")
      .insert({
        client_id: user.id,
        project_id: body.project_id,
        freelancer_id: project.client_id, // Will be set when freelancer accepts
        amount: body.amount,
        payment_method: body.payment_method,
        mercado_pago_preference_id: preference.id,
        idempotency_key: body.idempotency_key,
        status: "pending",
      })
      .select()
      .single();

    if (txError) {
      console.error("Transaction insert error:", txError);
      return NextResponse.json(
        { error: "Failed to record transaction" },
        { status: 500 }
      );
    }

    // 9. Audit log
    await supabase.from("payment_audit_log").insert({
      event_type: "payment_initiated",
      user_id: user.id,
      transaction_id: transaction.id,
      amount: body.amount,
      details: {
        project_id: body.project_id,
        payment_method: body.payment_method,
        preference_id: preference.id,
      },
    });

    return NextResponse.json({
      transaction_id: transaction.id,
      preference_id: preference.id,
      init_point: preference.init_point,
      pix_qr_code: preference.pix?.qr_code,
      pix_copy_paste: preference.pix?.transaction_data?.qr_code,
      expires_in: 300, // 5 minutes
      amount_with_fee: totalAmount,
      fee: fee,
    });
  } catch (error) {
    console.error("Payment initiate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
