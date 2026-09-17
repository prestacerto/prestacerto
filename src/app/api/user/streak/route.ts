import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar streak info (usando view)
    const { data: streakData, error } = await supabase
      .from('user_streak_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Se não existe, criar
    if (!streakData) {
      const { data: newStreak } = await supabase
        .from('user_streaks')
        .insert({ user_id: user.id })
        .select()
        .single();

      return NextResponse.json({
        current_streak: 0,
        max_streak: 0,
        bonus_balance: 0,
        days_until_bonus: 7,
        next_bonus_amount: 5000,
      });
    }

    return NextResponse.json(streakData);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar streak' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { activity_type } = await req.json();

    // Log activity
    const { error } = await supabase.rpc('log_user_activity', {
      p_user_id: user.id,
      p_activity_type: activity_type,
    });

    if (error) throw error;

    // Get updated streak
    const { data: updated } = await supabase
      .from('user_streak_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar streak' },
      { status: 500 }
    );
  }
}
