import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Webhook events from MercadoPago
    if (type === 'payment') {
      const { id, status, payer, transaction_amount } = data;

      if (status === 'approved') {
        // Payment approved - transfer to freelancer
        return NextResponse.json({
          success: true,
          message: 'Pagamento aprovado',
          transaction_id: id,
          amount: transaction_amount,
          payer_email: payer.email,
        });
      }

      if (status === 'rejected') {
        // Payment rejected
        return NextResponse.json({
          success: false,
          message: 'Pagamento rejeitado',
          transaction_id: id,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('MercadoPago webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
