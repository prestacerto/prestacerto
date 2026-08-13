import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BADGES = {
  'top-developer': {
    name: 'Top Developer',
    description: 'Taxa de sucesso > 95%',
    emoji: '⭐',
    requirement: (stats: any) => stats.win_rate > 95
  },
  'fast-responder': {
    name: 'Resposta Rápida',
    description: 'Tempo médio < 2 horas',
    emoji: '⚡',
    requirement: (stats: any) => stats.avg_response_time < 2
  },
  'trusted': {
    name: 'Freelancer Confiável',
    description: '50+ projetos completados',
    emoji: '🛡️',
    requirement: (stats: any) => stats.completed_projects > 50
  },
  'consistent': {
    name: 'Consistente',
    description: '30 dias seguidos ativo',
    emoji: '🏆',
    requirement: (stats: any) => stats.streak_days >= 30
  },
  'quality': {
    name: 'Qualidade Premium',
    description: 'Rating 4.8+',
    emoji: '💎',
    requirement: (stats: any) => stats.avg_rating >= 4.8
  }
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get user stats
    const { data: stats } = await supabase
      .from('response_metrics')
      .select('*')
      .eq('freelancer_id', user.id)
      .single();

    const { data: streaks } = await supabase
      .from('consistency_streaks')
      .select('*')
      .eq('freelancer_id', user.id)
      .single();

    const userStats = {
      win_rate: stats?.response_rate_percent || 0,
      avg_response_time: stats?.avg_response_time_hours || 0,
      completed_projects: 0,
      streak_days: streaks?.current_streak_days || 0,
      avg_rating: 4.5
    };

    const earned = Object.entries(BADGES)
      .filter(([_, badge]) => badge.requirement(userStats))
      .map(([id, badge]) => ({ id, ...badge }));

    return NextResponse.json({
      total_available: Object.keys(BADGES).length,
      earned_count: earned.length,
      earned_badges: earned,
      all_badges: Object.entries(BADGES).map(([id, b]) => ({ id, ...b }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
