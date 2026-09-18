'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const productData = [
  { name: 'MATCH', revenue: 8900, subscribers: 1780, mrr: 8900 },
  { name: 'PREÇO', revenue: 6240, subscribers: 418, mrr: 6240 },
  { name: 'TIMING', revenue: 5430, subscribers: 548, mrr: 5430 },
  { name: 'DASHBOARD IA', revenue: 7890, subscribers: 158, mrr: 7890 },
  { name: 'DESTAQUE', revenue: 4560, subscribers: 57, mrr: 4560 },
  { name: 'PREMIUM', revenue: 3210, subscribers: 32, mrr: 3210 },
];

export function ProductPerformance() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Performance por Produto</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={productData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '0.5rem' }}
            formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {productData.map((product, idx) => (
          <div key={product.name} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-sm font-bold text-blue-400">
                {idx + 1}
              </div>
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="text-xs text-slate-400">{product.subscribers} subscribers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-400">R$ {product.revenue.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-400">MRR: R$ {product.mrr.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-blue-900/20 border border-blue-800 p-3">
        <p className="text-sm text-blue-300 flex items-center gap-2">
          <TrendingUp size={16} />
          <strong>MATCH</strong> é o top performer com R$ 8.900/mês
        </p>
      </div>
    </div>
  );
}
