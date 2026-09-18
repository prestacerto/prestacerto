import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isMissingAgreementTable, normalizeAgreement, type AgreementRow } from '@/lib/agreements';
import { readJsonObject } from '@/lib/http/request-body';

export async function POST(request: NextRequest, { params }: { params: Promise<{ proposalId: string }> }) {
  const { proposalId } = await params;
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await readJsonObject(request);
  if (body.response) return body.response;
  const parsed = z.object({ version: z.number().int().positive() }).safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });

  const { data, error } = await db.rpc('accept_project_agreement', { p_proposal_id: proposalId, p_version: parsed.data.version });
  if (error) {
    if (isMissingAgreementTable(error)) return NextResponse.json({ error: 'agreements_unavailable' }, { status: 503 });
    if (/agreement_changed/.test(error.message)) return NextResponse.json({ error: 'agreement_changed' }, { status: 409 });
    if (/forbidden|agreement_not_found/.test(error.message)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    console.error('[agreements] accept falhou', error.message);
    return NextResponse.json({ error: 'agreement_error' }, { status: 500 });
  }
  return NextResponse.json({ agreement: normalizeAgreement(data as AgreementRow) });
}
