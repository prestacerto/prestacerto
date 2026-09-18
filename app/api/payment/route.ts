import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { proposalId, amount, paymentMethod, escrow } = await req.json();

    console.log('Payment initiated:', { user: user.email, proposalId, amount, paymentMethod, escrow });

    return new Response(JSON.stringify({
      success: true,
      message: 'Pagamento processado com sucesso',
      id: `pay_${Date.now()}`,
      status: 'in_escrow',
      escrowBalance: amount
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao processar pagamento' }), { status: 500 });
  }
}
