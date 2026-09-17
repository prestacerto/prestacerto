import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const proposalId = searchParams.get('proposal_id');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('proposal_id', proposalId)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const payload = await req.json();
  const proposalId = payload.proposalId ?? payload.proposal_id;
  const body = payload.body ?? payload.content;

  if (typeof proposalId !== 'string' || typeof body !== 'string' || !body.trim()) {
    return NextResponse.json({ error: 'Proposta e mensagem são obrigatórias.' }, { status: 400 });
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('messages')
    .insert([{ proposal_id: proposalId, sender_id: user.user.id, body: body.trim() }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: data });
}
