'use client';

import { Trophy, Users } from 'lucide-react';

type PlanRow = { plan: 'pro' | 'business'; label: string; sales: number; revenue: number; active: number; price: number };
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function PlanAnalysis({ byPlan, mrr, activeSubscriptions, freeUsers }: { byPlan: PlanRow[]; mrr: number; activeSubscriptions: number; freeUsers: number | null }) {
  const top = [...byPlan].sort((a, b) => b.revenue - a.revenue)[0];
  const maxActive = Math.max(1, ...byPlan.map((p) => p.active), freeUsers ?? 0);
  const rows = [
    { key: 'free', label: 'Grátis', icon: '🆓', users: freeUsers, revenue: 0, color: 'bg-slate-500' },
    ...byPlan.map((p) => ({ key: p.plan, label: p.label, icon: p.plan === 'pro' ? '⚡' : '👑', users: p.active, revenue: p.active * p.price, color: p.plan === 'pro' ? 'bg-blue-500' : 'bg-green-500' })),
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Planos</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-sm">{r.icon}</div>
                <p className="font-semibold text-white">{r.label}</p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1 font-bold text-white"><Users size={16} />{r.users === null ? '—' : r.users.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-green-400">{brl(r.revenue)}/mês</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div className={`h-full ${r.color}`} style={{ width: `${Math.min(100, ((r.users ?? 0) / maxActive) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-purple-800 bg-purple-900/20 p-3">
          <p className="text-xs text-purple-300">Plano que mais vendeu</p>
          <p className="mt-1 flex items-center gap-1 font-bold text-white"><Trophy size={16} className="text-yellow-400" />{top && top.sales > 0 ? `${top.label} (${top.sales})` : 'Sem vendas ainda'}</p>
        </div>
        <div className="rounded-lg border border-green-800 bg-green-900/20 p-3">
          <p className="text-xs text-green-300">MRR de assinaturas ativas</p>
          <p className="mt-1 font-bold text-white">{brl(mrr)} · {activeSubscriptions} ativas</p>
        </div>
      </div>
    </div>
  );
}
