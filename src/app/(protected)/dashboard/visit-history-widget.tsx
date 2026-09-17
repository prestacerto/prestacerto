'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp } from 'lucide-react';

interface VisitData {
  day: string;
  views: number;
}

export function VisitHistoryWidget() {
  const [data, setData] = useState<VisitData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular dados de histórico de visitas
    const mockData: VisitData[] = [
      { day: 'Seg', views: 8 },
      { day: 'Ter', views: 12 },
      { day: 'Qua', views: 15 },
      { day: 'Qui', views: 10 },
      { day: 'Sex', views: 18 },
      { day: 'Sab', views: 22 },
      { day: 'Dom', views: 28 },
    ];

    setData(mockData);
    setTotalViews(mockData.reduce((sum, d) => sum + d.views, 0));
    setPercentChange(40); // Simular 40% de crescimento
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-700/30 rounded-lg" />;
  }

  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          Histórico de Visitas
        </h3>
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <TrendingUp className="w-4 h-4" />
          +{percentChange}%
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6 flex items-end justify-between gap-2 h-32">
        {data.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition hover:from-blue-500 hover:to-blue-300"
              style={{ height: `${(day.views / maxViews) * 100}%` }}
              title={`${day.day}: ${day.views} visitas`}
            />
            <span className="text-xs text-slate-400 mt-2">{day.day}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-xs mb-1">Total esta semana</p>
            <p className="text-2xl font-bold text-blue-400">{totalViews}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Comparado à semana anterior</p>
            <p className="text-2xl font-bold text-emerald-400">+{percentChange}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
