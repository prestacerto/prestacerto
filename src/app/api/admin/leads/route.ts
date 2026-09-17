import { NextRequest, NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/auth/admin';
import { createServiceClient } from '@/lib/supabase/service';
import { readJsonObject } from '@/lib/http/request-body';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };
const statuses = ['novo', 'em_atendimento', 'convertido'] as const;
type LeadStatus = typeof statuses[number];
const isStatus = (value: unknown): value is LeadStatus => typeof value === 'string' && statuses.includes(value as LeadStatus);
const statusOf = (record: Record<string, unknown>): LeadStatus => isStatus(record.status) ? record.status : 'novo';
function readLeadRecord(message: string): Record<string, unknown> | null {
  try {
    const record = JSON.parse(message);
    if (record && typeof record === 'object' && !Array.isArray(record) && record.kind === 'prestacerto-landing-lead'
      && record.lead && typeof record.lead === 'object' && !Array.isArray(record.lead)) return record;
  } catch { /* Other contact text is not a landing lead. */ }
  return null;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminContext();
  if (admin?.role !== 'super_admin') return NextResponse.json({ error: 'Acesso restrito.' }, { status: 403, headers });
  const rawPage = request.nextUrl.searchParams.get('page') ?? '1';
  const page = /^\d+$/.test(rawPage) ? Math.min(10000, Math.max(1, Number(rawPage))) : 1;
  try {
    const db = createServiceClient();
    const { data, error } = await db.from('contact_messages').select('id,name,email,subject,message,created_at')
      .like('subject', '[Landing PrestaCerto] %').order('created_at', { ascending: false }).order('id', { ascending: false }).range((page - 1) * 50, page * 50);
    if (error) throw error;
    const leads = (data ?? []).slice(0, 50).map(row => {
      const record = readLeadRecord(row.message);
      const details = record?.lead as Record<string, unknown> | undefined;
      const text = (key: string) => typeof details?.[key] === 'string' ? details[key] : '';
      return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at, status: statusOf(record ?? {}), journey: text('journey'), service: text('service'), whatsapp: text('whatsapp'), location: text('location'), description: text('description'), deadline: text('deadline'), portfolio: text('portfolio'), experience: text('experience') };
    });
    return NextResponse.json({ leads, page, hasNext: (data?.length ?? 0) > 50 }, { headers });
  } catch { return NextResponse.json({ error: 'Não foi possível carregar os leads. Tente novamente.' }, { status: 503, headers }); }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminContext();
  if (admin?.role !== 'super_admin') return NextResponse.json({ error: 'Acesso restrito.' }, { status: 403, headers });
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Atualize o status pela caixa de leads.' }, { status: 403, headers });
  }
  try {
    const input = await readJsonObject(request, 2048);
    if (input.response) {
      input.response.headers.set('Cache-Control', headers['Cache-Control']);
      return input.response;
    }
    const { id, status, expectedStatus } = input.data;
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
      || !isStatus(status) || !isStatus(expectedStatus)) {
      return NextResponse.json({ error: 'Informe um lead e um status válidos.' }, { status: 400, headers });
    }
    const db = createServiceClient();
    const previous = await db.from('contact_messages').select('message').eq('id', id).maybeSingle();
    if (previous.error) throw previous.error;
    if (!previous.data) return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404, headers });
    const previousMessage = previous.data.message;
    const record = readLeadRecord(previousMessage);
    if (!record) return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404, headers });
    const conflict = () => NextResponse.json({ error: 'Este lead foi alterado por outra pessoa. Atualize a lista antes de mudar o status.' }, { status: 409, headers });
    if (statusOf(record) !== expectedStatus) return conflict();

    // Compare the complete original envelope so another write cannot silently be lost.
    const updated = await db.from('contact_messages').update({ message: JSON.stringify({ ...record, status }) })
      .eq('id', id).eq('message', previousMessage).select('id').maybeSingle();
    if (updated.error) throw updated.error;
    if (!updated.data) return conflict();
    return NextResponse.json({ success: true, id, status }, { headers });
  } catch {
    return NextResponse.json({ error: 'Não foi possível confirmar a alteração. Atualize a lista antes de tentar novamente.' }, { status: 503, headers });
  }
}
