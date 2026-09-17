'use client';

import { useEffect, useState } from 'react';

interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  badges: string[];
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
}

export function GamificationDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/gamification/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (stats?.referralCode) {
      const link = `${window.location.origin}?ref=${stats.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!stats) return <div>Erro ao carregar estatísticas</div>;

  const nextLevel = stats.level + 1;
  const xpForNext = nextLevel * 1000;
  const progress = (stats.xp % 1000) / 10;

  return (
    <div className="space-y-6">
      {/* XP & Level */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
          <p className="text-sm opacity-90">Nível</p>
          <p className="text-4xl font-bold">{stats.level}</p>
          <p className="mt-2 text-xs opacity-75">Próximo: {xpForNext} XP</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
          <p className="text-sm opacity-90">XP Atual</p>
          <p className="text-4xl font-bold">{stats.xp.toLocaleString()}</p>
          <div className="mt-2 h-2 w-full rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
          <p className="text-sm opacity-90">Streak 🔥</p>
          <p className="text-4xl font-bold">{stats.streakDays}</p>
          <p className="mt-2 text-xs opacity-75">dias consecutivos</p>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 font-bold">Badges Desbloqueadas</h3>
        <div className="flex flex-wrap gap-2">
          {stats.badges.length > 0 ? (
            stats.badges.map((badge, i) => (
              <span key={i} className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                {badge}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Continue ativo pra desbloquear badges!</p>
          )}
        </div>
      </div>

      {/* Referral Program */}
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6 dark:border-green-600 dark:bg-green-900/20">
        <h3 className="mb-4 font-bold text-green-900 dark:text-green-200">💰 Programa de Indicação</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Amigos Indicados</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{stats.referralCount}</p>
          </div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300">Ganhos (Revenue Share)</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">
              R$ {(stats.referralEarnings / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-green-900 dark:text-green-200">
            Seu link de indicação:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={`${window.location.origin}?ref=${stats.referralCode}`}
              readOnly
              className="flex-1 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm dark:border-green-600 dark:bg-gray-800"
            />
            <button
              onClick={copyReferralLink}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="rounded-lg bg-green-100 p-3 text-sm dark:bg-green-900/30">
            <p className="font-semibold text-green-900 dark:text-green-200">Como funciona:</p>
            <ul className="mt-2 space-y-1 text-green-800 dark:text-green-300">
              <li>✓ Compartilhe seu link</li>
              <li>✓ Amigo se cadastra e faz primeira transação</li>
              <li>✓ Você ganha 10% do faturamento dele PARA SEMPRE</li>
              <li>✓ Ele também ganha R$ 100 de crédito grátis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Earn XP */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 font-bold">Como ganhar XP?</h3>
        <div className="space-y-2 text-sm">
          <p>✨ <strong>+10 XP</strong> - Responder proposta em &lt; 1h</p>
          <p>✨ <strong>+25 XP</strong> - Completar projeto</p>
          <p>✨ <strong>+50 XP</strong> - 5 estrelas de avaliação</p>
          <p>✨ <strong>+100 XP</strong> - Indicar amigo que vira ativo</p>
          <p>🔥 <strong>+200 XP</strong> - Manter streak de 7 dias</p>
        </div>
      </div>
    </div>
  );
}
