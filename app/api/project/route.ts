import { getChatGPTUser } from '@/app/chatgpt-auth';

async function getProfileCompleteness(userId: string, email: string): Promise<number> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const profileResponse = await fetch(`${baseUrl}/api/profile`, {
      method: 'GET',
      headers: {
        'oai-authenticated-user-id': userId,
        'oai-authenticated-user-email': email,
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Profile API returned ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    return profileData.profile?.completeness || 0;
  } catch (error) {
    console.error('Error fetching profile completeness:', error);
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    // Verify profile completion before allowing publication
    const completeness = await getProfileCompleteness(user.userId, user.email);

    if (completeness < 100) {
      return new Response(JSON.stringify({
        error: 'Sua conta precisa ser finalizada antes de publicar',
        errorCode: 'PROFILE_INCOMPLETE',
        requiredCompleteness: 100,
        currentCompleteness: completeness
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
