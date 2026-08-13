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
      .from('business_transactions')
      .select('*')
      .or(`freelancer_id.eq.${user.id},client_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Calculate totals
    const totalRevenue = data?.reduce((sum, t) => sum + (t.amount_cents || 0), 0) || 0;
    const todayRevenue = data?.filter(t =>
      new Date(t.created_at).toDateString() === new Date().toDateString()
    ).reduce((sum, t) => sum + (t.amount_cents || 0), 0) || 0;

    return NextResponse.json({
      transactions: data,
      totals: {
        totalRevenue,
        todayRevenue,
        count: data?.length || 0
      }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
