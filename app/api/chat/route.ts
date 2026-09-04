import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();
    const projectId = String(body.projectId || '').trim();
    const proposalId = String(body.proposalId || '').trim();
    const message = String(body.message || '').trim().slice(0, 5000);

    if (!projectId && !proposalId) {
      return new Response(JSON.stringify({ error: 'ID do projeto ou proposta obrigatório' }), { status: 400 });
    }
    if (!message || message.length < 1) {
      return new Response(JSON.stringify({ error: 'Mensagem não pode estar vazia' }), { status: 400 });
    }

    console.log('Chat message:', { userId: user.userId, projectId });

    return new Response(JSON.stringify({ success: true, id: `msg_${Date.now()}`, timestamp: new Date().toISOString() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Chat error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao processar mensagem' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const messages = [
      { id: 'msg_1', from: 'Prestador', message: 'Ótimo projeto!', timestamp: '10:30' },
      { id: 'msg_2', from: 'Você', message: 'Quando você pode começar?', timestamp: '10:45' }
    ];
    return new Response(JSON.stringify({ messages, projectId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ messages: [] }), { status: 200 });
  }
}
