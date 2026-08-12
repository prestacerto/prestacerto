import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Salvar interesse em projeto (swipe like)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { projectId } = await req.json();

    // Salvar interesse
    const { error } = await supabase
      .from('project_interests')
      .insert({
        user_id: user.id,
        project_id: projectId,
        interaction_type: 'swipe_like',
      });

    if (error && error.code !== '23505') throw error; // 23505 = duplicate key

    // Log activity para streak
    await supabase.rpc('log_user_activity', {
      p_user_id: user.id,
      p_activity_type: 'project_interest',
    });

    // Get updated streak
    const { data: streak } = await supabase
      .from('user_streak_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      streak: streak || { current_streak: 0 },
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar interesse' },
      { status: 500 }
    );
  }
}
