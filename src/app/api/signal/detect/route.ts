import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { client_id, viewed_profiles, messages_sent, response_time_avg, project_history } = await req.json();

    // Scoring algorithm para detectar se cliente tá pronto pra contratar
    const signals = {
      viewed_profiles: viewed_profiles > 5 ? 20 : 0,
      active_browsing: viewed_profiles > 10 ? 30 : 0,
      messaging_patterns: messages_sent > 3 ? 25 : 0,
      response_urgency: response_time_avg < 2 ? 15 : 0,
      budget_posted: project_history?.length > 0 ? 10 : 0,
    };

    const readiness_score = Math.min(100, Object.values(signals).reduce((a, b) => a + b, 0));
    const is_ready = readiness_score > 70;

    return NextResponse.json({
      success: true,
      client_id,
      readiness_score,
      is_ready_to_hire: is_ready,
      recommendation: is_ready ? '🟢 CONTRATE AGORA' : '🟡 ESTÁ QUENTE',
      signals_detected: signals,
      optimal_timing: is_ready ? 'Agora - cliente está explorando' : 'Aguarde 24h',
      next_check: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      confidence: `${Math.round(readiness_score)}%`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
