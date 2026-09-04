import { getChatGPTUser } from '@/app/chatgpt-auth';

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  return phoneRegex.test(phone);
}

function isValidDocument(document: string): boolean {
  const docRegex = /^[\d]{8,20}$/;
  return docRegex.test(document);
}

export async function POST(req: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const body = await req.json();
    const verificationType = String(body.verificationType || '').trim();
    const document = String(body.document || '').trim();
    const phone = String(body.phone || '').trim();

    const validTypes = ['identity', 'phone', 'email'];
    if (!validTypes.includes(verificationType)) {
      return new Response(JSON.stringify({ error: 'Tipo de verificação inválido' }), { status: 400 });
    }

    if (verificationType === 'phone' && !isValidPhone(phone)) {
      return new Response(JSON.stringify({ error: 'Telefone em formato inválido' }), { status: 400 });
    }

    if (verificationType === 'identity' && !isValidDocument(document)) {
      return new Response(JSON.stringify({ error: 'Documento em formato inválido' }), { status: 400 });
    }

    console.log('Verification started:', { userId: user.userId, type: verificationType });

    return new Response(JSON.stringify({ success: true, status: 'pending', verificationId: `ver_${Date.now()}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Verification error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Erro ao processar verificação' }), { status: 500 });
  }
}
