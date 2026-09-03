import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { title, description, imageUrl, link, category } = await req.json();
    console.log('Portfolio added:', { user: user.email, title, category });

    return new Response(JSON.stringify({ success: true, id: `port_${Date.now()}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const portfolio = [
      { id: 'port_1', title: 'Redesign Ecommerce', category: 'Design', image: '🎨' },
      { id: 'port_2', title: 'App Mobile', category: 'Dev', image: '📱' }
    ];
    return new Response(JSON.stringify({ portfolio, total: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ portfolio: [] }), { status: 200 });
  }
}
