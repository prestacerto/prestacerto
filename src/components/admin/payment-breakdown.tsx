'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CreditCard, Smartphone } from 'lucide-react';

const paymentData = [
  { name: 'Cartão', value: 62.2, amount: 28140 },
  { name: 'PIX', value: 37.8, amount: 17090 },
];

const COLORS = ['#3b82f6', '#10b981'];

export function PaymentBreakdown() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Métodos de Pagamento</h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={paymentData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={false}
          >
            {COLORS.map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-blue-800 bg-blue-900/20 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-2">
              <CreditCard size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Cartão de Crédito</p>
              <p className="font-bold text-white">R$ 28.140</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-400">62.2%</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-green-800 bg-green-900/20 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-600 p-2">
              <Smartphone size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-300">PIX</p>
              <p className="font-bold text-white">R$ 17.090</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-green-400">37.8%</p>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-800 pt-4">
        <p className="text-xs text-slate-400">Insight: PIX cresce 18.2% vs semana passada</p>
        <p className="text-xs text-slate-400">Cartão cresce 8.3% vs semana passada</p>
      </div>
    </div>
  );
}
