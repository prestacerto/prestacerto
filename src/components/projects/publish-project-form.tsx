"use client";

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { trackAnalyticsEvent } from '@/components/analytics';
import { authDestination, PUBLISH_PROJECT_PATH } from '@/lib/auth/destination';
import { EMPTY_PROJECT, validatePublication, type ProjectInput } from '@/lib/projects/publication';
import { GUEST_PROJECT_DRAFT_KEY, readLatestProjectDraftFromStores, writeProjectDraftToStores } from '@/lib/projects/draft';
import { clearLandingHandoff, landingProjectDraft, readLandingHandoff } from '@/lib/landing-handoff';
import { trackFunnelEvent } from '@/lib/funnel';

const categories = [['geral', 'Ainda não sei'], ['desenvolvimento', 'Tecnologia e desenvolvimento'], ['design', 'Design e criação'], ['marketing', 'Marketing digital'], ['conteudo', 'Conteúdo e redes sociais'], ['consultoria', 'Consultoria e negócios']];
const guestKey = GUEST_PROJECT_DRAFT_KEY;
function draftStores(): Storage[] {
  const stores: Storage[] = [];
  try { stores.push(window.localStorage); } catch { /* Storage access may be blocked. */ }
  try { stores.push(window.sessionStorage); } catch { /* Keep the form usable. */ }
  return stores;
}
const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';
const primaryClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60';
const secondaryClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50';

