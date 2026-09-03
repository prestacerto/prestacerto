import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(req: Request) {
  try {
    const user = await getChatGPTUser();
    const matches = [
      { id: 'match_1', title: 'Design UI/UX', match: 94, reason: 'Suas skills combinam perfeitamente' },
      { id: 'match_2', title: 'Mobile App', match: 87, reason: 'Cliente procura React Developer' },
      { id: 'match_3', title: 'SEO Consultant', match: 91, reason: 'Experiência com marketing digital' }
    ];
    return new Response(JSON.stringify({ matches }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ matches: [] }), { status: 200 });
  }
}
