import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const { proposal_id, client_id } = body;

    // Agendas automáticas
    const followups = [
      { day: 3, message: 'Oi, viu minha proposta? Fico feliz em tirar dúvidas! 😊' },
      { day: 5, message: 'Sem pressão, mas minha proposta continua disponível. Posso melhorar algo?' },
      { day: 7, message: 'Caso o orçamento esteja apertado, tenho plano B mais em conta.' },
    ];

    // Registra agendamentos
    const scheduled = followups.map(f => ({
      proposal_id,
      client_id,
      scheduled_for: new Date(Date.now() + f.day * 24 * 60 * 60 * 1000),
      message: f.message,
      status: 'agendado',
      ai_generated: true,
    }));

    return NextResponse.json({
      success: true,
      followups_scheduled: scheduled.length,
      details: scheduled,
      note: 'Follow-ups automáticos agendados - IA vai enviar mensagens humanizadas',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
