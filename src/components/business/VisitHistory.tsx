'use client';

import { useEffect, useState } from 'react';

export function VisitHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerar dados simulados pro gráfico
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    const visits = [8, 12, 15, 10, 18, 14, 12];
    const growth = 40;

    setData(days.map((day, i) => ({
      day,
      visits: visits[i],
      pct: Math.round((visits[i] / 20) * 100)
    })));

    setLoading(false);
  }, []);

  if (loading) return <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;

  const totalVisits = data.reduce((sum, d) => sum + d.visits, 0);
  const avgVisits = Math.round(totalVisits / data.length);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="mb-6">
        <h3 className="font-bold text-lg">📊 Sua Semana</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalVisits}</p>
            <p className="text-xs text-gray-500">visitas</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Média</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{avgVisits}</p>
            <p className="text-xs text-gray-500">por dia</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Crescimento</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">+40%</p>
            <p className="text-xs text-gray-500">vs semana</p>
          </div>
        </div>
      </div>

      {/* Mini gráfico de barras */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribuição</p>
        {data.map((d) => (
          <div key={d.day} className="flex items-center gap-3">
            <span className="w-8 text-xs font-semibold text-gray-600 dark:text-gray-400">{d.day}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all"
                style={{ width: `${d.pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">
              {d.visits}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
