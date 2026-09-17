'use client';

import { useEffect, useState } from 'react';
import { Flame, Gift, TrendingUp } from 'lucide-react';

interface StreakData {
  current_streak: number;
  max_streak: number;
  bonus_balance: number;
  days_until_bonus: number;
  next_bonus_amount: number;
}

export function StreakWidget() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await fetch('/api/user/streak');
      const data = await response.json();
      setStreak(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-700/30 rounded-lg" />;
  }

  if (!streak) {
    return null;
  }

  const isAtBonus = streak.current_streak % 7 === 0;
  const fireEmojis = Array(Math.min(streak.current_streak, 10))
    .fill('🔥')
    .join('');

  return (
    <div className={`rounded-lg p-6 mb-6 transition-all ${
      isAtBonus
        ? 'bg-gradient-to-r from-emerald-600/30 to-slate-800/30 border-2 border-emerald-600/50'
        : 'bg-gradient-to-r from-orange-600/30 to-slate-800/30 border border-orange-600/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
          <h3 className="text-xl font-bold text-white">Seu Streak</h3>
        </div>
        {streak.current_streak > streak.max_streak && (
          <span className="bg-emerald-600/20 border border-emerald-600/50 rounded-full px-3 py-1 text-xs text-emerald-400 font-bold">
            🏆 Novo recorde!
          </span>
        )}
      </div>

      {/* Big Number */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black text-orange-400">
            {streak.current_streak}
          </span>
          <span className="text-2xl text-orange-300">{fireEmojis}</span>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          dias consecutivos • Recorde: {streak.max_streak} dias
        </p>
      </div>

      {/* Bonus Progress */}
      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-300 text-sm font-semibold">Próximo Bônus</p>
          <p className="text-slate-300 text-sm">
            {streak.days_until_bonus} dias
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-600/50 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
            style={{
              width: `${((7 - streak.days_until_bonus) / 7) * 100}%`
            }}
          />
        </div>

        <p className="text-slate-400 text-xs">
          🎁 Ganhe R$ {(streak.next_bonus_amount / 100).toFixed(2)}
          {isAtBonus && <span className="text-emerald-400 ml-2">✓ DESBLOQUEADO!</span>}
        </p>
      </div>

      {/* Current Balance */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-emerald-600/20 border border-emerald-600/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-400 text-xs font-semibold">Créditos Ganhos</p>
          </div>
          <p className="text-emerald-300 font-bold">
            R$ {(streak.bonus_balance / 100).toFixed(2)}
          </p>
        </div>

        <div className="flex-1 bg-blue-600/20 border border-blue-600/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <p className="text-blue-400 text-xs font-semibold">Histórico</p>
          </div>
          <p className="text-blue-300 font-bold">
            Max: {streak.max_streak}🔥
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3">
        <p className="text-red-300 text-xs font-semibold">
          ⚠️ Acesse a plataforma hoje para não quebrar seu streak!
        </p>
      </div>

      {/* Bonus Achievement */}
      {isAtBonus && (
        <div className="mt-4 bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border border-emerald-600/50 rounded-lg p-4 animate-pulse">
          <p className="text-emerald-300 font-bold text-center mb-2">
            🎉 BÔNUS DESBLOQUEADO!
          </p>
          <p className="text-emerald-200 text-center text-sm">
            Você ganhou R$ {(streak.next_bonus_amount / 100).toFixed(2)} de crédito
          </p>
          <button className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-sm transition">
            ✓ Reivindicar Crédito
          </button>
        </div>
      )}
    </div>
  );
}
