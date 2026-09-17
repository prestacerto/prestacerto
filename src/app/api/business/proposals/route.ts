import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('proposal_tracking')
      .select('*')
      .eq('freelancer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Calculate stats
    const stats = {
      sent: data?.filter(p => p.status === 'sent').length || 0,
      accepted: data?.filter(p => p.status === 'accepted').length || 0,
      rejected: data?.filter(p => p.status === 'rejected').length || 0,
      viewed: data?.filter(p => p.status === 'viewed').length || 0,
      acceptanceRate: data?.length ? Math.round((data.filter(p => p.status === 'accepted').length / data.length) * 100) : 0
    };

    return NextResponse.json({
      proposals: data,
      stats
    });
  } catch (error) {
    console.error('Proposals error:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}
