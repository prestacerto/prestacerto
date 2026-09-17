'use client';

import { useEffect, useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface ResponseStats {
  average_response_time_minutes: number;
  response_rate: number;
  last_response_date: string;
}

export function ResponseBadge({ freelancerId }: { freelancerId: string }) {
  const [stats, setStats] = useState<ResponseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/freelancer/${freelancerId}/response-stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [freelancerId]);

  if (loading || !stats) {
    return null;
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}min`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / 1440)}d`;
  };

  const getResponseQuality = (rate: number, minutes: number) => {
    if (rate >= 90 && minutes <= 120) return { label: 'Excelente', color: 'bg-emerald-600/20 border-emerald-600/50 text-emerald-300' };
    if (rate >= 75 && minutes <= 240) return { label: 'Boa', color: 'bg-blue-600/20 border-blue-600/50 text-blue-300' };
    if (rate >= 50) return { label: 'Normal', color: 'bg-amber-600/20 border-amber-600/50 text-amber-300' };
    return { label: 'Baixa', color: 'bg-slate-600/20 border-slate-600/50 text-slate-300' };
  };

  const quality = getResponseQuality(stats.response_rate, stats.average_response_time_minutes);

  return (
    <div className="space-y-3">
      {/* Response Rate Badge */}
      <div className={`border ${quality.color} rounded-lg px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="text-xs opacity-75">Taxa de Resposta</p>
            <p className="text-lg font-bold">{stats.response_rate}%</p>
          </div>
        </div>
        <span className="text-sm font-semibold opacity-75">{quality.label}</span>
      </div>

      {/* Response Time Badge */}
      <div className="bg-blue-600/20 border border-blue-600/50 text-blue-300 rounded-lg px-4 py-3 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        <div>
          <p className="text-xs opacity-75">Tempo Médio de Resposta</p>
          <p className="text-lg font-bold">{formatTime(stats.average_response_time_minutes)}</p>
        </div>
      </div>

      {/* Responsive indicator */}
      {stats.response_rate >= 80 && (
        <div className="bg-emerald-600/20 border border-emerald-600/50 text-emerald-300 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Profissional responsivo
        </div>
      )}
    </div>
  );
}
