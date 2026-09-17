import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const badges = [
      { badge: '✅ Verified Professional', earned: true, description: 'Identidade verificada' },
      { badge: '🏆 Top Performer', earned: true, description: 'Taxa de ganho > 80%' },
      { badge: '⚡ Fast Response', earned: true, description: 'Responde em < 1h' },
      { badge: '💎 Quality Score', earned: false, description: 'Score médio > 4.8★' },
      { badge: '🔥 Trending', earned: false, description: 'Top 1% do mês' },
    ];

    return NextResponse.json({
      success: true,
      badges_earned: badges.filter(b => b.earned).length,
      total_badges: badges.length,
      badges,
      profile_boost: 'Sua visibilidade nas buscas +35%',
      trust_score: 92,
      recommendation: 'Ganhe "Quality Score" badge pra aparecer em posição destaque',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
