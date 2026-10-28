'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  product: string;
  plans: string[];
  accent: string;
};

export function LeadForm({ product, plans, accent }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const whatsapp = String(form.get('whatsapp') ?? '').trim();
    const company = String(form.get('company') ?? '').trim();
    const plan = String(form.get('plan') ?? '');

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: `Interesse: ${product} (${plan})`,
          message: `Produto: ${product}\nPlano: ${plan}\nWhatsApp: ${whatsapp || '-'}\nEmpresa: ${company || '-'}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível enviar agora.');
      }
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-900 shadow-sm">
        <p className="text-2xl font-bold mb-2">Recebido!</p>
        <p className="text-gray-600">Vamos falar com você em até 1 dia útil para ativar sua conta.</p>
      </div>
    );
  }

  const input = 'w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400';

  return (
    <form onSubmit={onSubmit} className="rounded-xl border bg-white p-6 text-gray-900 shadow-sm space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Nome
          <input name="name" required className={`${input} mt-1`} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" required className={`${input} mt-1`} />
        </label>
        <label className="block text-sm font-medium">
          WhatsApp
          <input name="whatsapp" type="tel" placeholder="(11) 99999-9999" className={`${input} mt-1`} />
        </label>
        <label className="block text-sm font-medium">
          Empresa
          <input name="company" className={`${input} mt-1`} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Plano de interesse
        <select name="plan" defaultValue={plans[1] ?? plans[0]} className={`${input} mt-1`}>
          {plans.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" size="lg" disabled={status === 'sending'} className={cn('h-11 w-full text-white', accent)}>
        {status === 'sending' ? 'Enviando...' : 'Quero começar'}
      </Button>
    </form>
  );
}
