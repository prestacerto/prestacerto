import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const { name, email, phone, service, experience } = await req.json();
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    console.log('Signup:', { user: user.email, name, email, phone, service, experience, timestamp: new Date().toISOString() });

    return new Response(JSON.stringify({
      success: true,
      message: 'Cadastro realizado com sucesso',
      id: `user_${Date.now()}`,
      user: { email, name, service }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Erro ao fazer signup:', error);
    return new Response(JSON.stringify({ error: 'Erro ao processar' }), { status: 500 });
  }
}
