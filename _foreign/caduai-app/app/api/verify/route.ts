import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { verificationType, document, phone } = await req.json();
    console.log('Verification started:', { user: user.email, type: verificationType });

    return new Response(JSON.stringify({ success: true, status: 'pending', verificationId: `ver_${Date.now()}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro' }), { status: 500 });
  }
}
