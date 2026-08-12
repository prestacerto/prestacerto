'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceData {
  metric: string;
  userPrice: number;
  marketAvg: number;
  diff: number;
  status: 'competitive' | 'low' | 'high';
}

export function PriceComparisonWidget() {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: PriceData[] = [
      {
        metric: 'Valor por Hora',
        userPrice: 80,
        marketAvg: 85,
        diff: -6,
        status: 'low',
      },
      {
        metric: 'Projeto Médio',
        userPrice: 2400,
        marketAvg: 2800,
        diff: -14,
        status: 'low',
      },
      {
        metric: 'Receita Mensal',
        userPrice: 12800,
        marketAvg: 14400,
        diff: -11,
        status: 'low',
      },
    ];

    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-700/30 rounded-lg" />;
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-amber-400" />
        Comparação de Preços
      </h3>

      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">{item.metric}</p>
              <div
                className={`flex items-center gap-2 ${
                  item.status === 'competitive'
                    ? 'text-emerald-400'
                    : item.status === 'low'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {item.diff < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                <span className="font-bold">{item.diff}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-xs mb-1">Seu Preço</p>
                <p className="text-lg font-bold text-white">
                  R$ {item.userPrice.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Mercado</p>
                <p className="text-lg font-bold text-slate-300">
                  R$ {item.marketAvg.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="mt-4 bg-amber-600/20 border border-amber-600/30 rounded-lg p-4 text-center">
        <p className="text-amber-300 text-sm">
          💡 Você está cobrando 10-14% abaixo do mercado. Considere aumentar seus preços!
        </p>
      </div>
    </div>
  );
}
