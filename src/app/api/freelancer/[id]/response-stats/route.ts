import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Buscar propostas do freelancer
    const { data: proposals, error } = await supabase
      .from('proposal_tracking')
      .select('response_time_minutes, sent_at, status')
      .eq('freelancer_id', id)
      .limit(100);

    if (error) throw error;

    if (!proposals || proposals.length === 0) {
      return NextResponse.json({
        average_response_time_minutes: 0,
        response_rate: 0,
        last_response_date: null,
      });
    }

    // Calcular estatísticas
    const respondedProposals = proposals.filter(p => p.response_time_minutes !== null);
    const averageTime = respondedProposals.length > 0
      ? Math.round(
          respondedProposals.reduce((sum, p) => sum + (p.response_time_minutes || 0), 0) /
          respondedProposals.length
        )
      : 0;

    const responseRate = Math.round(
      (respondedProposals.length / proposals.length) * 100
    );

    const lastResponse = respondedProposals.length > 0
      ? new Date(Math.max(
          ...respondedProposals
            .filter(p => p.sent_at)
            .map(p => new Date(p.sent_at).getTime())
        )).toISOString()
      : null;

    return NextResponse.json({
      average_response_time_minutes: averageTime,
      response_rate: responseRate,
      last_response_date: lastResponse,
      total_proposals: proposals.length,
      responded_proposals: respondedProposals.length,
    });
  } catch (error) {
    console.error('Erro ao obter stats de resposta:', error);
    return NextResponse.json(
      { error: 'Erro ao obter estatísticas' },
      { status: 500 }
    );
  }
}
