"use client";

import { Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialProofProps {
  contractsThisWeek?: number;
  viewsThisWeek?: number;
  rating?: number;
  ratingCount?: number;
}

export function SocialProofCard({
  contractsThisWeek = 0,
  viewsThisWeek = 0,
  rating = 0,
  ratingCount = 0,
}: SocialProofProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">💪 Social Proof</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {/* Contratos essa semana */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Award className="size-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{contractsThisWeek}</p>
                <p className="text-xs text-green-600">contratos essa semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualizações */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="size-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{viewsThisWeek}</p>
                <p className="text-xs text-blue-600">visitaram seu perfil</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-amber-700">
                  {rating ? rating.toFixed(1) : "—"}
                </p>
                <p className="text-xs text-amber-600">
                  {ratingCount} avaliações
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight */}
      {contractsThisWeek > 0 && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3">
          <p className="text-sm text-green-900 dark:text-green-200">
            🎉 Você é mais rápido que 78% dos freelancers na sua categoria!
          </p>
        </div>
      )}
    </div>
  );
}
