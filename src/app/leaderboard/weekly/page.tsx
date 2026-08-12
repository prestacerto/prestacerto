'use client';

import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Star } from 'lucide-react';

interface FreelancerRanking {
  rank: number;
  name: string;
  earnings: number;
  projects: number;
  rating: number;
  response_rate: number;
  avatar?: string;
}

export default function WeeklyLeaderboard() {
  const [rankings, setRankings] = useState<FreelancerRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData: FreelancerRanking[] = [
      {
        rank: 1,
        name: 'João Silva',
        earnings: 8450,
        projects: 3,
        rating: 4.9,
        response_rate: 98,
      },
      {
        rank: 2,
        name: 'Maria Santos',
        earnings: 7230,
        projects: 2,
        rating: 4.8,
        response_rate: 96,
      },
      {
        rank: 3,
        name: 'Pedro Costa',
        earnings: 6890,
        projects: 2,
        rating: 4.7,
        response_rate: 92,
      },
      {
        rank: 4,
        name: 'Ana Oliveira',
        earnings: 5670,
        projects: 1,
        rating: 4.9,
        response_rate: 99,
      },
      {
        rank: 5,
        name: 'Carlos Mendes',
        earnings: 4920,
        projects: 1,
        rating: 4.6,
        response_rate: 88,
      },
    ];
    setRankings(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-700/30 rounded-lg" />;
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-amber-400" />
            Semana do Freelancer
          </h1>
          <p className="text-slate-400">Top freelancers de 5-12 de Agosto</p>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {rankings.map((freelancer) => (
            <div
              key={freelancer.rank}
              className={`rounded-lg p-6 transition transform hover:scale-102 ${
                freelancer.rank === 1
                  ? 'bg-gradient-to-r from-amber-600/30 to-slate-800/30 border border-amber-600/50'
                  : freelancer.rank === 2
                  ? 'bg-gradient-to-r from-slate-400/20 to-slate-800/30 border border-slate-400/50'
                  : freelancer.rank === 3
                  ? 'bg-gradient-to-r from-orange-600/20 to-slate-800/30 border border-orange-600/50'
                  : 'bg-slate-800/30 border border-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="text-4xl font-bold">
                    {freelancer.rank <= 3 ? medals[freelancer.rank - 1] : `#${freelancer.rank}`}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">{freelancer.name}</p>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>💰 R$ {freelancer.earnings.toLocaleString('pt-BR')}</span>
                      <span>📊 {freelancer.projects} projetos</span>
                      <span>⭐ {freelancer.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Response Rate Badge */}
                <div className="text-right">
                  <div className="bg-emerald-600/20 border border-emerald-600/50 rounded-lg px-4 py-2">
                    <p className="text-emerald-400 font-bold">{freelancer.response_rate}%</p>
                    <p className="text-emerald-300 text-xs">resposta</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prize Notice */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600/20 to-slate-800/30 border border-emerald-600/30 rounded-lg p-6 text-center">
          <p className="text-emerald-300 font-bold mb-2">🎁 Prêmios Semanais</p>
          <p className="text-slate-300">
            🥇 R$ 500 + Destaque | 🥈 R$ 250 | 🥉 R$ 100
          </p>
        </div>
      </div>
    </div>
  );
}
