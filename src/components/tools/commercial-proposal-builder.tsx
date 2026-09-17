'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, Download, FileText, FolderOpen, Plus, Save, Trash2, Bell, Palette, Loader2 } from 'lucide-react';
import { blankProposal, brandColors, commercialProposalSchema, editorDraftSchema, followUpsDue, formatMoney, parseProposalLibrary, proposalAsText, proposalStatuses, proposalTemplates, proposalTotalCents, saoPauloDate, savedProposalSchema, type BrandColor, type CommercialProposal, type ProposalStatus, type SavedProposal } from '@/lib/tools/commercial-proposal';

const field = 'mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100';
const secondary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50';
const primary = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50';
function track(event: string) {
  try {
    if (localStorage.getItem('prestacerto_tracking_consent') !== 'granted') return;
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', event, { tool: 'certo_propostas' });
  } catch { /* The tool works without analytics. */ }
}

export function CommercialProposalBuilder({ userId, paid, checkoutReady }: { userId: string | null; paid: boolean; checkoutReady: boolean }) {
  const [proposal, setProposal] = useState<CommercialProposal>(blankProposal);
  const [library, setLibrary] = useState<SavedProposal[]>([]);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<'editor' | 'library'>('editor');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProposalStatus>('draft');
  const [followUp, setFollowUp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [today, setToday] = useState('');
  const [brand, setBrand] = useState(false);
  const [color, setColor] = useState<BrandColor>('blue');
  const [guestCount, setGuestCount] = useState(0);
  const [dirty, setDirty] = useState(false);
  const working = useRef(false);
  const key = `prestacerto:commercial-proposals:v1:${userId || 'guest'}`;

  useEffect(() => {
    // Hydrate browser-only data after the server-rendered editor is mounted.
    const frame = requestAnimationFrame(() => {
    try {
      setLibrary(parseProposalLibrary(localStorage.getItem(key)));
      const rawDraft = localStorage.getItem(`${key}:editing`);
      if (rawDraft && rawDraft.length < 40000) {
        const draft = editorDraftSchema.safeParse(JSON.parse(rawDraft));
        if (draft.success) {
          setProposal(draft.data.proposal); setActiveId(draft.data.activeId); setStatus(draft.data.status); setFollowUp(draft.data.followUp);
        }
      }
      if (userId) setGuestCount(parseProposalLibrary(localStorage.getItem('prestacerto:commercial-proposals:v1:guest')).length);
    } catch { setError('O navegador não permite salvar aqui. Você ainda pode baixar o PDF ou copiar o texto.'); }
    setToday(saoPauloDate()); setReady(true);
    });
    const focus = () => setToday(saoPauloDate());
    const sync = (event: StorageEvent) => { if (event.key === key) setLibrary(parseProposalLibrary(event.newValue)); };
    window.addEventListener('focus', focus);
    window.addEventListener('storage', sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('focus', focus); window.removeEventListener('storage', sync); };
  }, [key, userId]);

  useEffect(() => {
    if (!ready) return;
    const draft = editorDraftSchema.safeParse({ proposal, activeId, status, followUp });
    if (!draft.success) return;
    try { localStorage.setItem(`${key}:editing`, JSON.stringify(draft.data)); }
    catch { /* Explicit Save reports storage failures; PDF and copy remain usable. */ }
  }, [proposal, activeId, status, followUp, key, ready]);

  useEffect(() => {
    if (!dirty) return;
    const protect = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', protect);
    return () => window.removeEventListener('beforeunload', protect);
  }, [dirty]);

  const total = proposalTotalCents(proposal.items);
  const due = followUpsDue(library, today);
  const pending = library.filter(item => item.status === 'sent');
  const update = <K extends keyof CommercialProposal>(name: K, value: CommercialProposal[K]) => { setProposal(p => ({ ...p, [name]: value })); setDirty(true); setError(''); setMessage(''); };
  const check = () => {
    const parsed = commercialProposalSchema.safeParse(proposal);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || 'Revise os campos da proposta.'); setMessage(''); return null; }
    setError(''); return parsed.data;
  };
  const persist = (next: SavedProposal[]) => {
    try { localStorage.setItem(key, JSON.stringify(next)); setLibrary(next); return true; }
    catch { setError('Não foi possível salvar neste navegador. Baixe o PDF para guardar sua proposta.'); return false; }
  };
  const save = () => {
    const valid = check(); if (!valid) return false;
    if (!activeId && library.length >= 30) { setError('Sua biblioteca tem 30 propostas. Exclua uma antiga depois de guardar o PDF.'); return false; }
    const id = activeId || crypto.randomUUID();
    const record: SavedProposal = { id, proposal: valid, status, followUp, updatedAt: new Date().toISOString() };
    if (!savedProposalSchema.safeParse(record).success) { setError('Confira a data de retorno antes de salvar.'); return false; }
    if (!persist([record, ...library.filter(item => item.id !== id)])) return false;
    setActiveId(id); setDirty(false); setMessage('Proposta salva neste navegador. Ela estará na sua biblioteca quando você voltar.'); track('proposal_saved'); return true;
  };
  const fresh = () => {
    if (dirty && !window.confirm('Há alterações não salvas. Começar outra proposta?')) return;
    setProposal(blankProposal()); setActiveId(null); setStatus('draft'); setFollowUp(''); setDirty(false); setMessage(''); setError(''); setView('editor');
  };
  const chooseTemplate = (id: string) => {
    if (dirty && !window.confirm('Usar este modelo no lugar do conteúdo atual? Seus dados de profissional e cliente serão mantidos.')) return;
    const template = proposalTemplates.find(item => item.id === id); if (!template) return;
    setProposal(p => ({ ...blankProposal(), provider: p.provider, client: p.client, title: template.title, scope: template.scope, items: [{ description: template.delivery, quantity: 1, unitPrice: 0 }], paymentNotes: '' }));
    setActiveId(null); setStatus('draft'); setFollowUp(''); setDirty(true); setMessage('Modelo preenchido. Personalize o escopo, o valor e as condições antes de enviar.'); setError('');
  };
  const open = (record: SavedProposal, duplicate = false) => {
    if (dirty && !window.confirm('Descartar as alterações não salvas e abrir esta proposta?')) return;
    setProposal(duplicate ? { ...record.proposal, client: '' } : record.proposal);
    setActiveId(duplicate ? null : record.id); setStatus(duplicate ? 'draft' : record.status); setFollowUp(duplicate ? '' : record.followUp); setDirty(duplicate); setView('editor'); setMessage(duplicate ? 'Modelo reutilizado. Informe o novo cliente e confira as condições.' : 'Proposta aberta. Revise os dados antes de enviar.'); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const copy = async () => {
    const valid = check(); if (!valid) return;
    try { await navigator.clipboard.writeText(proposalAsText(valid)); setMessage('Texto copiado. Revise e envie ao seu cliente pelo canal que preferir.'); track('proposal_copied'); }
    catch { setError('O navegador bloqueou a cópia. Use o PDF para compartilhar a proposta.'); }
  };
  const download = async () => {
    const valid = check(); if (!valid || working.current) return;
    working.current = true; setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/tools/proposal-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proposal: valid, variant: brand ? 'brand' : 'standard', color }), signal: AbortSignal.timeout(25000) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Não foi possível criar o PDF.'); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'proposta-comercial.pdf'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      setMessage('PDF pronto. Ele foi baixado para você revisar e enviar ao cliente.'); track(brand ? 'proposal_brand_pdf' : 'proposal_pdf');
    } catch (caught) { setError(caught instanceof Error && caught.name !== 'TimeoutError' ? caught.message : 'O PDF demorou a responder. Tente novamente ou copie o texto.'); }
    finally { working.current = false; setBusy(false); }
  };
  const bringGuest = () => {
    let guest: SavedProposal[];
    try { guest = parseProposalLibrary(localStorage.getItem('prestacerto:commercial-proposals:v1:guest')); }
    catch { setError('Não foi possível acessar as propostas salvas neste navegador.'); return; }
    const merged = [...new Map([...guest, ...library].map(item => [item.id, item])).values()];
    if (merged.length > 30) { setError('A importação ultrapassaria 30 propostas. Libere espaço na biblioteca antes de continuar.'); return; }
    if (persist(merged)) { try { localStorage.removeItem('prestacerto:commercial-proposals:v1:guest'); localStorage.removeItem('prestacerto:commercial-proposals:v1:guest:editing'); } catch { /* Imported records are deduplicated by id if retried. */ } setGuestCount(0); setMessage('Propostas deste navegador adicionadas à sua biblioteca.'); setView('library'); }
  };
  const previewColor = brand ? brandColors[color] : brandColors.blue;

  return <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700"><FileText className="size-4"/> Certo Propostas <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] tracking-normal">NOVO</span></p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.12]">Seu trabalho merece<br/><span className="text-blue-600">uma boa proposta.</span></h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Organize as entregas, apresente seu preço e volte para acompanhar cada negociação. Do primeiro orçamento ao próximo cliente.</p>
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600"><Check className="size-4 text-blue-600"/> PDF gratuito. Sem cadastro para começar.</p>
      </div>
      <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700">Encontrar meu próximo projeto <ArrowRight className="size-4"/></Link>
    </div>

    <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <div className="flex gap-2" aria-label="Seções da ferramenta">
        <button type="button" onClick={() => setView('editor')} aria-pressed={view === 'editor'} className={`${secondary} ${view === 'editor' ? '!border-blue-200 !bg-blue-50 !text-blue-700' : ''}`}><FileText className="size-4"/> Criar proposta</button>
        <button type="button" onClick={() => setView('library')} aria-pressed={view === 'library'} className={`${secondary} ${view === 'library' ? '!border-blue-200 !bg-blue-50 !text-blue-700' : ''}`}><FolderOpen className="size-4"/> Minha biblioteca {ready && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{library.length}</span>}</button>
      </div>
      {view === 'editor' && <span className="text-xs text-slate-500">{dirty ? 'Alterações ainda não salvas' : activeId ? 'Salva neste navegador' : 'Comece com um modelo ou do zero'}</span>}
    </div>

    <div aria-live="polite" className="mt-4">{message && <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">{message}</p>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}
    {due.length > 0 && <button type="button" onClick={() => setView('library')} className="mt-4 flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-950"><Bell className="size-5 shrink-0"/><span><strong>{due.length === 1 ? 'Um cliente está na sua lista de retorno.' : `${due.length} clientes estão na sua lista de retorno.`}</strong> Veja as datas que você marcou e retome a conversa.</span><ArrowRight className="ml-auto size-4 shrink-0"/></button>}
    {guestCount > 0 && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 p-4 text-sm"><p>Há {guestCount} proposta(s) salvas como visitante neste navegador.</p><button type="button" onClick={bringGuest} className={secondary}>Trazer para minha biblioteca</button></div>}

    {view === 'library' ? <section className="py-6" aria-labelledby="library-title">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 id="library-title" className="text-2xl font-bold text-slate-900">Seu próximo passo está aqui.</h2><p className="mt-2 text-sm leading-6 text-slate-600">Até 30 propostas neste navegador. O histórico não é sincronizado entre dispositivos; guarde os PDFs importantes.</p></div><button type="button" onClick={fresh} className={primary}><Plus className="size-4"/>Nova proposta</button></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">{[{ label: 'Propostas salvas', value: library.length }, { label: 'Aguardando resposta', value: pending.length }, { label: 'Valor em negociação', value: formatMoney(pending.reduce((sum, item) => sum + proposalTotalCents(item.proposal.items), 0)) }].map(item => <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-medium text-slate-500">{item.label}</p><p className="mt-2 break-words text-2xl font-bold text-slate-950">{item.value}</p></div>)}</div>
      <p className="mt-3 text-xs leading-5 text-slate-500">Situações marcadas por você. Valores em negociação não representam pagamentos recebidos.</p>
      {!ready ? <p className="py-12 text-slate-500">Abrindo sua biblioteca…</p> : library.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><FolderOpen className="mx-auto size-9 text-blue-600"/><h3 className="mt-4 text-lg font-bold text-slate-900">A primeira proposta abre caminho.</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Salve um orçamento e reutilize a estrutura no próximo cliente. Seus retornos também ficam organizados aqui.</p><button type="button" onClick={() => setView('editor')} className={`${primary} mt-5`}>Criar minha primeira proposta</button></div> : <div className="mt-6 space-y-3">{library.map(record => <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs font-semibold text-blue-700">{proposalStatuses[record.status]}</p><h3 className="mt-1 break-words text-lg font-bold text-slate-900">{record.proposal.title}</h3><p className="mt-1 break-words text-sm text-slate-500">{record.proposal.client} · {formatMoney(proposalTotalCents(record.proposal.items))}</p>{record.followUp && record.status === 'sent' && <p className={`mt-2 text-xs ${record.followUp <= today ? 'font-bold text-amber-800' : 'text-slate-600'}`}>Retorno: {record.followUp.split('-').reverse().join('/')}{record.followUp <= today ? ' · conferir hoje' : ''}</p>}</div><div className="flex flex-wrap gap-2"><button type="button" className={secondary} onClick={() => open(record)}>Abrir</button><button type="button" className={secondary} onClick={() => open(record, true)}><Copy className="size-4"/>Reutilizar</button><button type="button" className={secondary} aria-label={`Excluir proposta ${record.proposal.title}`} onClick={() => { if (window.confirm('Excluir esta proposta da biblioteca deste navegador? Guarde o PDF antes se precisar.')) { if (persist(library.filter(item => item.id !== record.id))) { if (activeId === record.id) setActiveId(null); setMessage('Proposta excluída da biblioteca.'); } } }}><Trash2 className="size-4"/></button></div></div></article>)}</div>}
    </section> : <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.05fr_.95fr]">
      <div className="min-w-0 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-base font-bold text-slate-900">Um ponto de partida para o seu serviço</h2><p className="mt-1 text-sm leading-6 text-slate-500">Os modelos organizam o texto. Você define preço, prazo e condições.</p><div className="mt-4 flex flex-wrap gap-2">{proposalTemplates.map(template => <button type="button" key={template.id} onClick={() => chooseTemplate(template.id)} className={secondary}>{template.name}</button>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="details-title"><h2 id="details-title" className="flex items-center gap-3 text-lg font-bold text-slate-900"><span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-xs text-blue-700">1</span> Apresente a solução</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Seu nome ou empresa<input value={proposal.provider} onChange={e => update('provider', e.target.value)} className={field} maxLength={100} autoComplete="organization" placeholder="Como você se apresenta"/></label><label className="text-sm font-medium text-slate-700">Nome do cliente<input value={proposal.client} onChange={e => update('client', e.target.value)} className={field} maxLength={100} placeholder="Para quem é a proposta"/></label></div>
          <label className="mt-4 block text-sm font-medium text-slate-700">Título da proposta<input value={proposal.title} onChange={e => update('title', e.target.value)} className={field} maxLength={120} placeholder="Ex.: criação do site da sua empresa"/></label>
          <label className="mt-4 block text-sm font-medium text-slate-700">Objetivo e escopo<textarea value={proposal.scope} onChange={e => update('scope', e.target.value)} className={`${field} min-h-40 resize-y leading-6`} maxLength={4000} placeholder="Qual problema você vai resolver? O que será entregue, quantas revisões estão incluídas e o que fica fora do escopo?"/></label>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="budget-title"><h2 id="budget-title" className="flex items-center gap-3 text-lg font-bold text-slate-900"><span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-xs text-blue-700">2</span> Defina o investimento</h2>
          <div className="mt-5 space-y-4">{proposal.items.map((item, index) => <div key={index} className="rounded-xl bg-slate-50 p-3"><label className="block text-sm font-medium text-slate-700">Entrega {index + 1}<input className={field} value={item.description} maxLength={180} placeholder="Ex.: site institucional com 5 páginas" onChange={e => update('items', proposal.items.map((row, i) => i === index ? { ...row, description: e.target.value } : row))}/></label><div className="mt-3 grid grid-cols-[.7fr_1.3fr_auto] items-end gap-2"><label className="min-w-0 text-xs font-medium text-slate-600">Quantidade<input type="number" min={1} max={1000} step={1} className={field} value={item.quantity || ''} onChange={e => update('items', proposal.items.map((row, i) => i === index ? { ...row, quantity: Number(e.target.value) } : row))}/></label><label className="min-w-0 text-xs font-medium text-slate-600">Valor unitário (R$)<input type="number" inputMode="decimal" min={0.01} max={999999.99} step={0.01} className={field} value={item.unitPrice || ''} placeholder="0,00" onChange={e => update('items', proposal.items.map((row, i) => i === index ? { ...row, unitPrice: Number(e.target.value) } : row))}/></label><button type="button" className={`${secondary} !px-3`} disabled={proposal.items.length === 1} aria-label={`Remover entrega ${index + 1}`} onClick={() => update('items', proposal.items.filter((_, i) => i !== index))}><Trash2 className="size-4"/></button></div></div>)}</div>
          <button type="button" className={`${secondary} mt-3`} disabled={proposal.items.length >= 12} onClick={() => update('items', [...proposal.items, { description: '', quantity: 1, unitPrice: 0 }])}><Plus className="size-4"/>Adicionar entrega</button>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-5"><span className="font-medium text-slate-600">Investimento total</span><strong className="break-all text-2xl text-blue-700">{formatMoney(total)}</strong></div><Link href="/ferramentas/calculadora" target="_blank" className="mt-3 inline-block text-xs font-semibold text-blue-700 underline underline-offset-4">Precisa de ajuda para definir seu preço? Abrir calculadora.</Link>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="flex items-center gap-3 text-lg font-bold text-slate-900"><span className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-xs text-blue-700">3</span> Combine os próximos passos</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Prazo de entrega (dias)<input type="number" min={1} max={730} step={1} className={field} value={proposal.deliveryDays || ''} onChange={e => update('deliveryDays', Number(e.target.value))}/></label><label className="text-sm font-medium text-slate-700">Validade da proposta (dias)<input type="number" min={1} max={90} step={1} className={field} value={proposal.validDays || ''} onChange={e => update('validDays', Number(e.target.value))}/></label></div><label className="mt-4 block text-sm font-medium text-slate-700">Condições de pagamento<textarea className={`${field} min-h-24 resize-y leading-6`} maxLength={1000} value={proposal.paymentNotes} onChange={e => update('paymentNotes', e.target.value)} placeholder="Ex.: 50% na aprovação e 50% na entrega. Informe o que foi combinado com o cliente."/></label><p className="mt-2 text-xs leading-5 text-slate-500">O prazo começa após a aprovação e o recebimento dos materiais. A ferramenta gera um documento; ela não cobra nem envia ao cliente.</p></section>
        <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6"><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><Bell className="size-4 text-blue-600"/> Não deixe a conversa esfriar</h2><p className="mt-2 text-sm leading-6 text-slate-600">Marque quando quer retomar o contato. O lembrete aparece aqui quando você voltar.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Situação da proposta<select className={field} value={status} onChange={e => { setStatus(e.target.value as ProposalStatus); setDirty(true); }}>{Object.entries(proposalStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="min-w-0 text-sm font-medium text-slate-700">Data para retomar contato<input type="date" className={`${field} min-w-0`} value={followUp} onInput={e => { setFollowUp(e.currentTarget.value); setDirty(true); }} onChange={e => { setFollowUp(e.target.value); setDirty(true); }}/></label></div><p className="mt-2 text-xs leading-5 text-slate-500">O lembrete considera propostas marcadas como “Enviada”. Nenhuma mensagem é enviada automaticamente.</p><button type="button" className={`${secondary} mt-4 w-full`} disabled={!ready} onClick={save}><Save className="size-4"/>Salvar na minha biblioteca</button></section>
      </div>

      <aside className="min-w-0 space-y-5 lg:sticky lg:top-24" aria-label="Prévia da proposta e exportação">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-slate-800">Sua proposta tomando forma</h2><span className="text-xs text-slate-500">Prévia resumida</span></div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50"><div className="h-1.5" style={{ backgroundColor: previewColor }}/><div className="p-6 sm:p-8"><p className="break-words text-lg font-bold" style={{ color: previewColor }}>{brand ? proposal.provider || 'Sua marca' : 'PrestaCerto'}</p><p className="mt-6 text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Proposta comercial</p><h3 className="mt-2 break-words text-2xl font-bold leading-tight text-slate-950">{proposal.title || 'Um novo projeto começa aqui.'}</h3><p className="mt-3 break-words text-xs text-slate-500">Para {proposal.client || 'seu próximo cliente'} · Por {proposal.provider || 'você'}</p><p className="mt-6 line-clamp-5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{proposal.scope || 'O objetivo, as entregas e as condições que você preencher aparecerão no documento. Clareza desde o primeiro contato.'}</p><div className="mt-6 space-y-3 border-t border-slate-100 pt-5">{proposal.items.slice(0, 3).map((item, i) => <div key={i} className="flex items-start justify-between gap-4 text-xs"><span className="min-w-0 break-words text-slate-500">{item.description || `Entrega ${i + 1}`} × {item.quantity}</span><strong className="shrink-0 text-slate-800">{formatMoney(Math.round(item.unitPrice * 100) * item.quantity)}</strong></div>)}{proposal.items.length > 3 && <p className="text-xs text-slate-500">+ {proposal.items.length - 3} entrega(s) no PDF completo</p>}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-4"><span className="text-xs font-semibold text-slate-600">INVESTIMENTO</span><strong className="break-all text-xl" style={{ color: previewColor }}>{formatMoney(total)}</strong></div><p className="mt-4 text-xs leading-6 text-slate-500">Entrega: {proposal.deliveryDays} dias · Validade: {proposal.validDays} dias</p>{!brand && <p className="mt-6 border-t border-slate-100 pt-4 text-[10px] text-slate-400">Criado com Certo Propostas · prestacerto.com.br</p>}</div></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5"><div className="flex items-center gap-2"><Palette className="size-4 text-blue-600"/><h3 className="text-sm font-bold text-slate-900">Sua marca, do começo ao fim.</h3><span className="ml-auto rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">PRO</span></div><p className="mt-2 text-xs leading-6 text-slate-600">Use seu nome de marca e suas cores no PDF, sem a assinatura PrestaCerto. Incluído no Pro e Business.</p><label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800"><input type="checkbox" className="size-4 accent-blue-600" checked={brand} onChange={e => setBrand(e.target.checked)}/> {paid ? 'Usar minha marca no PDF' : 'Experimentar a prévia com minha marca'}</label>{brand && <fieldset className="mt-2"><legend className="mb-2 text-xs text-slate-600">Cor da proposta</legend><div className="flex gap-2">{Object.entries(brandColors).map(([id, hex]) => <button type="button" aria-label={`Cor ${id === 'blue' ? 'azul' : id === 'navy' ? 'marinho' : 'verde'}`} aria-pressed={color === id} key={id} onClick={() => setColor(id as BrandColor)} className="flex size-11 items-center justify-center rounded-full border-4 border-white outline outline-1 outline-slate-200" style={{ backgroundColor: hex }}>{color === id && <Check className="size-4 text-white"/>}</button>)}</div></fieldset>}{brand && !paid && <div className="mt-4 border-t border-blue-200 pt-3"><Link href="/plans" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700" onClick={() => track('proposal_upgrade_click')}>Conhecer o Pro <ArrowRight className="size-4"/></Link>{!checkoutReady && <p className="text-xs leading-5 text-slate-600">Novas assinaturas em preparação. O PDF gratuito já está disponível.</p>}{!userId && <Link href="/login?next=%2Fferramentas%2Fpropostas" className="mt-2 inline-block text-xs font-semibold text-blue-700 underline underline-offset-4">Já assina? Salve sua proposta e entre na conta.</Link>}</div>}</div>
        <div className="space-y-2"><button type="button" className={`${primary} w-full`} disabled={busy || (brand && !paid)} onClick={download}>{busy ? <Loader2 className="size-4 animate-spin"/> : <Download className="size-4"/>}{busy ? 'Preparando PDF…' : brand ? 'Baixar PDF com minha marca' : 'Baixar PDF grátis'}</button>{brand && !paid && <button type="button" onClick={() => setBrand(false)} className={`${secondary} w-full`}>Continuar com o PDF gratuito</button>}<button type="button" className={`${secondary} w-full`} onClick={copy}><Copy className="size-4"/>Copiar texto da proposta</button><p className="px-2 text-center text-xs leading-5 text-slate-500">O PDF inclui todo o conteúdo. Revise antes de enviar ao cliente.</p></div>
      </aside>
    </div>}
  </div>;
}
