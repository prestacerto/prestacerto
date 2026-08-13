import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, description, payer_email, external_reference } = await req.json();

    const mp_token = process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST_TOKEN';

    // Create preference in MercadoPago
    const preference = {
      items: [
        {
          title: description,
          unit_price: amount,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: payer_email,
      },
      external_reference,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/mercadopago/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/pending`,
      },
      auto_return: 'approved',
    };

    // In production, call MercadoPago API with mp_token
    // For now, return mock response
    const mockPreferenceId = `TEST_${Date.now()}`;

    return NextResponse.json({
      success: true,
      preference_id: mockPreferenceId,
      checkout_url: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${mockPreferenceId}`,
      amount,
      currency: 'BRL',
      description,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
