import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(req: Request) {
  try {
    const user = await getChatGPTUser();
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') || 'all';

    const opportunities = [
      { id: 'opp_1', title: 'Redesign Website', budget: 'R$ 5-10k', matches: 94, saved: true },
      { id: 'opp_2', title: 'App Development', budget: 'R$ 15-30k', matches: 87, saved: false },
      { id: 'opp_3', title: 'SEO Optimization', budget: 'R$ 2-5k', matches: 91, saved: true }
    ];

    return new Response(JSON.stringify({ opportunities, filter, total: 3 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ opportunities: [] }), { status: 200 });
  }
}
