'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Category } from '@/lib/supabase/types';
import { validateLandingLead, type LandingJourney } from '@/lib/landing-leads-validation';
import { trackLandingEvent } from '@/lib/landing-tracking';
import { saveLandingHandoff } from '@/lib/landing-handoff';

const contactFields = ['name', 'email', 'whatsapp'];
const fieldNames = ['name', 'email', 'whatsapp', 'categoryId', 'service', 'description', 'location', 'deadline', 'portfolio', 'experience', 'privacyAccepted'];
const inputClass = 'mt-2 block min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-base font-normal leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-500 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 aria-invalid:border-red-500 aria-invalid:bg-red-50/40';
const buttonClass = 'inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white shadow-[0_4px_12px_-4px_rgb(37_99_235_/_0.45)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 disabled:shadow-none';
const emptyForm = { name: '', email: '', whatsapp: '', categoryId: '', service: '', description: '', location: '', deadline: '', portfolio: '', experience: '', privacyAccepted: false };
type FormValues = typeof emptyForm;

export function LandingLeadForm({ journey, categories }: { journey: LandingJourney; categories: Category[] }) {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState('');
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState(false);
  const [handoffStored, setHandoffStored] = useState(true);
  const requestId = useRef<string | null>(null);
  const pending = useRef<AbortController | null>(null);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);
  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, []);
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    const target = received ? successRef.current :
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ||
      (requestError ? formRef.current?.querySelector<HTMLElement>('[data-request-error]') : null) ||
      formRef.current?.querySelector<HTMLElement>('input, select, textarea, button');
    // Reveal optional fields before moving keyboard focus to a validation error.
    target?.closest('details')?.setAttribute('open', '');
    target?.focus();
  }, [step, errors, requestError, received]);
  const client = journey === 'client';
  const prefix = `${journey}-lead`;

  const update = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => { const next = { ...current }; delete next[field]; return next; });
  };
  const errorFor = (field: string) => errors[field] ? <p id={`${prefix}-${field}-error`} className="mt-2 text-sm leading-5 text-red-700">{errors[field]}</p> : null;
  const accessible = (field: string) => ({ id: `${prefix}-${field}`, 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${prefix}-${field}-error` : undefined });
  const start = () => {
    if (started.current) return;
    started.current = true;
    trackLandingEvent('presta_certo_form_start', journey);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    if (step === 1) {
      const validation = validateLandingLead({ ...values, journey, id: '00000000-0000-4000-8000-000000000000' });
      const contactErrors = validation.success ? {} : Object.fromEntries(Object.entries(validation.errors).filter(([field]) => contactFields.includes(field)));
      focusNext.current = true;
      setErrors(contactErrors);
      if (Object.keys(contactErrors).length) {
        trackLandingEvent('presta_certo_form_error', journey);
        return;
      }
      setRequestError('');
      setStep(2);
      return;
    }
    trackLandingEvent('presta_certo_cta_click', journey);
    requestId.current ??= crypto.randomUUID();
    const validation = validateLandingLead({ ...values, journey, id: requestId.current });
    if (!validation.success) {
      focusNext.current = true;
      setErrors(validation.errors);
      if (contactFields.some(field => validation.errors[field])) setStep(1);
      trackLandingEvent('presta_certo_form_error', journey);
      return;
    }
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 25000);
    setLoading(true); setErrors({}); setRequestError('');
    try {
      const response = await fetch('/api/landing-leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data), signal: controller.signal,
      });
      const result = await response.json();
      if (pending.current !== controller) return;
      if (!response.ok || result?.success !== true) {
        focusNext.current = true;
        if (result?.errors && typeof result.errors === 'object') {
          const serverErrors = Object.fromEntries(Object.entries(result.errors).filter(([field, message]) => fieldNames.includes(field) && typeof message === 'string')) as Record<string, string>;
          setErrors(serverErrors);
          if (contactFields.some(field => serverErrors[field])) setStep(1);
        }
        setRequestError(typeof result?.error === 'string' ? result.error : 'Não foi possível registrar seu interesse. Revise os dados e tente novamente.');
        trackLandingEvent('presta_certo_form_error', journey);
        return;
      }
      focusNext.current = true;
      setHandoffStored(saveLandingHandoff(validation.data, categories.find(category => category.id === validation.data.categoryId)?.slug));
      setReceived(true);
      trackLandingEvent('presta_certo_lead_success', journey, validation.data.id);
    } catch {
      if (pending.current !== controller) return;
      focusNext.current = true;
      setRequestError('Não conseguimos confirmar o recebimento agora. Seus dados foram mantidos. Tente enviar novamente.');
      trackLandingEvent('presta_certo_form_error', journey);
    } finally {
      clearTimeout(timeout);
      if (pending.current === controller) { pending.current = null; setLoading(false); }
    }
  }

  if (received) return <div ref={successRef} tabIndex={-1} role="status" className="space-y-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-blue-950 outline-none focus-visible:ring-4 focus-visible:ring-blue-600/10 sm:p-6">
    <p className="text-xl font-semibold">Interesse recebido. Vamos ao cadastro?</p>
    <p className="text-sm leading-6">{client ? 'Crie sua conta gratuita para revisar os detalhes e publicar seu projeto.' : 'Crie sua conta gratuita para completar seu perfil e explorar os projetos publicados.'}</p>
    {!handoffStored && <p className="text-sm leading-6">Seu interesse foi registrado. Este navegador não permitiu guardar os dados para a próxima etapa; você poderá preenchê-los novamente no cadastro.</p>}
    <Link href={client ? '/register?role=client&next=%2Fpublicar-projeto' : '/register?role=freelancer&next=%2Fdashboard%2Fprofile'} className={buttonClass}>
      {client ? 'Criar conta e preparar meu projeto' : 'Criar meu perfil gratuito'}
    </Link>
    <p className="text-xs leading-5">{client ? 'O envio deste formulário não publica um projeto automaticamente.' : 'O envio deste formulário não cria um perfil público automaticamente.'}</p>
  </div>;

  return <form ref={formRef} aria-labelledby="landing-form-title" onSubmit={submit} onFocusCapture={start} noValidate aria-busy={loading} className="space-y-5">
    <ol aria-label="Etapas do formulário" className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100/80 p-1.5 text-sm font-semibold leading-5">
      <li aria-current={step === 1 ? 'step' : undefined} className={`flex min-h-11 items-center rounded-xl border px-3 py-2.5 transition-colors ${step === 1 ? 'border-slate-200/70 bg-white text-blue-700 shadow-sm' : 'border-transparent text-slate-600'}`}>1. Seu contato</li>
      <li aria-current={step === 2 ? 'step' : undefined} className={`flex min-h-11 items-center rounded-xl border px-3 py-2.5 transition-colors ${step === 2 ? 'border-slate-200/70 bg-white text-blue-700 shadow-sm' : 'border-transparent text-slate-600'}`}>2. {client ? 'O que você precisa' : 'Seu serviço'}</li>
    </ol>
    {Object.keys(errors).length > 0 && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">Revise os campos indicados abaixo.</p>}
    <fieldset disabled={loading} className="min-w-0">
    {step === 1 ? <div className="space-y-4">
      <label htmlFor={`${prefix}-name`} className="block text-sm font-semibold text-slate-800">Seu nome
        <input {...accessible('name')} required autoComplete="name" maxLength={120} value={values.name} onChange={event => update('name', event.target.value)} className={inputClass} placeholder="Como podemos chamar você?" />{errorFor('name')}
      </label>
      <label htmlFor={`${prefix}-email`} className="block text-sm font-semibold text-slate-800">E-mail
        <input {...accessible('email')} required type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={320} value={values.email} onChange={event => update('email', event.target.value)} className={inputClass} placeholder="voce@exemplo.com" />{errorFor('email')}
        <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">Usamos seu e-mail para salvar seu pedido e mostrar o próximo passo. Sem cobrança nesta etapa.</span>
      </label>
      <label htmlFor={`${prefix}-whatsapp`} className="block text-sm font-semibold text-slate-800">WhatsApp <span className="font-normal text-slate-500">(opcional)</span>
        <input {...accessible('whatsapp')} type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={values.whatsapp} onChange={event => update('whatsapp', event.target.value)} className={inputClass} placeholder="(11) 99999-9999" />{errorFor('whatsapp')}
      </label>
      <button type="submit" className={buttonClass}>Continuar — é grátis</button>
    </div> : <div className="space-y-4">
      <label htmlFor={`${prefix}-service`} className="block text-sm font-semibold text-slate-800">{client ? 'Qual serviço você precisa?' : 'Qual serviço você oferece?'}
        <input {...accessible('service')} required maxLength={160} value={values.service} onChange={event => update('service', event.target.value)} className={inputClass} placeholder={client ? 'Ex.: criar um site' : 'Ex.: design gráfico'} />{errorFor('service')}
      </label>
      <div>
        <label htmlFor={`${prefix}-location`} className="block text-sm font-semibold text-slate-800">{client ? 'Onde será o serviço?' : 'Onde você atende?'}
          <input {...accessible('location')} required maxLength={160} value={values.location} onChange={event => update('location', event.target.value)} className={inputClass} placeholder="Cidade/UF ou remoto" />{errorFor('location')}
        </label>
        <button type="button" onClick={() => update('location', 'Remoto')} aria-pressed={values.location.trim().toLowerCase() === 'remoto'} className="mt-2 inline-flex min-h-11 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 aria-pressed:border-blue-600 aria-pressed:bg-blue-50">{client ? 'O serviço pode ser remoto' : 'Atendo remotamente'}</button>
      </div>
      {client && <label htmlFor={`${prefix}-description`} className="block text-sm font-semibold text-slate-800">O que você espera receber?
        <textarea {...accessible('description')} required rows={3} maxLength={5000} value={values.description} onChange={event => update('description', event.target.value)} className={inputClass} placeholder="Ex.: um site com 5 páginas para apresentar minha empresa." />{errorFor('description')}
      </label>}
      <details className="rounded-xl border border-slate-200 px-3.5 open:pb-4">
        <summary className="min-h-12 cursor-pointer py-3 text-sm font-semibold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Adicionar detalhes opcionais</summary>
        <div className="space-y-4 pt-2">
          <label htmlFor={`${prefix}-categoryId`} className="block text-sm font-semibold text-slate-800">Categoria <span className="font-normal text-slate-500">(opcional)</span>
            <select {...accessible('categoryId')} value={values.categoryId} onChange={event => update('categoryId', event.target.value)} className={inputClass}><option value="">Selecione se souber</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{errorFor('categoryId')}
          </label>
          {client ? <label htmlFor={`${prefix}-deadline`} className="block text-sm font-semibold text-slate-800">Quando precisa? <span className="font-normal text-slate-500">(opcional)</span>
            <input {...accessible('deadline')} maxLength={120} value={values.deadline} onChange={event => update('deadline', event.target.value)} className={inputClass} placeholder="Ex.: nas próximas duas semanas" />{errorFor('deadline')}
          </label> : <>
            <label htmlFor={`${prefix}-portfolio`} className="block text-sm font-semibold text-slate-800">Site ou portfólio <span className="font-normal text-slate-500">(opcional)</span>
              <input {...accessible('portfolio')} type="url" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} maxLength={2048} value={values.portfolio} onChange={event => update('portfolio', event.target.value)} className={inputClass} placeholder="https://seu-portfolio.com" />{errorFor('portfolio')}
            </label>
            <label htmlFor={`${prefix}-experience`} className="block text-sm font-semibold text-slate-800">Sua experiência <span className="font-normal text-slate-500">(opcional)</span>
              <textarea {...accessible('experience')} rows={2} maxLength={1000} value={values.experience} onChange={event => update('experience', event.target.value)} className={inputClass} placeholder="Conte sua experiência ou diga se está começando." />{errorFor('experience')}
            </label>
          </>}
        </div>
      </details>
      <div>
        <label htmlFor={`${prefix}-privacyAccepted`} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-sm leading-6 text-slate-600">
          <input {...accessible('privacyAccepted')} type="checkbox" required checked={values.privacyAccepted} onChange={event => update('privacyAccepted', event.target.checked)} className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 focus-visible:ring-offset-2 aria-invalid:outline-2 aria-invalid:outline-red-500" />
          <span>Li e aceito a <Link href="/privacidade" aria-label="Política de privacidade (abre em nova aba)" target="_blank" rel="noopener noreferrer" className="rounded font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">política de privacidade</Link> para o tratamento dos dados enviados.</span>
        </label>{errorFor('privacyAccepted')}
      </div>
      <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Enviando…' : 'Enviar meu interesse'}</button>
      <p className="text-center text-xs leading-5 text-slate-500">Depois do envio, você poderá criar sua conta gratuita e continuar.</p>
      <button type="button" disabled={loading} onClick={() => { focusNext.current = true; setStep(1); setRequestError(''); }} className="min-h-11 w-full rounded-xl text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-wait">Voltar aos dados de contato</button>
    </div>}
    </fieldset>
    {requestError && <p data-request-error tabIndex={-1} role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{requestError}</p>}
    <p className="text-center text-xs leading-5 text-slate-500">Sem cobrança e sem senha nesta etapa.</p>
  </form>;
}
