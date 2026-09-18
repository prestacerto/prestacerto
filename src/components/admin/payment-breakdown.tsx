'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

type Method = { method: string; amount: number; count: number };
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7'];
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function PaymentBreakdown({ methods }: { methods: Method[] | null }) {
  const total = (methods ?? []).reduce((s, m) => s + m.amount, 0);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-2 text-xl font-bold text-white">Formas de pagamento</h2>
      {methods === null && (
        <p className="rounded-lg border border-amber-800/60 bg-amber-900/20 p-3 text-xs text-amber-100">
          Aguardando a tabela <code>assiny_payments</code> no banco (migration <code>20260918230000</code>). O webhook já está pronto para gravar valor e método.
        </p>
      )}
      {methods !== null && methods.length === 0 && <p className="text-sm text-slate-500">Nenhum pagamento registrado ainda.</p>}
      {methods && methods.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={methods} dataKey="amount" nameKey="method" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
                {methods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => brl(Number(value))} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {methods.map((m, i) => {
              const Icon = m.method === 'PIX' ? Smartphone : m.method === 'Cartão' ? CreditCard : Wallet;
              return (
                <div key={m.method} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg p-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}><Icon size={18} className="text-white" /></div>
                    <div>
                      <p className="text-sm text-slate-300">{m.method}</p>
                      <p className="font-bold text-white">{brl(m.amount)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{total ? Math.round((m.amount / total) * 100) : 0}% · {m.count}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
