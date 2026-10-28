import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId, unauthorized } from '@/lib/auth/session-user';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();
    const limit = parseInt(searchParams.get('limit') || '10');


    const supabase = createServiceClient();

    const { data: runs, error } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      runs: runs || [],
    });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 }
    );
  }
}
