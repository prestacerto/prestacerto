import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let { data: streak } = await supabase
      .from('consistency_streaks')
      .select('*')
      .eq('freelancer_id', user.id)
      .single();

    if (!streak) {
      await supabase
        .from('consistency_streaks')
        .insert({
          freelancer_id: user.id,
          current_streak_days: 1,
          longest_streak_days: 1,
          last_activity_date: new Date().toISOString().split('T')[0],
          active_this_month: true
        });

      streak = {
        current_streak_days: 1,
        longest_streak_days: 1,
        last_activity_date: new Date().toISOString().split('T')[0]
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const lastDay = streak.last_activity_date;
    const dayDiff = Math.floor((new Date(today).getTime() - new Date(lastDay).getTime()) / 86400000);

    if (dayDiff === 1) {
      streak.current_streak_days += 1;
      if (streak.current_streak_days > streak.longest_streak_days) {
        streak.longest_streak_days = streak.current_streak_days;
      }

      await supabase
        .from('consistency_streaks')
        .update({
          current_streak_days: streak.current_streak_days,
          longest_streak_days: streak.longest_streak_days,
          last_activity_date: today
        })
        .eq('freelancer_id', user.id);
    } else if (dayDiff > 1) {
      streak.current_streak_days = 1;
      await supabase
        .from('consistency_streaks')
        .update({
          current_streak_days: 1,
          last_activity_date: today
        })
        .eq('freelancer_id', user.id);
    }

    const earned = streak.current_streak_days >= 30;

    return NextResponse.json({
      streak: streak.current_streak_days,
      earned,
      message: earned ? '🏆 Badge de Consistência desbloqueado!' : `${30 - streak.current_streak_days} dias para badge`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
