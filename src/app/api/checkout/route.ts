import { NextRequest, NextResponse } from "next/server";

const mercadoPagoToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

interface CheckoutRequest {
  planId: string;
  email: string;
  amount: number;
}

const PLANS: Record<string, { name: string; description: string }> = {
  pro: {
    name: "Pro",
    description: "Plano Pro - R$ 49/mês",
  },
  business: {
    name: "Business",
    description: "Plano Business - R$ 129/mês",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { planId, email, amount } = body;

    if (!planId || !email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!PLANS[planId]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create preference in Mercado Pago
    const preference = {
      items: [
        {
          title: PLANS[planId].name,
          description: PLANS[planId].description,
          picture_url:
            "https://www.mercadopago.com/mla/debajo-logo-mercado-pago-fc0cd64d-7bf5-4f82-b9e0-9ae3906ce3e4.jpg",
          category_id: "services",
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL",
        },
      ],
      payer: {
        email,
      },
      auto_return: "approved",
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercado-pago`,
      external_reference: `${email}_${planId}_${Date.now()}`,
      metadata: {
        planId,
        email,
      },
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mercadoPagoToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Mercado Pago error:", error);
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Track in Facebook Pixel
    if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
      // FB Pixel will be tracked client-side after purchase
    }

    return NextResponse.json({
      preferenceUrl: data.init_point,
      preferenceId: data.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
