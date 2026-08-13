import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const { project_id, content, price } = body;

    if (!project_id || !content || !price) {
      return NextResponse.json(
        { error: 'Projeto, conteúdo e preço obrigatórios' },
        { status: 400 }
      );
    }

    // Insere proposta
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        project_id,
        freelancer_id: user.id,
        content,
        price_cents: Math.round(parseFloat(price) * 100),
        status: 'pendente',
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      proposal: proposal?.[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
