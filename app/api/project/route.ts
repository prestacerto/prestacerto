import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();
    const title = String(body.title || '').trim().slice(0, 200);
    const budget = String(body.budget || '').trim().slice(0, 100);
    const deadline = String(body.deadline || '').trim().slice(0, 100);
    const description = String(body.description || '').trim().slice(0, 5000);
    const skills = Array.isArray(body.skills) ? body.skills.slice(0, 10) : [];
    const profileCompleteness = Number(body.profileCompleteness || 0);

    if (!title || title.length < 5) {
      return new Response(JSON.stringify({ error: 'Título deve ter no mínimo 5 caracteres' }), { status: 400 });
    }
    if (!description || description.length < 10) {
      return new Response(JSON.stringify({ error: 'Descrição deve ter no mínimo 10 caracteres' }), { status: 400 });
    }
    if (skills.some(s => typeof s !== 'string' || s.length > 50)) {
      return new Response(JSON.stringify({ error: 'Habilidades com formato inválido' }), { status: 400 });
    }

    if (!profileCompleteness || profileCompleteness < 100) {
      return new Response(JSON.stringify({
        error: 'Sua conta precisa ser finalizada antes de publicar',
        errorCode: 'PROFILE_INCOMPLETE',
        requiredCompleteness: 100,
        currentCompleteness: profileCompleteness || 0
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('Project published:', { userId: user.userId, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({
      success: true,
      message: 'Projeto publicado com sucesso',
      id: `proj_${Date.now()}`,
      project: { title, budget, deadline, skills }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Project publish error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao processar' }), { status: 500 });
  }
}
