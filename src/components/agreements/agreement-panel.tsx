'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, FileSignature, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Agreement, Milestone } from '@/lib/agreements';

type Props = { proposalId: string; currentUserId: string };
type Draft = { scope: string; totalAmount: string; deadlineDays: string; paymentTerms: string; milestones: { title: string; amount: string; dueDate: string }[] };

const brl = (v: number | null) => (v === null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
const when = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

function toDraft(a: Agreement): Draft {
  return {
    scope: a.scope ?? '',
    totalAmount: a.total_amount === null ? '' : String(a.total_amount),
    deadlineDays: a.deadline_days === null ? '' : String(a.deadline_days),
    paymentTerms: a.payment_terms ?? '',
    milestones: (a.milestones ?? []).map((m) => ({ title: m.title, amount: m.amount === null ? '' : String(m.amount), dueDate: m.dueDate ?? '' })),
  };
}

function fromDraft(d: Draft) {
  const num = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')));
  const milestones: Milestone[] = d.milestones
    .filter((m) => m.title.trim())
    .map((m) => ({ title: m.title.trim(), amount: num(m.amount), dueDate: m.dueDate || null }));
  return { scope: d.scope, totalAmount: num(d.totalAmount), deadlineDays: d.deadlineDays.trim() === '' ? null : Number(d.deadlineDays), paymentTerms: d.paymentTerms, milestones };
}

export function AgreementPanel({ proposalId, currentUserId }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable' | 'not_accepted' | 'error'>('loading');
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/agreements/${encodeURIComponent(proposalId)}`, { cache: 'no-store' });
    if (res.status === 503) return setState('unavailable');
    if (!res.ok) return setState('error');
    const body = await res.json();
    if (!body.agreement) return setState('not_accepted');
    setAgreement(body.agreement);
    setState('ready');
  }, [proposalId]);

  useEffect(() => { load(); }, [load]);

  if (state === 'loading') return <Shell><p className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" /> Carregando acordo…</p></Shell>;
  if (state === 'not_accepted') return null;
  if (state === 'unavailable') return <Shell><p className="text-sm text-slate-500">O Acordo Certo estará disponível em breve nesta conversa.</p></Shell>;
  if (state === 'error' || !agreement) return <Shell><p className="text-sm text-red-700">Não foi possível carregar o acordo. Tente novamente.</p></Shell>;

  const isClient = agreement.client_id === currentUserId;
  const myAccepted = isClient ? agreement.client_accepted_at : agreement.freelancer_accepted_at;
  const otherAccepted = isClient ? agreement.freelancer_accepted_at : agreement.client_accepted_at;
  const both = Boolean(agreement.client_accepted_at && agreement.freelancer_accepted_at);

  const save = async () => {
    if (!draft) return;
    setBusy(true); setNotice(null);
    const res = await fetch(`/api/agreements/${encodeURIComponent(proposalId)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fromDraft(draft)) });
    setBusy(false);
    if (!res.ok) return setNotice('Não foi possível salvar. Confira os campos e tente de novo.');
    const body = await res.json();
    setAgreement(body.agreement); setEditing(false);
    setNotice('Acordo atualizado. Os dois lados precisam aceitar a nova versão.');
  };

  const accept = async () => {
    setBusy(true); setNotice(null);
    const res = await fetch(`/api/agreements/${encodeURIComponent(proposalId)}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: agreement.version }) });
    setBusy(false);
    if (res.status === 409) { setNotice('O acordo foi alterado. Revise a nova versão antes de aceitar.'); return load(); }
    if (!res.ok) return setNotice('Não foi possível registrar o aceite.');
    const body = await res.json();
    setAgreement(body.agreement);
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-700"><FileSignature className="size-4" /> Acordo Certo · versão {agreement.version}</p>
          <p className="mt-1 text-sm text-slate-600">O que foi combinado, registrado com o aceite dos dois lados. O pagamento é feito diretamente entre vocês.</p>
        </div>
        {both
          ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800"><CheckCircle2 className="size-4" /> Aceito por ambos</span>
          : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Aguardando aceite</span>}
      </div>

      {!editing && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Valor total" value={brl(agreement.total_amount)} />
          <Field label="Prazo" value={agreement.deadline_days ? `${agreement.deadline_days} dias` : '—'} />
          <Field label="Forma de pagamento" value={agreement.payment_terms || '—'} />
          <div className="sm:col-span-3"><Field label="Escopo" value={agreement.scope || '—'} multiline /></div>
          {agreement.milestones.length > 0 && (
            <div className="sm:col-span-3">
              <p className="text-xs font-semibold text-slate-500">Etapas de entrega</p>
              <ol className="mt-2 space-y-2">
                {agreement.milestones.map((m, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{i + 1}. {m.title}</span>
                    <span className="text-slate-600">{brl(m.amount)}{m.dueDate ? ` · até ${new Date(`${m.dueDate}T12:00:00`).toLocaleDateString('pt-BR')}` : ''}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {editing && draft && (
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-800">Escopo
            <textarea value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} rows={5} maxLength={4000} className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-sm font-normal" placeholder="O que será entregue, o que está incluído e o que não está." />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-slate-800">Valor total (R$)
              <input inputMode="decimal" value={draft.totalAmount} onChange={(e) => setDraft({ ...draft, totalAmount: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" placeholder="Ex.: 2500" />
            </label>
            <label className="block text-sm font-semibold text-slate-800">Prazo (dias)
              <input inputMode="numeric" value={draft.deadlineDays} onChange={(e) => setDraft({ ...draft, deadlineDays: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" placeholder="Ex.: 20" />
            </label>
            <label className="block text-sm font-semibold text-slate-800">Forma de pagamento
              <input value={draft.paymentTerms} onChange={(e) => setDraft({ ...draft, paymentTerms: e.target.value })} maxLength={2000} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" placeholder="Ex.: 50% PIX no início, 50% na entrega" />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Etapas de entrega <span className="font-normal text-slate-500">(opcional)</span></p>
            <div className="mt-2 space-y-2">
              {draft.milestones.map((m, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_130px_150px_40px]">
                  <input value={m.title} onChange={(e) => updateMilestone(i, { title: e.target.value })} maxLength={120} placeholder={`Etapa ${i + 1} — ex.: Layout aprovado`} className="rounded-lg border border-slate-300 p-2 text-sm" />
                  <input inputMode="decimal" value={m.amount} onChange={(e) => updateMilestone(i, { amount: e.target.value })} placeholder="R$" className="rounded-lg border border-slate-300 p-2 text-sm" />
                  <input type="date" value={m.dueDate} onChange={(e) => updateMilestone(i, { dueDate: e.target.value })} className="rounded-lg border border-slate-300 p-2 text-sm" />
                  <button type="button" aria-label="Remover etapa" onClick={() => setDraft({ ...draft, milestones: draft.milestones.filter((_, j) => j !== i) })} className="flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:text-red-700"><Trash2 className="size-4" /></button>
                </div>
              ))}
              {draft.milestones.length < 30 && (
                <button type="button" onClick={() => setDraft({ ...draft, milestones: [...draft.milestones, { title: '', amount: '', dueDate: '' }] })} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700"><Plus className="size-4" /> Adicionar etapa</button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={save} className="inline-flex min-h-11 items-center rounded-lg bg-[#2454e8] px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{busy ? 'Salvando…' : 'Salvar acordo'}</button>
            <button type="button" disabled={busy} onClick={() => { setEditing(false); setDraft(null); }} className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700">Cancelar</button>
          </div>
          <p className="text-xs text-slate-500">Salvar cria uma nova versão e pede o aceite dos dois lados novamente.</p>
        </div>
      )}

      {!editing && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          {myAccepted
            ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700"><CheckCircle2 className="size-4" /> Você aceitou em {when(myAccepted)}</span>
            : <button type="button" disabled={busy} onClick={accept} className="inline-flex min-h-11 items-center rounded-lg bg-[#2454e8] px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{busy ? 'Registrando…' : 'Aceito este acordo'}</button>}
          <span className="text-sm text-slate-500">{otherAccepted ? `${isClient ? 'Profissional' : 'Cliente'} aceitou em ${when(otherAccepted)}` : `Aguardando o ${isClient ? 'profissional' : 'cliente'}`}</span>
          <button type="button" onClick={() => { setDraft(toDraft(agreement)); setEditing(true); }} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950"><Pencil className="size-4" /> {both ? 'Propor alteração' : 'Editar'}</button>
        </div>
      )}
      {notice && <p className="mt-3 text-sm text-slate-700">{notice}</p>}
    </Shell>
  );

  function updateMilestone(i: number, patch: Partial<Draft['milestones'][number]>) {
    if (!draft) return;
    setDraft({ ...draft, milestones: draft.milestones.map((m, j) => (j === i ? { ...m, ...patch } : m)) });
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return <section aria-label="Acordo Certo" className="rounded-2xl border border-blue-100 bg-[#f4f7ff] p-5">{children}</section>;
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={`mt-1 text-sm text-slate-900 ${multiline ? 'whitespace-pre-wrap' : 'font-semibold'}`}>{value}</p>
    </div>
  );
}
