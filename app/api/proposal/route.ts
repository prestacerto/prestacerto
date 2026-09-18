import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { projectId, value, description, timeline } = await req.json();

    console.log('Proposal sent:', { user: user.email, projectId, value, timeline });

    return new Response(JSON.stringify({
      success: true,
      message: 'Proposta enviada com sucesso',
      id: `prop_${Date.now()}`,
      status: 'pending_review'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao enviar proposta' }), { status: 500 });
  }
}
