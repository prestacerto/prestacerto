import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function GET(req: Request) {
  try {
    const user = await getChatGPTUser();
    const notifications = [
      { id: 'n_1', type: 'proposal', title: 'Nova proposta recebida', time: '2h atrás', read: false },
      { id: 'n_2', type: 'message', title: 'Novo mensagem de cliente', time: '4h atrás', read: false },
      { id: 'n_3', type: 'payment', title: 'Pagamento confirmado', time: '1 dia atrás', read: true }
    ];
    return new Response(JSON.stringify({ notifications, unread: 2 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ notifications: [] }), { status: 200 });
  }
}
