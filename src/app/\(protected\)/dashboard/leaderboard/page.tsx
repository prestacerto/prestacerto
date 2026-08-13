'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface Freelancer {
  rank: number;
  name: string;
  skill: string;
  rating: number;
  projects: number;
  earnings: number;
  avatar: string;
  verified: boolean;
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<'rating' | 'earnings'>('rating');

  const leaderboardData: Freelancer[] = [
    { rank: 1, name: 'Carlos Silva', skill: 'React/Next.js', rating: 4.95, projects: 89, earnings: 125000, avatar: '👨‍💼', verified: true },
    { rank: 2, name: 'Ana Costa', skill: 'UI/UX Design', rating: 4.92, projects: 76, earnings: 98500, avatar: '👩‍💼', verified: true },
    { rank: 3, name: 'Pedro Santos', skill: 'Python/AI', rating: 4.89, projects: 65, earnings: 115000, avatar: '👨‍🔬', verified: true },
    { rank: 4, name: 'Julia Oliveira', skill: 'DevOps', rating: 4.87, projects: 52, earnings: 145000, avatar: '👩‍💻', verified: true },
    { rank: 5, name: 'Marco Rodrigues', skill: 'Backend', rating: 4.85, projects: 71, earnings: 112000, avatar: '👨‍💻', verified: false },
    { rank: 6, name: 'Fernanda Lima', skill: 'Mobile', rating: 4.82, projects: 58, earnings: 87000, avatar: '👩‍🎨', verified: true },
    { rank: 7, name: 'Bruno Costa', skill: 'Full Stack', rating: 4.80, projects: 64, earnings: 95000, avatar: '👨‍💼', verified: false },
    { rank: 8, name: 'Lucia Marques', skill: 'Data Science', rating: 4.78, projects: 45, earnings: 125000, avatar: '👩‍🔬', verified: true },
    { rank: 9, name: 'Rafael Gomes', skill: 'QA', rating: 4.75, projects: 82, earnings: 72000, avatar: '👨‍🏫', verified: true },
    { rank: 10, name: 'Patricia Alves', skill: 'Marketing', rating: 4.72, projects: 48, earnings: 65000, avatar: '👩‍💼', verified: false },
  ];

  const sorted = [...leaderboardData].sort((a, b) =>
    sortBy === 'rating'
      ? b.rating - a.rating
      : b.earnings - a.earnings
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="text-gray-600">Top freelancers da plataforma</p>
      </div>

      {/* Sort Buttons */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSortBy('rating')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            sortBy === 'rating'
              ? 'bg-blue-500 text-white'
              : 'bg-white border text-gray-700 hover:border-blue-500'
          }`}
        >
          Ordenar por Rating
        </button>
        <button
          onClick={() => setSortBy('earnings')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            sortBy === 'earnings'
              ? 'bg-blue-500 text-white'
              : 'bg-white border text-gray-700 hover:border-blue-500'
          }`}
        >
          Ordenar por Faturamento
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Freelancer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Especialidade</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Rating</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Projetos</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Faturamento</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((freelancer, idx) => (
              <tr key={idx} className={`border-t hover:bg-gray-50 transition ${idx < 3 ? 'bg-yellow-50 bg-opacity-30' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {idx < 3 && <Trophy className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-orange-500'}`} />}
                    <span className="font-bold text-lg">{freelancer.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{freelancer.avatar}</div>
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {freelancer.name}
                        {freelancer.verified && <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded text-xs">✓ Verificado</span>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">{freelancer.skill}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold">{freelancer.rating}★</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-semibold">{freelancer.projects}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-lg">R$ {(freelancer.earnings / 1000).toFixed(0)}k</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <Award className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">Top Rating</p>
          <p className="text-3xl font-bold">4.95★</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">Média de Projetos</p>
          <p className="text-3xl font-bold">63.1</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <Trophy className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-sm opacity-90">Faturamento Top 10</p>
          <p className="text-3xl font-bold">R$ 937k</p>
        </div>
      </div>
    </div>
  );
}
