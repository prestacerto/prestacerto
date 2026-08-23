import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

const ADMIN_KEY = process.env.ADMIN_INIT_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const authKey = request.headers.get('x-admin-key');

    if (!authKey || authKey !== ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Default plans
    const plans = [
      {
        id: 'price_starter',
        name: 'Starter',
        description: 'Perfeito para pequenas equipes',
        type: 'seat',
        base_price: 29900, // R$ 299/mês
        currency: 'BRL',
        billing_interval: 'month',
        features: [
          'Até 3 assentos',
          'Prospecção com IA',
          'Até 10 prospects/dia por assento',
          'Email e WhatsApp',
          'Análise básica',
        ],
      },
      {
        id: 'price_professional',
        name: 'Professional',
        description: 'Para equipes em crescimento',
        type: 'seat',
        base_price: 69900, // R$ 699/mês
        currency: 'BRL',
        billing_interval: 'month',
        features: [
          'Até 10 assentos',
          'Prospecção com IA avançada',
          'Até 30 prospects/dia por assento',
          'Email, WhatsApp e LinkedIn',
          'Análise completa',
          'Integrações com APIs',
          '10% cashback em leads qualificados',
        ],
      },
      {
        id: 'price_enterprise',
        name: 'Enterprise',
        description: 'Para empresas em escala',
        type: 'seat',
        base_price: 199900, // R$ 1.999/mês
        currency: 'BRL',
        billing_interval: 'month',
        features: [
          'Assentos ilimitados',
          'Prospecção com IA customizada',
          'Prospects ilimitados/dia',
          'Todos os canais + integrações custom',
          'Análise preditiva',
          'Webhook customizado',
          '20% cashback em leads qualificados',
          'Suporte prioritário 24/7',
        ],
      },
    ];

    // Insert or update plans
    const { data, error } = await supabase
      .from('stripe_plans')
      .upsert(plans, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error inserting plans:', error);
      return NextResponse.json({ error: 'Failed to insert plans' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Initialized ${data?.length || 0} pricing plans`,
      plans: data,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize plans' },
      { status: 500 }
    );
  }
}
