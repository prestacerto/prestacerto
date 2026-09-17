import 'server-only';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

// A checkout is unavailable until provider confirmation and entitlement delivery
// are integrated. This guard never creates financial records or calls a gateway.
export async function unavailableAssinyOperation(message = 'Este produto está em preparação para pagamento pelo Assiny. Nenhuma cobrança foi criada.') {
  if (!await getAuthenticatedUser()) {
    return NextResponse.json({ error: 'Entre na sua conta para continuar.' }, { status: 401 });
  }
  return NextResponse.json({ error: message, code: 'assiny_operation_unavailable' }, { status: 503 });
}
