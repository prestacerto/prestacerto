"use client";

import { useState, useEffect } from "react";
import { Check, Lock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DAILY_CHALLENGES, type ChallengeType } from "@/lib/daily-challenges";

interface ChallengeProg {
  type: ChallengeType;
  progress: number;
  completed: boolean;
  rewardClaimed: boolean;
}

interface DailyChallengesProps {
  userProgress: ChallengeProg[];
  onClaimReward?: (type: ChallengeType) => void;
}

export function DailyChallenges({ userProgress, onClaimReward }: DailyChallengesProps) {
  const [selected, setSelected] = useState<ChallengeType | null>(null);

  const todaysDate = new Date().toLocaleDateString("pt-BR");
  const completedCount = userProgress.filter(p => p.completed).length;
  const totalReward = userProgress
    .filter(p => p.completed && !p.rewardClaimed)
    .reduce((sum, p) => sum + (DAILY_CHALLENGES[p.type].reward.bonus_credits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header com streak */}
      <div className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">🔥 Desafios de Hoje</h2>
            <p className="text-sm opacity-90">{todaysDate}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completedCount}/5</div>
            <p className="text-xs opacity-90">concluídos</p>
          </div>
        </div>
      </div>

      {/* Reward summary */}
      {totalReward > 0 && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4">
          <p className="text-sm font-bold text-green-900 dark:text-green-200">
            💰 {totalReward} créditos prontos pra coletar!
          </p>
        </div>
      )}

      {/* Challenges grid */}
      <div className="grid gap-3">
        {Object.values(DAILY_CHALLENGES).map(challenge => {
          const prog = userProgress.find(p => p.type === challenge.type);
          const isCompleted = prog?.completed || false;
          const isRewardClaimed = prog?.rewardClaimed || false;
          const progress = prog?.progress || 0;
          const percent = (progress / challenge.target) * 100;

          return (
            <Card
              key={challenge.id}
              className={`cursor-pointer transition-all ${
                isCompleted
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "hover:border-slate-400"
              }`}
              onClick={() => setSelected(challenge.type)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{challenge.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-500">
                          {progress}/{challenge.target}
                        </span>
                        <span className="text-xs font-bold text-orange-600">
                          {Math.round(percent)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status icon */}
                  <div className="text-right">
                    {isCompleted && (
                      <div className="flex flex-col items-center gap-1">
                        <Check className="size-5 text-green-600" />
                        {isRewardClaimed ? (
                          <span className="text-xs font-bold text-green-600">Coletado</span>
                        ) : (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onClaimReward?.(challenge.type);
                            }}
                            className="text-xs font-bold px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          >
                            Coletar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reward info */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs">
                  <Zap className="size-3 text-orange-600" />
                  <span className="font-bold">
                    +{challenge.reward.bonus_credits} créditos
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">+{challenge.reward.xp} XP</span>
                  {challenge.reward.badge && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500">Badge desbloqueado</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tip */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
        <p className="text-xs text-blue-900 dark:text-blue-200">
          💡 Complete todos os desafios diários para ganhar um bônus extra!
        </p>
      </div>
    </div>
  );
}
