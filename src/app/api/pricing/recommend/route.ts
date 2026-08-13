import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skill, experience_years, market_demand, urgency, project_scope } = body;

    // IA pricing algorithm
    const basePrice = 2000;
    const skillMultiplier = ['Claude', 'FastAPI', 'LLM', 'AI'].some(s => skill.includes(s)) ? 2.5 : 1.5;
    const experienceMultiplier = experience_years >= 3 ? 1.3 : 1;
    const urgencyMultiplier = urgency === 'urgent' ? 1.2 : urgency === 'normal' ? 1 : 0.8;
    const scopeMultiplier = project_scope === 'large' ? 1.5 : project_scope === 'medium' ? 1.2 : 1;

    const recommendedPrice = Math.round(
      basePrice * skillMultiplier * experienceMultiplier * urgencyMultiplier * scopeMultiplier
    );

    return NextResponse.json({
      success: true,
      recommended_price: recommendedPrice,
      price_range: {
        conservative: Math.round(recommendedPrice * 0.8),
        aggressive: Math.round(recommendedPrice * 1.2),
      },
      market_average: Math.round(recommendedPrice * 0.9),
      your_advantage: `${Math.round((recommendedPrice / (recommendedPrice * 0.9) - 1) * 100)}% acima da média`,
      expected_increase: `Cobrando R$ ${recommendedPrice}, você ganha ~R$ ${recommendedPrice * 0.3}/mês a mais`,
      tips: [
        'Negocie escopo antes de fechar',
        'Deixe claro timeline de entrega',
        'Peça 50% adiantado em escrow',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
