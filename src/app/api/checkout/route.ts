import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const mercadoPagoToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { items, total } = body;

    if (!items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: "Missing items or total" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create preference in Mercado Pago
    const preference = {
      items: items.map((item) => ({
        title: item.name,
        description: item.name,
        category_id: "services",
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "BRL",
      })),
      payer: {
        email: user.email,
      },
      auto_return: "approved",
      back_urls: {
        success: `${appUrl}/dashboard/checkout/success`,
        failure: `${appUrl}/dashboard/checkout/failure`,
        pending: `${appUrl}/dashboard/checkout/pending`,
      },
      notification_url: `${appUrl}/api/webhooks/mercado-pago`,
      external_reference: `${user.id}_${Date.now()}`,
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
      console.error("[CHECKOUT] Mercado Pago error:", error);
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("[CHECKOUT] Preference created:", data.id);

    try {
      await supabase.from("revenue_events").insert({
        user_id: user.id,
        type: "checkout_initiated",
        amount: total,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        mercado_pago_preference_id: data.id,
        status: "pending",
      });
    } catch (err) {
      console.error("[CHECKOUT] Error logging to DB:", err);
    }

    return NextResponse.json({
      init_point: data.init_point,
      preference_id: data.id,
    });
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
