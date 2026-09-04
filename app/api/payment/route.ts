import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();
    const proposalId = String(body.proposalId || '').trim();
    const amount = Number(body.amount);
    const paymentMethod = String(body.paymentMethod || '').trim();
    const escrow = Boolean(body.escrow);

    if (!proposalId) {
      return new Response(JSON.stringify({ error: 'ID de proposta obrigatório' }), { status: 400 });
    }
    if (!amount || amount <= 0 || isNaN(amount)) {
      return new Response(JSON.stringify({ error: 'Valor deve ser maior que zero' }), { status: 400 });
    }
    if (!['card', 'bank_transfer', 'pix'].includes(paymentMethod)) {
      return new Response(JSON.stringify({ error: 'Método de pagamento inválido' }), { status: 400 });
    }

    console.log('Payment initiated:', { userId: user.userId, proposalId });

    return new Response(JSON.stringify({
      success: true,
      message: 'Pagamento processado com sucesso',
      id: `pay_${Date.now()}`,
      status: 'in_escrow',
      escrowBalance: amount
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Payment error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao processar pagamento' }), { status: 500 });
  }
}
