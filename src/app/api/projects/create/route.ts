import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, budget, deadline, skills, category } = body;

    if (!title || !description || !budget) {
      return NextResponse.json(
        { error: 'Título, descrição e orçamento são obrigatórios' },
        { status: 400 }
      );
    }

    // Create project object
    const project = {
      id: 'proj_' + Date.now(),
      title,
      description,
      budget: parseFloat(budget),
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      skills: skills || [],
      category: category || 'geral',
      status: 'aberto',
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      proposals_count: 0,
      views_count: 0,
    };

    // TODO: Persist to Supabase
    // For now, return success response

    return NextResponse.json({
      success: true,
      project,
      message: 'Projeto publicado com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return NextResponse.json(
      { error: 'Erro ao publicar projeto' },
      { status: 500 }
    );
  }
}
