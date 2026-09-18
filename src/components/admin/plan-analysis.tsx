'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Trophy } from 'lucide-react';

const planData = [
  { name: 'Free', subscribers: 8420, revenue: 0, churn: 3.2 },
  { name: 'Pro', subscribers: 2180, revenue: 13080, churn: 1.8 },
  { name: 'Business', subscribers: 890, revenue: 8820, churn: 0.9 },
];

const growthData = [
  { month: 'Ago', free: 7200, pro: 1800, business: 650 },
  { month: 'Set', free: 8420, pro: 2180, business: 890 },
];

export function PlanAnalysis() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Análise de Planos</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
          />
          <Line type="monotone" dataKey="free" stroke="#94a3b8" name="Free" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="pro" stroke="#3b82f6" name="Pro" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="business" stroke="#10b981" name="Business" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        {planData.map((plan) => (
          <div key={plan.name} className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-sm font-bold">
                  {plan.name === 'Free' ? '🆓' : plan.name === 'Pro' ? '⚡' : '👑'}
                </div>
                <div>
                  <p className="font-semibold text-white">{plan.name}</p>
                  <p className="text-xs text-slate-400">Churn: {plan.churn}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white flex items-center gap-1">
                  <Users size={16} />
                  {plan.subscribers.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-green-400">R$ {plan.revenue.toLocaleString('pt-BR')}/mês</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <div
                className={`h-full ${plan.name === 'Free' ? 'bg-slate-500' : plan.name === 'Pro' ? 'bg-blue-500' : 'bg-green-500'}`}
                style={{ width: `${(plan.subscribers / 8420) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-purple-900/20 border border-purple-800 p-3">
          <p className="text-xs text-purple-300">Top Plano</p>
          <p className="font-bold text-white flex items-center gap-1 mt-1">
            <Trophy size={16} className="text-yellow-400" />
            Free (8.420 users)
          </p>
        </div>
        <div className="rounded-lg bg-green-900/20 border border-green-800 p-3">
          <p className="text-xs text-green-300">MRR Pago</p>
          <p className="font-bold text-white mt-1">R$ 21.900/mês</p>
        </div>
      </div>
    </div>
  );
}