export function PublishProjectForm({ userId, userEmail, role }: { userId?: string; userEmail?: string; role?: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [idea, setIdea] = useState('');
  const [formData, setFormData] = useState<ProjectInput>(EMPTY_PROJECT);
  const [ready, setReady] = useState(false);
  const [draftStored, setDraftStored] = useState(false);
  const [draftSaveError, setDraftSaveError] = useState(false);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [alsoHire, setAlsoHire] = useState(false);
  const [published, setPublished] = useState<{ id: string; title: string } | null>(null);
  const publishLock = useRef(false);
  const handoffId = useRef<string | null>(null);
  const draftKey = userId ? `prestacerto:project-draft:${userId}` : guestKey;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let saved = readLatestProjectDraftFromStores(draftStores(), draftKey, userId ? guestKey : undefined);
        // Existing edited drafts always win. The landing supplies a starting point only.
        if (!saved) {
          const handoff = readLandingHandoff('client', userId ? userEmail || null : undefined);
          if (handoff) { saved = landingProjectDraft(handoff); handoffId.current = handoff.lead.id; }
        }
        if (saved) {
          setFormData(saved.formData); setIdea(saved.idea); setStep(saved.step); setDraftStored(true);
        }
      } catch { /* The form remains available when storage is unavailable. */ }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [draftKey, userId, userEmail]);

  useEffect(() => {
    if (!ready || published || (!idea.trim() && !formData.description.trim())) return;
    const timer = setTimeout(() => {
      try {
        writeProjectDraftToStores(draftStores(), draftKey, { version: 1, savedAt: Date.now(), idea, step, formData }, userId ? guestKey : undefined);
        setDraftStored(true);
        if (userId && handoffId.current) { clearLandingHandoff(handoffId.current); handoffId.current = null; }
      } catch { setDraftStored(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [ready, published, draftKey, userId, idea, step, formData]);

  const update = (field: keyof ProjectInput, value: string) => setFormData(current => ({ ...current, [field]: value }));
  const clearDraft = () => {
    if (handoffId.current) { clearLandingHandoff(handoffId.current); handoffId.current = null; }
    for (const storage of draftStores()) {
      try { storage.removeItem(draftKey); if (userId) storage.removeItem(guestKey); } catch { /* No stored draft. */ }
    }
    setIdea(''); setFormData({ ...EMPTY_PROJECT }); setStep(1); setDraftStored(false); setDraftSaveError(false); setAlsoHire(false);
  };
  const continueManually = () => {
    if (idea.trim().length < 20) { toast.error('Descreva o serviço em pelo menos 20 caracteres.'); return; }
    setFormData(current => ({ ...current, title: current.title || idea.split(/[.!?]/)[0].trim().slice(0,80), description: idea.trim() })); setStep(2);
  };
  const organizeWithAI = async () => {
    if (idea.trim().length < 20) { toast.error('Descreva o serviço em pelo menos 20 caracteres.'); return; }
    setLoadingBrief(true);
    try {
      const response = await fetch('/api/ai/scope-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: idea.trim(), categoryHint: formData.category }), signal: AbortSignal.timeout(35000) });
      if (!response.ok) throw new Error('BRIEF_UNAVAILABLE');
      const suggestion = await response.json();
      setFormData(current => ({ ...current, title: typeof suggestion.title === 'string' ? suggestion.title.trim().slice(0,120) : current.title || idea.slice(0,80), description: typeof suggestion.description === 'string' ? suggestion.description.trim().slice(0,10000) : idea.trim(), skills: Array.isArray(suggestion.skills) ? suggestion.skills.filter((s: unknown) => typeof s === 'string').slice(0,20).join(', ') : current.skills }));
      setStep(2); toast.success('Texto organizado. Revise e informe seu orçamento.');
    } catch { continueManually(); toast.info('A IA não conseguiu organizar agora. Seu texto foi mantido para revisão.'); }
    finally { setLoadingBrief(false); }
  };
  const persistBeforeAuth = () => {
    try {
      writeProjectDraftToStores(draftStores(), draftKey, { version: 1, savedAt: Date.now(), idea, step, formData });
      setDraftStored(true); setDraftSaveError(false);
      return true;
    } catch {
      setDraftStored(false); setDraftSaveError(true);
      return false;
    }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = validatePublication({ ...formData, alsoHire });
    if (!parsed.data) { toast.error(parsed.error); return; }
    if (!userId) { if (persistBeforeAuth()) window.location.assign(authDestination('register', PUBLISH_PROJECT_PATH)); return; }
    if (publishLock.current) return;
    publishLock.current = true; setLoadingPublish(true);
    try {
      const response = await fetch('/api/projects/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, alsoHire }) });
      const result = await response.json();
      if (response.status === 401) { if (persistBeforeAuth()) window.location.assign(authDestination('login', PUBLISH_PROJECT_PATH)); return; }
      if (!response.ok || !result.success || !result.project?.id) { toast.error(result.error || 'Não foi possível publicar. Seu rascunho foi mantido.'); return; }
      setPublished(result.project); clearDraft();
      trackFunnelEvent('presta_certo_project_published', 'client');
      trackAnalyticsEvent('project_published', { category: formData.category });
    } catch { toast.error('A conexão falhou. Confira seus projetos antes de tentar novamente. Seu rascunho foi mantido.'); }
    finally { publishLock.current = false; setLoadingPublish(false); }
  };

  if (published) return <div className="mx-auto max-w-2xl px-5 py-16"><div className="rounded-2xl border border-blue-100 bg-white p-8"><Check className="size-10 rounded-full bg-blue-50 p-2 text-blue-600"/><h1 className="mt-5 text-3xl font-semibold text-slate-900">Seu projeto está publicado.</h1><p className="mt-4 text-lg text-slate-600">{published.title}</p><p className="mt-3 leading-7 text-slate-500">Acompanhe os detalhes e as propostas na página do projeto.</p><div className="mt-7 flex flex-wrap gap-3"><Link href={`/projects/${published.id}`} className={primaryClass}>Ver meu projeto<ArrowRight className="size-4"/></Link><Link href="/dashboard" className={secondaryClass}>Ir para meu painel</Link></div><button type="button" onClick={() => setPublished(null)} className="mt-6 text-sm font-medium text-blue-700">Publicar outro projeto</button></div></div>;

  return <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
    <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-500"><ArrowLeft className="size-4"/>Voltar ao início</Link>
    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-blue-700">Publicação gratuita</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Conte o que você precisa.</h1><p className="mt-4 leading-7 text-slate-600">Prepare seu projeto, revise os detalhes e publique para receber propostas.</p>
    <ol aria-label="Etapas da publicação" className="my-7 flex gap-5 text-sm"><li className={step === 1 ? 'font-semibold text-blue-700' : 'text-slate-500'} aria-current={step === 1 ? 'step' : undefined}>1. Descrever</li><li className={step === 2 ? 'font-semibold text-blue-700' : 'text-slate-500'} aria-current={step === 2 ? 'step' : undefined}>2. Revisar e publicar</li></ol>
    {!ready ? <p role="status" className="py-8 text-slate-500">Preparando seu rascunho…</p> : step === 1 ? <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
      <FileText className="size-6 text-blue-600"/><label htmlFor="project-idea" className="mt-5 block text-lg font-semibold text-slate-900">Qual serviço você quer contratar?</label><p className="mt-2 text-sm leading-6 text-slate-500">Conte o que precisa ser feito e o resultado esperado. Você pode editar tudo na próxima etapa.</p><textarea id="project-idea" value={idea} onChange={event => setIdea(event.target.value)} rows={6} maxLength={10000} placeholder="Ex.: preciso de um site para minha clínica, com agendamento e contato pelo WhatsApp." className={fieldClass}/>
      <label htmlFor="project-category" className="mt-5 block text-sm font-semibold text-slate-700">Área do projeto</label><select id="project-category" value={formData.category} onChange={event => update('category', event.target.value)} className={fieldClass}>{categories.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{userId && <button type="button" onClick={organizeWithAI} disabled={loadingBrief} className={secondaryClass}><Sparkles className="size-4"/>{loadingBrief ? 'Organizando…' : 'Organizar com IA (opcional)'}</button>}<button type="button" onClick={continueManually} disabled={loadingBrief} className={`${primaryClass} sm:ml-auto`}>Continuar<ArrowRight className="size-4"/></button></div>
    </section> : <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Confira antes de publicar</h2><div className="mt-6 grid gap-5"><label className="text-sm font-semibold text-slate-700">Título do projeto<input required minLength={5} maxLength={120} value={formData.title} onChange={event => update('title',event.target.value)} className={fieldClass}/></label><label className="text-sm font-semibold text-slate-700">Descrição<textarea required minLength={20} maxLength={10000} rows={6} value={formData.description} onChange={event => update('description',event.target.value)} className={fieldClass}/></label><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Orçamento previsto (R$)<input required type="number" min={1} max={99999999.99} step="0.01" value={formData.budget} onChange={event => update('budget',event.target.value)} placeholder="Ex.: 2500" className={fieldClass}/></label><label className="text-sm font-semibold text-slate-700">Prazo desejado (opcional)<input type="date" value={formData.deadline} onChange={event => update('deadline',event.target.value)} className={fieldClass}/></label></div><label className="text-sm font-semibold text-slate-700">Habilidades ou serviços necessários (opcional)<input maxLength={1600} value={formData.skills} onChange={event => update('skills',event.target.value)} placeholder="Separe por vírgulas. Ex.: design, site, SEO" className={fieldClass}/></label></div>
      {role === 'freelancer' && <label className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950"><input type="checkbox" required checked={alsoHire} onChange={event => setAlsoHire(event.target.checked)} className="mt-1"/>Quero também contratar profissionais com esta conta. Continuarei podendo oferecer meus serviços.</label>}
      {!userId && <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">Para publicar, crie sua conta gratuita ou <Link href={authDestination('login',PUBLISH_PROJECT_PATH)} onClick={event => { if (!persistBeforeAuth()) event.preventDefault(); }} className="font-semibold underline">entre na sua conta</Link>. Seu rascunho continua disponível neste navegador.</div>}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" disabled={loadingPublish} onClick={() => { setIdea(formData.description); setStep(1); }} className={secondaryClass}><ArrowLeft className="size-4"/>Voltar</button><button type="submit" disabled={loadingPublish} className={primaryClass}>{loadingPublish ? 'Publicando…' : userId ? 'Publicar projeto grátis' : 'Criar conta e publicar'}<ArrowRight className="size-4"/></button></div><p className="mt-4 text-xs leading-6 text-slate-500">Publicar é gratuito. O valor e o pagamento do serviço serão combinados com o profissional.</p>
    </form>}
    {draftSaveError && <p role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Não foi possível salvar seu rascunho neste navegador. Seus dados continuam nesta página. Copie-os antes de sair ou libere o armazenamento do navegador e tente novamente.</p>}
    {ready && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><p role="status">{draftStored ? 'Rascunho salvo neste navegador por até 24 horas.' : 'Seu projeto só será publicado após sua confirmação.'}</p>{(idea || formData.description) && <button type="button" disabled={loadingPublish || loadingBrief} onClick={clearDraft} className="min-h-11 text-slate-600 underline">Descartar rascunho</button>}</div>}
  </div>;
}
