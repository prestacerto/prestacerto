import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET() {
  try {
    const user = await getChatGPTUser();
    if (!user) {
      return new Response(JSON.stringify({ user: null }), { status: 200 });
    }
    return new Response(JSON.stringify({ user: { email: user.email, displayName: user.displayName } }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }
}
