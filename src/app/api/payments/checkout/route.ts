import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MERCADO_PAGO_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const { data: user } = await supabase.auth.getUser(token);

  if (!user.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item_type, amount, description } = await req.json();

  try {
    const preference = {
      items: [
        {
          title: description,
          unit_price: amount,
          quantity: 1,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: user.user.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments/failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments/pending`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`,
      external_reference: `${user.user.id}-${Date.now()}`,
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!data.id) {
      throw new Error("Failed to create Mercado Pago preference");
    }

    // Log transaction
    await supabase.from("payment_transactions").insert({
      user_id: user.user.id,
      item_type,
      amount,
      status: "pending",
      mercado_pago_id: data.id,
      metadata: { preference_id: data.id },
    });

    return NextResponse.json({
      init_point: data.init_point,
      preference_id: data.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
