'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Zap, TrendingUp } from 'lucide-react';

interface Reward {
  id: string;
  reward_type: string;
  amount: number;
  description: string;
  claimed_at: string | null;
  expires_at: string;
}

export function SurpriseRewardsWidget() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/user/rewards');
      const data = await response.json();
      setRewards(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      await fetch(`/api/user/rewards/${rewardId}/claim`, { method: 'POST' });
      setClaimed(true);
      setTimeout(() => fetchRewards(), 500);
    } catch (error) {
      console.error('Erro ao reivindicar:', error);
    }
  };

  const unclaimedRewards = rewards.filter((r) => !r.claimed_at);
  const totalValue = unclaimedRewards.reduce((sum, r) => sum + (r.amount || 0), 0);

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-700/30 rounded-lg" />;
  }

  const getRewardEmoji = (type: string) => {
    switch (type) {
      case 'bonus_credit':
        return '💰';
      case 'streak_multiplier':
        return '🔥';
      case 'project_boost':
        return '🚀';
      case 'featured_hour':
        return '⭐';
      default:
        return '🎁';
    }
  };

  return (
    <Card className={`bg-gradient-to-r border-2 transition-all ${
      claimed
        ? 'from-green-900/30 to-emerald-900/30 border-green-500/50'
        : 'from-yellow-900/30 to-orange-900/30 border-yellow-500/50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-400 animate-bounce" />
          🎁 Recompensas Surpresa
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          {unclaimedRewards.length > 0
            ? `Você tem ${unclaimedRewards.length} recompensa${unclaimedRewards.length > 1 ? 's' : ''} esperando!`
            : 'Nenhuma recompensa no momento'}
        </p>
      </CardHeader>

      <CardContent>
        {unclaimedRewards.length > 0 ? (
          <div className="space-y-3">
            {unclaimedRewards.slice(0, 3).map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getRewardEmoji(reward.reward_type)}</span>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {reward.reward_type === 'bonus_credit'
                        ? `R$ ${(reward.amount / 100).toFixed(2)} em crédito`
                        : reward.description}
                    </p>
                    <p className="text-xs text-slate-500">Expira em 7 dias</p>
                  </div>
                </div>
                <button
                  onClick={() => claimReward(reward.id)}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded font-semibold transition"
                >
                  Reivindicar
                </button>
              </div>
            ))}

            <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <p className="text-sm font-bold text-yellow-300">
                  Total disponível: R$ {(totalValue / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-400 mb-2">Nenhuma recompensa agora</p>
            <p className="text-xs text-slate-500">
              💡 Continue ativo para ganhar mais recompensas surpresa!
            </p>
          </div>
        )}

        {claimed && (
          <div className="mt-4 p-3 bg-green-600/20 border border-green-600/50 rounded-lg">
            <p className="text-sm text-green-300 font-semibold">
              ✅ Recompensa reivindicada com sucesso!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
