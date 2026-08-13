import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { profileOwnerId } = await request.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profile_visits')
      .insert({
        profile_owner_id: profileOwnerId,
        visitor_id: user?.id || null,
        visitor_type: user ? 'authenticated' : 'anonymous'
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
