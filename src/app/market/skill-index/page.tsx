'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface SkillDemand {
  skill: string;
  demand: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  ranking: number;
}

export default function SkillIndexPage() {
  const [skills, setSkills] = useState<SkillDemand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await fetch('/api/market/skill-index');
        const data = await response.json();
        setSkills(data.skills || []);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndex();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Índice de Demanda por Skill</h1>
          <p className="text-slate-400">Veja quais skills estão em alta no mercado esta semana</p>
        </div>

        <div className="space-y-3">
          {skills.map((skill, idx) => (
            <div
              key={skill.skill}
              className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-slate-400 w-8 text-right">
                    #{idx + 1}
                  </div>

                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">{skill.skill}</p>
                    <p className="text-slate-400 text-sm">{skill.demand} projetos esta semana</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    {skill.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : skill.trend === 'down' ? (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    ) : (
                      <Zap className="w-5 h-5 text-amber-400" />
                    )}
                    <span
                      className={
                        skill.change > 0
                          ? 'text-emerald-400 font-bold'
                          : skill.change < 0
                          ? 'text-red-400 font-bold'
                          : 'text-amber-400 font-bold'
                      }
                    >
                      {skill.change > 0 ? '+' : ''}{skill.change}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-24 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min((skill.demand / skills[0].demand) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-600/10 border border-blue-600/30 rounded-lg p-6 text-center">
          <p className="text-blue-300 mb-4">
            💎 Esse índice é exclusivo de usuários premium. Dados atualizados semanalmente.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
            Upgrade para Premium
          </button>
        </div>
      </div>
    </div>
  );
}
