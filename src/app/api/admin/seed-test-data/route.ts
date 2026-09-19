import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SEED_SECRET || 'seed_test_secret_12345';

  if (secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = createServiceClient();

  try {
    // Inserir subscriptions de teste
    const { error: subError } = await db.from('assiny_subscriptions').insert([
      {
        mode: 'live',
        subscription_id: 'sub_test_pro_1',
        customer_email: 'teste1@prestacerto.com.br',
        plan: 'pro',
        active: true,
        last_event_id: 'evt_test_1',
        last_occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        mode: 'live',
        subscription_id: 'sub_test_pro_2',
        customer_email: 'teste2@prestacerto.com.br',
        plan: 'pro',
        active: true,
        last_event_id: 'evt_test_2',
        last_occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        mode: 'live',
        subscription_id: 'sub_test_business_1',
        customer_email: 'teste3@prestacerto.com.br',
        plan: 'business',
        active: true,
        last_event_id: 'evt_test_3',
        last_occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    if (subError && !/duplicate|23505/.test(subError.message)) {
      return NextResponse.json({ error: `Subscriptions error: ${subError.message}` }, { status: 400 });
    }

    // Inserir eventos
    const { error: evtError } = await db.from('assiny_events').insert([
      {
        mode: 'live',
        event_id: 'evt_test_1',
        subscription_id: 'sub_test_pro_1',
        event_type: 'approved_purchase',
        customer_email: 'teste1@prestacerto.com.br',
        plan: 'pro',
        active: true,
        occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied',
      },
      {
        mode: 'live',
        event_id: 'evt_test_2',
        subscription_id: 'sub_test_pro_2',
        event_type: 'approved_purchase',
        customer_email: 'teste2@prestacerto.com.br',
        plan: 'pro',
        active: true,
        occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied',
      },
      {
        mode: 'live',
        event_id: 'evt_test_3',
        subscription_id: 'sub_test_business_1',
        event_type: 'approved_purchase',
        customer_email: 'teste3@prestacerto.com.br',
        plan: 'business',
        active: true,
        occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        outcome: 'applied',
      },
    ]);

    if (evtError && !/duplicate|23505/.test(evtError.message)) {
      return NextResponse.json({ error: `Events error: ${evtError.message}` }, { status: 400 });
    }

    // Inserir pagamentos
    const { error: payError } = await db.from('assiny_payments').insert([
      {
        mode: 'live',
        event_id: 'evt_test_1',
        subscription_id: 'sub_test_pro_1',
        event_type: 'approved_purchase',
        plan: 'pro',
        amount_cents: 5990,
        payment_method: 'PIX',
        customer_email: 'teste1@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        mode: 'live',
        event_id: 'evt_test_2',
        subscription_id: 'sub_test_pro_2',
        event_type: 'approved_purchase',
        plan: 'pro',
        amount_cents: 5990,
        payment_method: 'CARTÃO',
        customer_email: 'teste2@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        mode: 'live',
        event_id: 'evt_test_3',
        subscription_id: 'sub_test_business_1',
        event_type: 'approved_purchase',
        plan: 'business',
        amount_cents: 9990,
        payment_method: 'BOLETO',
        customer_email: 'teste3@prestacerto.com.br',
        occurred_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

    if (payError && !/duplicate|23505/.test(payError.message)) {
      return NextResponse.json({ error: `Payments error: ${payError.message}` }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Test data inserted successfully',
      expected: {
        pro_subscriptions: 2,
        business_subscriptions: 1,
        mrr: 179.70,
        total_revenue: 179.70,
      },
    });
  } catch (error) {
    console.error('[SEED] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
