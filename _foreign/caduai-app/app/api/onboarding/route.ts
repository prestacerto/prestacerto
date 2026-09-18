import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { step, data } = await req.json();
    console.log('Onboarding step:', { user: user.email, step, data });

    return new Response(JSON.stringify({ success: true, nextStep: step + 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro' }), { status: 500 });
  }
}
