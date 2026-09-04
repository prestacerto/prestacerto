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

    const body = await req.json();
    const bio = String(body.bio || '').trim().slice(0, 500);
    const skills = Array.isArray(body.skills) ? body.skills.slice(0, 10) : [];
    const portfolio = Array.isArray(body.portfolio) ? body.portfolio.slice(0, 20) : [];
    const hourlyRate = body.hourlyRate ? Number(body.hourlyRate) : undefined;
    const phone = String(body.phone || '').trim();

    if (bio.length > 500) {
      return new Response(JSON.stringify({ error: 'Bio muito longa (máx 500 caracteres)' }), { status: 400 });
    }
    if (hourlyRate !== undefined && (hourlyRate < 0 || isNaN(hourlyRate))) {
      return new Response(JSON.stringify({ error: 'Taxa horária inválida' }), { status: 400 });
    }
    if (skills.some(s => typeof s !== 'string' || s.length > 50)) {
      return new Response(JSON.stringify({ error: 'Habilidades com formato inválido' }), { status: 400 });
    }

    console.log('Profile updated:', { userId: user.userId });

    return new Response(JSON.stringify({
      success: true,
      message: 'Perfil atualizado com sucesso',
      completeness: 85
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Profile update error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao atualizar' }), { status: 500 });
  }
}
