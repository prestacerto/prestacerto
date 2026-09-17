'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Ranking {
  rank_position: number;
  visits_count: number;
  trending_direction: string;
}

export function LeaderboardCard({ city }: { city?: string }) {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);

    fetch(`/api/business/leaderboard?${params}`)
      .then(r => r.json())
      .then(d => setRankings(d.rankings || []))
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-4">🏅 Semana do Freelancer - {city || 'São Paulo'}</h3>

      {rankings.length === 0 ? (
        <p className="text-gray-500 text-sm">Sem dados de ranking ainda</p>
      ) : (
        <div className="space-y-2">
          {rankings.slice(0, 5).map((r, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">{r.rank_position}</span>
                <span className="text-sm font-medium">Posição</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{r.visits_count} visitas</span>
                {r.trending_direction === 'up' && <span className="text-green-600">↑</span>}
                {r.trending_direction === 'down' && <span className="text-red-600">↓</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
