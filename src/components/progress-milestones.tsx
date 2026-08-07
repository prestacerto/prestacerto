"use client";

import { Award, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Milestone {
  value: number;
  label: string;
  reward?: string;
  icon: string;
}

interface ProgressMilestonesProps {
  title: string;
  current: number;
  milestones: Milestone[];
}

export function ProgressMilestones({
  title,
  current,
  milestones,
}: ProgressMilestonesProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.value - b.value);
  const nextMilestone = sortedMilestones.find(m => m.value > current);
  const lastCompletedMilestone = sortedMilestones.filter(m => m.value <= current).pop();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {current}
            </span>
            {nextMilestone && (
              <span className="text-sm text-slate-500">
                Faltam {nextMilestone.value - current} para {nextMilestone.label}
              </span>
            )}
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((current / (nextMilestone?.value || sortedMilestones[sortedMilestones.length - 1]?.value || 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          {sortedMilestones.map(milestone => {
            const isCompleted = current >= milestone.value;
            const isNext = milestone === nextMilestone;

            return (
              <div
                key={milestone.value}
                className={`rounded-lg p-3 border transition-all ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : isNext
                      ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-xl">{milestone.icon}</div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isCompleted
                          ? "text-green-900 dark:text-green-200"
                          : isNext
                            ? "text-blue-900 dark:text-blue-200"
                            : "text-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {milestone.label}
                    </p>
                    {milestone.reward && (
                      <p className="text-xs text-slate-500">
                        Desbloqueie: {milestone.reward}
                      </p>
                    )}
                  </div>

                  {isCompleted ? (
                    <Award className="size-5 text-green-600" />
                  ) : isNext ? (
                    <Unlock className="size-5 text-blue-600" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
