import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create response metrics
    let { data: metrics, error } = await supabase
      .from('response_metrics')
      .select('*')
      .eq('freelancer_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // Not found, calculate from proposals
      const { data: proposals } = await supabase
        .from('proposal_tracking')
        .select('*')
        .eq('freelancer_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const responded = proposals?.filter(p =>
        p.status !== 'sent' && p.status !== 'withdrawn'
      ).length || 0;

      const responseRate = proposals?.length ? Math.round((responded / proposals.length) * 100) : 0;

      const avgResponseTime = proposals
        ?.filter(p => p.response_time_hours)
        .reduce((sum, p) => sum + p.response_time_hours, 0) / (proposals?.filter(p => p.response_time_hours).length || 1) || 0;

      metrics = {
        response_rate_percent: responseRate,
        avg_response_time_hours: Math.round(avgResponseTime),
        last_30_days_proposals: proposals?.length || 0,
        last_30_days_responses: responded
      };
    }

    // Get profile visits count
    const { count: visits } = await supabase
      .from('profile_visits')
      .select('id', { count: 'exact' })
      .eq('profile_owner_id', user.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    return NextResponse.json({
      responseRate: metrics?.response_rate_percent || 0,
      avgResponseTime: metrics?.avg_response_time_hours || 0,
      thisWeekVisits: visits || 0,
      proposals30Days: metrics?.last_30_days_proposals || 0
    });
  } catch (error) {
    console.error('Response rate error:', error);
    return NextResponse.json({ error: 'Failed to fetch response rate' }, { status: 500 });
  }
}
