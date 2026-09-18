import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { agreementInputSchema, isMissingAgreementTable, normalizeAgreement, type AgreementRow } from '@/lib/agreements';
import { readJsonObject } from '@/lib/http/request-body';

const unavailable = () => NextResponse.json({ error: 'agreements_unavailable' }, { status: 503 });

export async function GET(_: NextRequest, { params }: { params: Promise<{ proposalId: string }> }) {
  const { proposalId } = await params;
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await db.rpc('ensure_project_agreement', { p_proposal_id: proposalId });
  if (error) {
    if (isMissingAgreementTable(error)) return unavailable();
    if (/proposal_not_accepted/.test(error.message)) return NextResponse.json({ agreement: null, reason: 'proposal_not_accepted' });
    if (/forbidden|proposal_not_found/.test(error.message)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    console.error('[agreements] ensure falhou', error.message);
    return NextResponse.json({ error: 'agreement_error' }, { status: 500 });
  }
  return NextResponse.json({ agreement: normalizeAgreement(data as AgreementRow) });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ proposalId: string }> }) {
  const { proposalId } = await params;
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await readJsonObject(request);
  if (body.response) return body.response;
  const parsed = agreementInputSchema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  const input = parsed.data;

  const { data, error } = await db.rpc('save_project_agreement', {
    p_proposal_id: proposalId,
    p_scope: input.scope,
    p_total_amount: input.totalAmount,
    p_deadline_days: input.deadlineDays,
    p_payment_terms: input.paymentTerms,
    p_milestones: input.milestones,
  });
  if (error) {
    if (isMissingAgreementTable(error)) return unavailable();
    if (/forbidden|proposal_not_found/.test(error.message)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    if (/proposal_not_accepted/.test(error.message)) return NextResponse.json({ error: 'proposal_not_accepted' }, { status: 409 });
    console.error('[agreements] save falhou', error.message);
    return NextResponse.json({ error: 'agreement_error' }, { status: 500 });
  }
  return NextResponse.json({ agreement: normalizeAgreement(data as AgreementRow) });
}
