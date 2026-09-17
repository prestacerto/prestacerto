'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createServiceAction, updateServiceAction } from '@/app/(protected)/dashboard/services/actions';
import type { Category, Service } from '@/lib/supabase/types';

const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-500';
export function ServiceForm({ categories, service }: { categories: Category[]; service?: Service }) {
  const router = useRouter();
  const pending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const focusName = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (loading || !focusName.current) return;
    const input = formRef.current?.elements.namedItem(focusName.current);
    focusName.current = null;
    if (input instanceof HTMLElement) input.focus();
  }, [loading, errors]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    pending.current = true; setLoading(true); setError(''); setErrors({});
    try {
      const result = service ? await updateServiceAction(service.id, values) : await createServiceAction(values);
      if (!result.success) {
        setError(result.error); setErrors(result.errors || {});
        focusName.current = Object.keys(result.errors || {})[0] || null;
        return;
      }
      router.push('/dashboard/services'); router.refresh();
    } catch { setError('Não foi possível confirmar o salvamento. Seus dados continuam no formulário.'); }
    finally { pending.current = false; setLoading(false); }
  }
  const accessible = (name: string) => ({ id: name, name, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined });
  const fieldError = (name: string) => errors[name] ? <p id={`${name}-error`} className="mt-2 text-sm text-red-700">{errors[name]}</p> : null;

  return <form ref={formRef} onSubmit={submit} className="mt-7 space-y-5" aria-busy={loading}>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}
    <fieldset disabled={loading} className="min-w-0 space-y-5">
      <label htmlFor="title" className="block text-sm font-semibold text-slate-700">Título do serviço<input {...accessible('title')} required minLength={5} maxLength={120} defaultValue={service?.title || ''} placeholder="Ex.: Criação de identidade visual" className={fieldClass}/>{fieldError('title')}</label>
      <label htmlFor="description" className="block text-sm font-semibold text-slate-700">Descrição<textarea {...accessible('description')} required minLength={20} maxLength={5000} rows={5} defaultValue={service?.description || ''} placeholder="Explique o que está incluído, sua experiência e como você trabalha." className={fieldClass}/>{fieldError('description')}</label>
      <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-700">Categoria (opcional)<select {...accessible('categoryId')} defaultValue={service?.category_id ?? ''} className={fieldClass}><option value="">Selecione uma categoria</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{fieldError('categoryId')}</label>
      <label htmlFor="skills" className="block text-sm font-semibold text-slate-700">Habilidades (opcional)<input {...accessible('skills')} maxLength={1600} defaultValue={service?.skills.join(', ') || ''} placeholder="Separe por vírgulas. Ex.: design, ilustração" className={fieldClass}/>{fieldError('skills')}</label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor="priceHour" className="block text-sm font-semibold text-slate-700">Preço por hora (R$, opcional)<input {...accessible('priceHour')} type="number" min="0.01" max="99999999.99" step="0.01" defaultValue={service?.price_hour ?? ''} placeholder="Ex.: 120" className={fieldClass}/>{fieldError('priceHour')}</label>
        <label htmlFor="deliveryDays" className="block text-sm font-semibold text-slate-700">Prazo em dias (opcional)<input {...accessible('deliveryDays')} type="number" min="1" max="730" step="1" defaultValue={service?.delivery_days ?? ''} placeholder="Ex.: 14" className={fieldClass}/>{fieldError('deliveryDays')}</label>
      </div>
      <p className="text-sm leading-6 text-slate-600">{service ? 'Revise as informações antes de salvar. O status ativo ou pausado será mantido.' : 'Ao publicar, este serviço ficará visível para clientes. Você poderá editar ou pausar depois.'}</p>
      <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60">{loading ? 'Salvando…' : service ? 'Salvar alterações' : 'Publicar serviço'}</button>
    </fieldset>
    <Link href="/dashboard/services" className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 underline">Voltar aos meus serviços</Link>
  </form>;
}
