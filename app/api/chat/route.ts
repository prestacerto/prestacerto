import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { projectId, proposalId, message } = await req.json();
    console.log('Chat message:', { from: user.email, projectId, message });

    return new Response(JSON.stringify({ success: true, id: `msg_${Date.now()}`, timestamp: new Date().toISOString() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro' }), { status: 500 });
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
