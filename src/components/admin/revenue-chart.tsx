'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { week: 'Sem 1', daily: 15420, weekly: 15420, monthly: 15420 },
  { week: 'Sem 2', daily: 18650, weekly: 34070, monthly: 34070 },
  { week: 'Sem 3', daily: 22340, weekly: 56410, monthly: 56410 },
  { week: 'Sem 4', daily: 24120, weekly: 80530, monthly: 80530 },
  { week: 'Sem 5', daily: 26780, weekly: 107310, monthly: 107310 },
];

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Receita (Diário → Semanal → Mensal)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="week" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
            formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="daily"
            stroke="#3b82f6"
            name="Receita Diária"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="weekly"
            stroke="#10b981"
            name="Receita Acumulada Semanal"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="monthly"
            stroke="#f59e0b"
            name="Projeção Mensal"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Breakdown by day */}
      <div className="mt-8 grid grid-cols-5 gap-4">
        {[
          { day: 'Seg', revenue: 5240, transactions: 78 },
          { day: 'Ter', revenue: 4920, transactions: 72 },
          { day: 'Qua', revenue: 6150, transactions: 91 },
          { day: 'Qui', revenue: 7340, transactions: 108 },
          { day: 'Sex', revenue: 8580, transactions: 125 },
        ].map((item) => (
          <div key={item.day} className="rounded-lg border border-slate-800 bg-slate-800/50 p-4 text-center">
            <p className="text-sm text-slate-400">{item.day}</p>
            <p className="mt-2 text-lg font-bold text-white">R$ {item.revenue.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500">{item.transactions} transações</p>
          </div>
        ))}
      </div>
    </div>
  );
}
