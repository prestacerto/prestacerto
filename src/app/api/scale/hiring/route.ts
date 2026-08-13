import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: team } = await supabase
      .from('user_teams')
      .select('*')
      .eq('owner_id', user.id);

    return NextResponse.json({ team: team || [], count: team?.length || 0 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { junior_id, role, rate } = body;

    const { data, error } = await supabase
      .from('user_teams')
      .insert({
        owner_id: user.id,
        junior_id,
        role,
        monthly_rate: rate * 100,
        status: 'active',
        created_at: new Date(),
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ hired: data?.[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
