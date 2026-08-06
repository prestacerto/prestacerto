import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/firebase/auth';
import { createFeaturedListing } from '@/lib/firebase/featured';

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
      featured_basic: 39.9,
      featured_pro: 79.9,
    };

    const price = prices[planType];
    if (!price) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // TODO: Integrar com Mercado Pago
    // 1. Criar preference no MP com o valor (39.90 ou 79.90)
    // 2. Retornar preference ID pra frontend renderizar Brick
    // 3. Webhook pra confirmar pagamento e chamar createFeaturedListing()

    // Placeholder: simular sucesso
    await createFeaturedListing(freelancerId, planType as 'featured_basic' | 'featured_pro', 'mp_featured_placeholder');

    return NextResponse.json({
      success: true,
      message: 'Featured listing created',
      preferenceId: 'mp_featured_placeholder',
    });
  } catch (error) {
    console.error('Featured listing error:', error);
    return NextResponse.json(
      { error: 'Failed to create featured listing' },
      { status: 500 }
    );
  }
}
