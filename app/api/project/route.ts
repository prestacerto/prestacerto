import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    // Verify profile completion before allowing publication
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/profile`, {
      headers: {
        'oai-authenticated-user-id': user.userId,
        'oai-authenticated-user-email': user.email,
      }
    });

    const profileData = await profileResponse.json();
    if (profileData.profile?.completeness < 100) {
      return new Response(JSON.stringify({
        error: 'Sua conta precisa ser finalizada antes de publicar',
        errorCode: 'PROFILE_INCOMPLETE',
        requiredCompleteness: 100,
        currentCompleteness: profileData.profile?.completeness || 0
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

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
