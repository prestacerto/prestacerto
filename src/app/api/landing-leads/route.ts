import { after, NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { createServiceClient } from '@/lib/supabase/service';
import { validateLandingLead } from '@/lib/landing-leads-validation';
import { readJsonObject } from '@/lib/http/request-body';
import { checkRateLimit, getClientIP, rateLimiters, rateLimitResponse } from '@/lib/rate-limit';
import { sendContactNotificationEmail } from '@/lib/email/resend';

export const maxDuration = 30;
const headers = { 'Cache-Control': 'no-store' };
const unavailable = () => NextResponse.json({ error: 'Não conseguimos receber seus dados agora. Eles continuam preenchidos; tente novamente.' }, { status: 503, headers });

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      return NextResponse.json({ error: 'Envie o formulário pelo site do PrestaCerto.' }, { status: 403, headers });
    }
    const limit = await checkRateLimit(rateLimiters.leads, getClientIP(request));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request, 12000);
    if (input.response) return input.response;
    const validated = validateLandingLead(input.data);
    if (!validated.success) return NextResponse.json({ error: 'Confira os campos destacados.', errors: validated.errors }, { status: 400, headers });
    const lead = validated.data;
    const db = createServiceClient();
    if (lead.categoryId) {
      const { data: category, error } = await db.from('categories').select('id').eq('id', lead.categoryId).maybeSingle();
      if (error) return unavailable();
      if (!category) return NextResponse.json({ error: 'Escolha uma categoria disponível.', errors: { categoryId: 'Escolha uma categoria disponível.' } }, { status: 400, headers });
    }
    const requestHash = createHash('sha256').update(JSON.stringify(lead)).digest('hex');
    const subject = `[Landing PrestaCerto] ${lead.journey === 'client' ? 'Cliente' : 'Prestador'}`;
    const record = {
      id: lead.id, name: lead.name, email: lead.email, subject,
      message: JSON.stringify({ kind: 'prestacerto-landing-lead', version: 1, requestHash, receivedAt: new Date().toISOString(), privacyVersion: '2026-09-11', lead }),
    };
    const { error } = await db.from('contact_messages').insert(record);
    if (error?.code === '23505') {
      // A retry after a lost response must not create another lead or notification.
      const existing = await db.from('contact_messages').select('message').eq('id', lead.id).maybeSingle();
      if (existing.error || !existing.data) return unavailable();
      try {
        const saved = JSON.parse(existing.data.message);
        if (saved.kind === 'prestacerto-landing-lead' && saved.requestHash === requestHash) {
          return NextResponse.json({ success: true }, { status: 201, headers });
        }
      } catch { /* The existing record is not this landing submission. */ }
      return NextResponse.json({ error: 'Este envio já foi recebido com outros dados. Atualize a página para iniciar um novo envio.' }, { status: 409, headers });
    }
    if (error) { console.error('Landing lead storage unavailable'); return unavailable(); }
    after(async () => {
      try {
        const message = [
          `Jornada: ${lead.journey === 'client' ? 'Cliente' : 'Prestador'}`,
          `Serviço: ${lead.service}`, `WhatsApp: ${lead.whatsapp || 'Não informado'}`,
          `Região: ${lead.location}`, `Descrição: ${lead.description || 'Não informada'}`,
          `Prazo: ${lead.deadline || 'Não informado'}`, `Portfólio: ${lead.portfolio || 'Não informado'}`,
          `Experiência: ${lead.experience || 'Não informada'}`,
          'Também disponível na caixa de leads em https://prestacerto.com.br/admin/leads',
        ].join('\n');
        await sendContactNotificationEmail({ name: lead.name, email: lead.email, subject, message });
      } catch { console.error('Landing notification unavailable; lead remains saved'); }
    });
    return NextResponse.json({ success: true }, { status: 201, headers });
  } catch { console.error('Landing submission unavailable'); return unavailable(); }
}
