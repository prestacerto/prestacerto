import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();
    const projectId = String(body.projectId || '').trim();
    const value = Number(body.value);
    const description = String(body.description || '').trim().slice(0, 2000);
    const timeline = String(body.timeline || '').trim().slice(0, 100);

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'ID do projeto obrigatório' }), { status: 400 });
    }
    if (!value || value <= 0 || isNaN(value)) {
      return new Response(JSON.stringify({ error: 'Valor da proposta deve ser maior que zero' }), { status: 400 });
    }
    if (!description || description.length < 10) {
      return new Response(JSON.stringify({ error: 'Descrição deve ter no mínimo 10 caracteres' }), { status: 400 });
    }
    if (!timeline) {
      return new Response(JSON.stringify({ error: 'Timeline obrigatória' }), { status: 400 });
    }

    console.log('Proposal sent:', { userId: user.userId, projectId });

    return new Response(JSON.stringify({
      success: true,
      message: 'Proposta enviada com sucesso',
      id: `prop_${Date.now()}`,
      status: 'pending_review'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Proposal error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao enviar proposta' }), { status: 500 });
  }
}
