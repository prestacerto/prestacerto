import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/firebase/auth';
import { createPortfolioPremium } from '@/lib/firebase/portfolio-premium';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { freelancerId, planType } = await request.json();

    if (!freelancerId || !planType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify user owns this freelancer profile
    if (user.uid !== freelancerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const prices: Record<string, number> = {
      portfolio_standard: 39.9,
      portfolio_pro: 79.9,
    };

    const price = prices[planType];
    if (!price) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP com o valor (39.90 ou 79.90)
    // 2. Retornar preference ID pra frontend renderizar Brick
    // 3. Webhook pra confirmar pagamento e chamar createPortfolioPremium()

    // Placeholder: simular sucesso
    await createPortfolioPremium(
      freelancerId,
      planType as 'portfolio_standard' | 'portfolio_pro',
      'mp_portfolio_placeholder'
    );

    return NextResponse.json({
      success: true,
      message: 'Portfolio premium created',
      preferenceId: 'mp_portfolio_placeholder',
    });
  } catch (error) {
    console.error('Portfolio premium error:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio premium' },
      { status: 500 }
    );
  }
}
