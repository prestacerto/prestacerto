import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Buscar social proof feed (últimas atividades públicas)
    const { data: events, error } = await supabase
      .from('social_proof_feed')
      .select('*')
      .limit(10);

    if (error) throw error;

    return NextResponse.json(events || []);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { event_type, description, amount_value, visibility } = await req.json();

    // Registrar evento de social proof
    const { data: event, error } = await supabase
      .from('social_proof_events')
      .insert({
        freelancer_id: user.id,
        event_type,
        description,
        amount_value,
        visibility: visibility || 'public',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar evento' },
      { status: 500 }
    );
  }
}
