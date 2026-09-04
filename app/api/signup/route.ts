import { getChatGPTUser } from '@/app/chatgpt-auth';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim().slice(0, 100);
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim().slice(0, 50);
    const experience = String(body.experience || '').trim().slice(0, 20);

    if (!name || name.length < 2) {
      return new Response(JSON.stringify({ error: 'Nome inválido (mínimo 2 caracteres)' }), { status: 400 });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
    }
    if (phone && !isValidPhone(phone)) {
      return new Response(JSON.stringify({ error: 'Telefone em formato inválido' }), { status: 400 });
    }
    if (!service) {
      return new Response(JSON.stringify({ error: 'Serviço obrigatório' }), { status: 400 });
    }

    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    console.log('Signup:', { userId: user.userId, service, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({
      success: true,
      message: 'Cadastro realizado com sucesso',
      id: `user_${Date.now()}`,
      user: { email, name, service }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Signup error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao processar' }), { status: 500 });
  }
}
