import { NextRequest, NextResponse } from "next/server";
import { sendPaymentReceivedEmail } from "@/lib/email-notifications";
import { trackFBEvent } from "@/components/facebook-pixel";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mercado Pago sends webhook with topic and id
    const { topic, id } = body;

    if (topic === "payment") {
      // Get payment details
      const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch payment details");
        return NextResponse.json(
          { error: "Failed to fetch payment" },
          { status: 400 }
        );
      }

      const payment = await response.json();

      // Check if payment was approved
      if (payment.status === "approved") {
        const { email, planId } = payment.metadata;

        // TODO: Update user subscription in database
        // TODO: Activate plan features
        // TODO: Create subscription record

        // Send confirmation email
        const planName = planId === "pro" ? "Pro" : "Business";
        const amount = payment.transaction_amount;

        await sendPaymentReceivedEmail(email, planName, amount);

        // Track purchase in Facebook Pixel
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: amount,
            currency: "BRL",
            content_type: "subscription",
            content_id: planId,
          });
        }

        console.log(`Payment approved for ${email} - Plan: ${planId}`);
      }

      if (payment.status === "rejected") {
        const { email } = payment.metadata;
        console.log(`Payment rejected for ${email}`);
        // TODO: Send rejection email with retry option
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
