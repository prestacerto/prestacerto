'use client';

import { useEffect, useState } from 'react';
import { Zap, Flame, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface DailyMatch {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  skills_required: string[];
  match_score: number;
  proposal_count: number;
  urgency_level: 'high' | 'medium' | 'low';
  client_name: string;
}

export function DailyMatchWidget() {
  const [dailyMatch, setDailyMatch] = useState<DailyMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchDailyMatch = async () => {
      try {
        const response = await fetch('/api/projects/daily-match');
        const data = await response.json();

        if (data.success && data.daily_match) {
          setDailyMatch(data.daily_match);
        }
      } catch (error) {
        console.error('Erro ao carregar match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMatch();
    // Atualizar uma vez por dia (midnight)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(fetchDailyMatch, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, []);

  if (loading || dismissed || !dailyMatch) {
    return null;
  }

  const urgencyEmoji = dailyMatch.urgency_level === 'high' ? '🔥' : '⚡';
  const urgencyText = dailyMatch.urgency_level === 'high'
    ? `${dailyMatch.proposal_count}+ propostas já enviadas - responda AGORA!`
    : `${dailyMatch.proposal_count} propostas enviadas`;

  return (
    <div className="bg-gradient-to-r from-amber-600/30 to-red-600/20 border-2 border-amber-500/50 rounded-lg p-6 mb-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {dailyMatch.urgency_level === 'high' ? (
              <Flame className="w-6 h-6 text-red-400 animate-pulse" />
            ) : (
              <Zap className="w-6 h-6 text-amber-400" />
            )}
            <div>
              <h3 className="text-lg font-bold text-white">Projeto do Dia</h3>
              <p className="text-amber-200 text-xs">Compatibilidade perfeita para você</p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Project Info */}
        <div className="mb-4">
          <h4 className="text-white font-bold text-lg mb-2">{dailyMatch.title}</h4>
          <p className="text-slate-200 text-sm mb-3 line-clamp-2">{dailyMatch.description}</p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600/30 border border-emerald-600/50 rounded-full px-4 py-1">
                <span className="text-emerald-300 font-bold text-sm">
                  {dailyMatch.match_score}% compatibilidade
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                R$ {(dailyMatch.budget / 100).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {dailyMatch.skills_required.map(skill => (
              <span
                key={skill}
                className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Urgency Banner */}
        <div className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-3 mb-4 flex items-start gap-3">
          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 font-semibold text-sm">
              {urgencyEmoji} {urgencyText}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Envie sua proposta nos próximos minutos para ter chance de ganhar
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/projects/${dailyMatch.id}`}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
          >
            Ver Projeto
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/projects/${dailyMatch.id}/proposal`}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition"
          >
            Enviar Proposta
          </Link>
        </div>
      </div>
    </div>
  );
}
