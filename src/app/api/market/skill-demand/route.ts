import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get latest week's skill demand data
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('skill_demand_index')
      .select('*')
      .gte('week_date', oneWeekAgo)
      .order('demand_change_percent', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({
      skills: data || [],
      generated_at: new Date()
    });
  } catch (error) {
    console.error('Skill demand error:', error);
    return NextResponse.json({ error: 'Failed to fetch skill demand' }, { status: 500 });
  }
}
