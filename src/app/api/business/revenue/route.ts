import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get week and month reports
    const { data: reports, error } = await supabase
      .from('revenue_reports')
      .select('*')
      .eq('freelancer_id', user.id)
      .order('period_start', { ascending: false })
      .limit(12);

    if (error) throw error;

    // Calculate current totals
    const { data: transactions } = await supabase
      .from('business_transactions')
      .select('amount_cents, created_at')
      .eq('freelancer_id', user.id)
      .eq('status', 'completed');

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisWeekRevenue = transactions?.filter(t =>
      new Date(t.created_at) >= thisWeekStart
    ).reduce((sum, t) => sum + (t.amount_cents || 0), 0) || 0;

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastWeekRevenue = transactions?.filter(t => {
      const date = new Date(t.created_at);
      return date >= lastWeekStart && date < thisWeekStart;
    }).reduce((sum, t) => sum + (t.amount_cents || 0), 0) || 0;

    const weekGrowth = lastWeekRevenue ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) : 0;

    return NextResponse.json({
      thisWeekRevenue,
      thisWeekGrowth: weekGrowth,
      reports
    });
  } catch (error) {
    console.error('Revenue error:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
