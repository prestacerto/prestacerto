import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabase/config';

const noStore = { 'Cache-Control': 'no-store' };

export function GET() {
  return NextResponse.json({ error: 'Use o botão Sair para encerrar a sessão.' }, { status: 405, headers: { ...noStore, Allow: 'POST' } });
}

export async function POST(request: NextRequest) {
  // Browser POSTs include Origin. Refuse missing/foreign origins before any
  // auth operation so another site cannot sign this visitor out.
  if (request.headers.get('origin') !== new URL(request.url).origin
    || request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Origem da solicitação inválida.' }, { status: 403, headers: noStore });
  }

  try {
    const response = NextResponse.json({ success: true }, { headers: noStore });
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    // The default is global. Local only revokes this browser's session;
    // sessions on the user's other devices remain available.
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) return NextResponse.json({ error: 'Não foi possível sair agora. Tente novamente.' }, { status: 503, headers: noStore });
    return response;
  } catch {
    return NextResponse.json({ error: 'Não foi possível sair agora. Tente novamente.' }, { status: 503, headers: noStore });
  }
}
