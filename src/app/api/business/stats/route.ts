import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Chamar função SQL que calcula as estatísticas
    const { data: stats, error } = await supabase.rpc(
      'get_business_stats',
      { user_id: user.id }
    );

    if (error) throw error;

    return NextResponse.json(stats?.[0] || {
      total_earned: 0,
      completed_projects: 0,
      proposals_sent: 0,
      proposals_accepted: 0,
      acceptance_rate: 0,
      average_project_value: 0,
      avg_response_time_minutes: 0,
      monthly_revenue: 0,
    });
  } catch (error) {
    console.error('Erro ao obter stats:', error);
    return NextResponse.json(
      { error: 'Erro ao obter estatísticas' },
      { status: 500 }
    );
  }
}
