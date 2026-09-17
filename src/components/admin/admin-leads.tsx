'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
type LeadStatus = 'novo' | 'em_atendimento' | 'convertido';
type Lead = { id: string; name: string; email: string; createdAt: string; status: LeadStatus; journey: string; service: string; whatsapp: string; location: string; description: string; deadline: string; portfolio: string; experience: string };
export function AdminLeads() {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<{ leads: Lead[]; hasNext: boolean } | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [statusErrors, setStatusErrors] = useState<Record<string, string>>({});
  const pendingChanges = useRef(new Set<string>());
  const isSaving = Object.values(saving).some(Boolean);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/leads?page=${page}`, { cache: 'no-store', signal: controller.signal }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar.');
      if (!controller.signal.aborted) setData(result);
    }).catch(failure => { if (!controller.signal.aborted) setError(failure.message || 'Falha de conexão.'); });
    return () => controller.abort();
  }, [page, refresh]);
  const navigate = (next: number) => { if (pendingChanges.current.size) return; setData(null); setError(''); setStatusErrors({}); setPage(next); };
  const refreshLeads = () => { if (pendingChanges.current.size) return; setData(null); setError(''); setStatusErrors({}); setRefresh(value => value + 1); };
  const updateStatus = async (lead: Lead, status: LeadStatus) => {
    const expectedStatus = lead.status || 'novo';
    if (status === expectedStatus || pendingChanges.current.has(lead.id)) return;
    pendingChanges.current.add(lead.id);
    setSaving(current => ({ ...current, [lead.id]: true }));
    setStatusErrors(current => ({ ...current, [lead.id]: '' }));
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status, expectedStatus }), signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.success || result.id !== lead.id || result.status !== status) {
        throw new Error(result.error || 'Não foi possível confirmar a alteração. Atualize a lista antes de tentar novamente.');
      }
      setData(current => current ? { ...current, leads: current.leads.map(item => item.id === lead.id ? { ...item, status } : item) } : current);
    } catch (failure) {
      setStatusErrors(current => ({ ...current, [lead.id]: failure instanceof Error ? failure.message : 'Não foi possível confirmar a alteração. Atualize a lista antes de tentar novamente.' }));
    } finally {
      pendingChanges.current.delete(lead.id);
      setSaving(current => ({ ...current, [lead.id]: false }));
    }
  };
  return <div className="mx-auto w-full max-w-5xl px-5 py-10 text-slate-900">
    <Link href="/admin" className="text-sm font-semibold text-blue-700">← Painel do dono</Link>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Leads recebidos</h1><p className="mt-2 text-slate-600">Contatos das páginas para clientes e prestadores. Os dados são privados.</p><p className="mt-1 text-sm text-slate-500">Atualize o status manualmente conforme o acompanhamento de cada contato.</p></div><button disabled={isSaving} className="min-h-11 rounded-xl border border-slate-300 px-5 font-semibold disabled:opacity-50" onClick={refreshLeads}>Atualizar</button></div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-5 text-red-800">{error}</p>}
    {!data && !error && <p role="status" className="mt-8 text-slate-600">Carregando leads…</p>}
    {data && !data.leads.length && <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-8">Nenhum lead nesta página.</p>}
    <div className="mt-8 space-y-5">{data?.leads.map(lead => <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-6 [overflow-wrap:anywhere]">
      <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">{lead.journey === 'client' ? 'Cliente' : 'Prestador'}</p><h2 className="mt-2 text-xl font-bold">{lead.name}</h2></div><time className="text-sm text-slate-500" dateTime={lead.createdAt}>{new Date(lead.createdAt).toLocaleString('pt-BR')}</time></div>
      <div className="mt-5 max-w-sm"><label htmlFor={`lead-status-${lead.id}`} className="block text-sm font-semibold">Status de acompanhamento<span className="sr-only"> de {lead.name}</span></label><select id={`lead-status-${lead.id}`} value={lead.status || 'novo'} disabled={saving[lead.id]} aria-busy={Boolean(saving[lead.id])} aria-describedby={`lead-status-feedback-${lead.id}`} onChange={event => { void updateStatus(lead, event.target.value as LeadStatus); }} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"><option value="novo">Novo</option><option value="em_atendimento">Em atendimento</option><option value="convertido">Convertido</option></select><p id={`lead-status-feedback-${lead.id}`} role={statusErrors[lead.id] ? 'alert' : 'status'} className={`mt-2 min-h-5 text-sm ${statusErrors[lead.id] ? 'text-red-700' : 'text-slate-500'}`}>{saving[lead.id] ? 'Salvando status…' : statusErrors[lead.id] || ''}</p></div>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">{[['E-mail', lead.email], ['WhatsApp', lead.whatsapp], ['Serviço', lead.service], ['Região', lead.location], ['Prazo desejado', lead.deadline], ['Experiência', lead.experience], ['Portfólio', lead.portfolio]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="font-semibold text-slate-500">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl>
      {lead.description && <p className="mt-5 whitespace-pre-wrap border-t border-slate-100 pt-4 text-sm leading-6">{lead.description}</p>}
    </article>)}</div>
    <nav aria-label="Páginas de leads" className="mt-6 flex items-center justify-center gap-4">{page > 1 && <button disabled={isSaving} className="min-h-11 rounded-lg border px-4 disabled:opacity-50" onClick={() => navigate(page - 1)}>Anterior</button>}<span className="text-sm text-slate-600">Página {page}</span>{data?.hasNext && <button disabled={isSaving} className="min-h-11 rounded-lg border px-4 disabled:opacity-50" onClick={() => navigate(page + 1)}>Próxima</button>}</nav>
  </div>;
}
