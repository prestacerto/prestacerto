import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { title, budget, deadline, skills, description } = await req.json();

    console.log('Project published:', { user: user.email, title, budget, deadline, skills, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({
      success: true,
      message: 'Projeto publicado com sucesso',
      id: `proj_${Date.now()}`,
      project: { title, budget, deadline, skills }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Erro ao publicar projeto:', error);
    return new Response(JSON.stringify({ error: 'Erro ao processar' }), { status: 500 });
  }
}
