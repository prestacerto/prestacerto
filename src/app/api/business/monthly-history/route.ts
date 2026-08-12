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

    // Chamar função SQL que retorna histórico mensal
    const { data: monthlyData, error } = await supabase.rpc(
      'get_monthly_revenue_history',
      { user_id: user.id }
    );

    if (error) throw error;

    return NextResponse.json({
      monthly: monthlyData || [],
    });
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return NextResponse.json(
      { error: 'Erro ao obter histórico' },
      { status: 500 }
    );
  }
}
