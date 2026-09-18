import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(req: Request) {
  try {
    const user = await getChatGPTUser();
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category') || '';

    console.log('Search:', { user: user?.email, query, category });

    // Mock results - integrar com DB real depois
    const results = [
      { id: 'proj_1', title: 'Redesign Website', budget: 'R$ 5-10k', category: 'Design', matches: 89 },
      { id: 'proj_2', title: 'App Development', budget: 'R$ 15-30k', category: 'Dev', matches: 76 },
      { id: 'proj_3', title: 'Marketing Campaign', budget: 'R$ 3-7k', category: 'Marketing', matches: 92 }
    ];

    return new Response(JSON.stringify({ results, total: results.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar' }), { status: 500 });
  }
}
