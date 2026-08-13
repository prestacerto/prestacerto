'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Award, TrendingUp, Zap, Heart, Star } from 'lucide-react';

export default function BadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      const badges = [
        {
          id: 1,
          name: 'Verificado',
          icon: '✅',
          description: 'Perfil verificado e autenticado',
          earned: true,
          earnedDate: '2024-06-15',
          color: 'bg-green-100 text-green-800',
        },
        {
          id: 2,
          name: 'Top Performer',
          icon: '🏆',
          description: 'Top 10% freelancers com melhor avaliação',
          earned: true,
          earnedDate: '2024-07-20',
          color: 'bg-yellow-100 text-yellow-800',
        },
        {
          id: 3,
          name: 'Resposta Rápida',
          icon: '⚡',
          description: 'Tempo médio de resposta < 2 horas',
          earned: true,
          earnedDate: '2024-05-10',
          color: 'bg-blue-100 text-blue-800',
        },
        {
          id: 4,
          name: 'Qualidade Premium',
          icon: '💎',
          description: 'Avaliação média ≥ 4.8 estrelas',
          earned: false,
          requirement: 'Avaliação média de 4.8+ necessária',
          color: 'bg-purple-100 text-purple-800',
        },
        {
          id: 5,
          name: 'Tendência',
          icon: '🔥',
          description: 'Skill em alta demanda e crescimento',
          earned: false,
          requirement: '50+ propostas necessárias',
          color: 'bg-red-100 text-red-800',
        },
      ];

      setBadges(badges);
      setLoading(false);
    };

    loadBadges();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Badges</h1>
        <p className="text-gray-600">Ganhe badges e destaque seu perfil</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Badges Desbloqueados</p>
          <p className="text-3xl font-bold">{earned.length}/5</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Avaliação Média</p>
          <p className="text-3xl font-bold">4.9★</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Tempo de Resposta</p>
          <p className="text-3xl font-bold">1.5h</p>
        </div>
      </div>

      {/* Earned Badges */}
      {earned.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Seus Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {earned.map((badge) => (
              <div key={badge.id} className={`${badge.color} border-2 rounded-lg p-6 text-center transform hover:scale-105 transition`}>
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                <p className="text-sm opacity-75 mb-3">{badge.description}</p>
                <p className="text-xs opacity-50">Desbloqueado em {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Próximos Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locked.map((badge) => (
              <div key={badge.id} className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 text-center opacity-60">
                <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                <h3 className="font-bold text-lg mb-1 text-gray-700">{badge.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full inline-block">
                  {badge.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">💡 Como ganhar badges</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ <strong>Verificado:</strong> Complete seu perfil e valide identidade</li>
          <li>✓ <strong>Top Performer:</strong> Mantenha avaliação entre os top 10%</li>
          <li>✓ <strong>Resposta Rápida:</strong> Responda propostas em menos de 2 horas</li>
          <li>✓ <strong>Qualidade Premium:</strong> Alcance avaliação média de 4.8+</li>
          <li>✓ <strong>Tendência:</strong> Trabalhe com skills em alta demanda</li>
        </ul>
      </div>
    </div>
  );
}
