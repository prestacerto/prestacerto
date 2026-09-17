import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'São Paulo';

    const supabase = await createClient();

    // Get this week's rankings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { data: rankings } = await supabase
      .from('freelancer_rankings')
      .select('*, auth_users:freelancer_id(name, avatar)')
      .eq('city', city)
      .eq('week_start', weekStart.toISOString().split('T')[0])
      .order('rank_position', { ascending: true })
      .limit(10);

    return NextResponse.json({
      city,
      week_start: weekStart.toISOString(),
      rankings: rankings || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
