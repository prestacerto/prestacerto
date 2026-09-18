import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { targetUserId, rating, comment, projectId } = await req.json();

    console.log('Review posted:', { from: user.email, to: targetUserId, rating, projectId });

    return new Response(JSON.stringify({
      success: true,
      message: 'Avaliação enviada com sucesso',
      id: `rev_${Date.now()}`,
      averageRating: 4.8
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao enviar avaliação' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    const reviews = [
      { id: 'rev_1', rating: 5, comment: 'Excelente profissional!', author: 'João Silva', date: '2 dias atrás' },
      { id: 'rev_2', rating: 4.5, comment: 'Muito bom, recomendo', author: 'Maria Santos', date: '1 semana atrás' }
    ];

    return new Response(JSON.stringify({ reviews, averageRating: 4.75, total: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ reviews: [], averageRating: 0 }), { status: 200 });
  }
}
