import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { briefing, userEmail } = await req.json();

    // Salvar briefing (pode integrar com DB real depois)
    console.log('Briefing salvo:', { user: user.email, briefing, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({
      success: true,
      message: 'Briefing salvo com sucesso',
      id: `brief_${Date.now()}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao salvar briefing:', error);
    return new Response(JSON.stringify({ error: 'Erro ao processar' }), { status: 500 });
  }
}
