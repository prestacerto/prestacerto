"use client";

import { useState } from "react";
import { Lock, Zap, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BADGES, BadgeType } from "@/lib/badges";

interface BadgesSystemProps {
  userBadges: BadgeType[];
  stats: {
    completedProjects: number;
    avgResponseTime: number;
    rating: number;
    ratingCount: number;
    isVerifiedSenior: boolean;
    consecutiveDaysActive: number;
  };
}

export function BadgesSystem({ userBadges, stats }: BadgesSystemProps) {
  const [showPremium, setShowPremium] = useState(false);

  // Calcular progresso pra badges
  const progress = {
    projects_100: { current: stats.completedProjects, target: 100, percent: (stats.completedProjects / 100) * 100 },
    fast_response: { current: stats.avgResponseTime, target: 4, percent: Math.max(0, (1 - stats.avgResponseTime / 4) * 100) },
    five_stars: { current: stats.rating, target: 5, percent: (stats.rating / 5) * 100 },
    consistency_30: { current: stats.consecutiveDaysActive, target: 30, percent: (stats.consecutiveDaysActive / 30) * 100 },
  };

  const allBadges: (BadgeType | null)[] = ["projects_100", "fast_response", "five_stars", "verified_senior", "consistency_30"];
  const lockedBadges = allBadges.filter((b) => b && !userBadges.includes(b)) as BadgeType[];

  return (
    <div className="space-y-6">
      {/* Badges Desbloqueadas */}
      {userBadges.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-bold flex items-center gap-2">
              <Trophy className="size-5 text-yellow-600" />
              Suas Conquistas ({userBadges.length})
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userBadges.map((badge) => {
                const data = BADGES[badge];
                return (
                  <div
                    key={badge}
                    className={`rounded-lg bg-gradient-to-r ${data.color} p-4 text-white shadow-lg`}
                  >
                    <div className="text-3xl mb-2">{data.icon}</div>
                    <p className="font-bold text-sm">{data.label}</p>
                    <p className="text-xs opacity-90 mt-1">{data.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges Próximos de Desbloquear */}
      <Card>
        <CardHeader>
          <h2 className="font-bold flex items-center gap-2">
            <Zap className="size-5 text-amber-600" />
            Quase lá! ({lockedBadges.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">Progresso pra desbloquear novas badges</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {progress.projects_100.percent < 100 && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">🏆 100 Projetos</span>
                <span className="text-xs text-slate-500">{Math.round(progress.projects_100.percent)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress.projects_100.percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{progress.projects_100.current}/100 projetos completos</p>
            </div>
          )}

          {progress.consistency_30.percent < 100 && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">🔥 30 Dias Consecutivos</span>
                <span className="text-xs text-slate-500">{Math.round(progress.consistency_30.percent)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress.consistency_30.percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{progress.consistency_30.current}/30 dias ativos</p>
            </div>
          )}

          {progress.fast_response.percent < 100 && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">⚡ Responda Rápido</span>
                <span className="text-xs text-slate-500">{Math.round(progress.fast_response.percent)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress.fast_response.percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Resposta em {progress.fast_response.current.toFixed(1)}h (meta: {`<`}4h)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Badges */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardHeader>
          <button
            onClick={() => setShowPremium(!showPremium)}
            className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200"
          >
            <Lock className="size-5" />
            Badges Premium
          </button>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Versões premium com mais destaque</p>
        </CardHeader>
        {showPremium && (
          <CardContent className="space-y-3 border-t border-purple-200 dark:border-purple-800 pt-4">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm">✨ Featured Badge</p>
                <p className="text-xs text-slate-500 mt-1">Seu badge aparece em destaque no perfil</p>
              </div>
              <button className="px-3 py-1 rounded bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">
                R$ 9/mês
              </button>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-3 flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm">💎 Badge Permanente</p>
                <p className="text-xs text-slate-500 mt-1">Keep badges even after period ends</p>
              </div>
              <button className="px-3 py-1 rounded bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">
                R$ 19
              </button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
