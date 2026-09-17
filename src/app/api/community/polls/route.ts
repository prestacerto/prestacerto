import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('community_polls')
      .select('*')
      .eq('active', true)
      .order('featured_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json({ polls: data || [] });
  } catch (error) {
    console.error('Polls error:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pollId, selectedOption } = await request.json();

    // Check if already voted
    const { data: existing } = await supabase
      .from('poll_responses')
      .select('id')
      .eq('poll_id', pollId)
      .eq('freelancer_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // Record vote
    const { error: insertError } = await supabase
      .from('poll_responses')
      .insert({
        poll_id: pollId,
        freelancer_id: user.id,
        selected_option: selectedOption
      });

    if (insertError) throw insertError;

    // Update poll vote count
    const updateField = `votes_${selectedOption}`;
    const { data: poll } = await supabase
      .from('community_polls')
      .select(updateField)
      .eq('id', pollId)
      .single();

    await supabase
      .from('community_polls')
      .update({ [updateField]: (poll?.[updateField] || 0) + 1 })
      .eq('id', pollId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Poll vote error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
