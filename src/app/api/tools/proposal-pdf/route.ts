import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getProfile } from '@/lib/auth/getUser';
import { canUseBrandedProposal, exportSchema } from '@/lib/tools/commercial-proposal';
import { createProposalPdf } from '@/lib/tools/proposal-pdf';
import { checkRateLimit } from '@/lib/redis';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };
const recent = new Map<string, { count: number; until: number }>();
function locallyAllowed(key: string) {
  const now = Date.now();
  for (const [id, value] of recent) if (value.until <= now) recent.delete(id);
  const value = recent.get(key);
  if (value) { value.count++; return value.count <= 12; }
  if (recent.size >= 1000) return false;
  recent.set(key, { count: 1, until: now + 60000 });
  return true;
}
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') && request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Origem não permitida.' }, { status: 403, headers });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!locallyAllowed(ip) || !await checkRateLimit(`proposal-pdf:${ip}`, 12, 60)) {
    return NextResponse.json({ error: 'Aguarde um minuto antes de exportar outra proposta.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } });
  }
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('empty');
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 40000) { await reader.cancel(); return NextResponse.json({ error: 'A proposta excede o tamanho permitido.' }, { status: 413, headers }); }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return NextResponse.json({ error: 'Não foi possível ler a proposta.' }, { status: 400, headers }); }
  const parsed = exportSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Revise os campos da proposta.' }, { status: 400, headers });
  if (parsed.data.variant === 'brand') {
    if (!await getAuthenticatedUser()) return NextResponse.json({ error: 'Entre na sua conta Pro ou Business para usar sua marca.' }, { status: 401, headers });
    const profile = await getProfile();
    if (!canUseBrandedProposal(profile?.plan)) return NextResponse.json({ error: 'O PDF com sua marca está incluído nos planos Pro e Business.' }, { status: 403, headers });
  }
  try {
    const pdf = await createProposalPdf(parsed.data.proposal, parsed.data.variant === 'brand', parsed.data.color);
    return new NextResponse(new Uint8Array(pdf), { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="proposta-comercial.pdf"', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    console.error('[proposal-pdf] Falha ao criar documento');
    return NextResponse.json({ error: 'Não foi possível criar o PDF agora. Sua proposta continua disponível para copiar.' }, { status: 503, headers });
  }
}
