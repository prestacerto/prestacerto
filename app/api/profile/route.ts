import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    return new Response(JSON.stringify({
      user: { email: user.email, displayName: user.displayName, userId: user.userId },
      profile: { completeness: 65, verified: false, reviews: 0, projects: 0 }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { bio, skills, portfolio, hourlyRate, phone } = await req.json();

    console.log('Profile updated:', { user: user.email, bio, skills, hourlyRate });

    return new Response(JSON.stringify({
      success: true,
      message: 'Perfil atualizado com sucesso',
      completeness: 85
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar' }), { status: 500 });
  }
}
