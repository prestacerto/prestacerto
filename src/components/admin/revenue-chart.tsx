'use client';

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Daily = { label: string; revenue: number; sales: number; refunds: number };
type Monthly = { label: string; revenue: number; sales: number };

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const tooltipStyle = { backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' };

export function RevenueChart({ daily, monthly, hasData }: { daily: Daily[]; monthly: Monthly[]; hasData: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Receita diária (30 dias)</h2>
        {!hasData && <span className="text-xs text-slate-500">Aguardando a primeira venda</span>}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={daily}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={4} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [brl(Number(value)), String(name) === "revenue" ? "Vendas" : "Reembolsos"]} />
          <Bar dataKey="revenue" name="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="refunds" name="refunds" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="mb-3 mt-8 text-sm font-semibold text-slate-300">Receita mensal (6 meses)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={monthly}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v}`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => brl(Number(value))} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Receita" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
