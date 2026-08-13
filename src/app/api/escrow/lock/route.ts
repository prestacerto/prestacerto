import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const { project_id, freelancer_id, amount } = body;

    if (!project_id || !freelancer_id || !amount) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 });
    }

    // Verifica se cliente é o dono do projeto
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', project_id)
      .single();

    if (project?.client_id !== user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    // Cria transação em escrow
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        project_id,
        freelancer_id,
        amount_cents: Math.round(parseFloat(amount) * 100),
        status: 'pendente',
        escrow_status: 'locked',
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      transaction: transaction?.[0],
      note: 'Dinheiro trancado em escrow - freelancer não recebe até conclusão',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
