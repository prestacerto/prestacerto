"use client";

import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RevenueData {
  monthlyEarnings: number;
  yearlyEarnings: number;
  mrrActiveSubscriptions: number;
  projectedMonthlyTotal: number;
  referralEarnings: number;
  featuredProposalsEarnings: number;
  skillAssessmentsEarnings: number;
  partnersEarnings: number;
}

interface RevenueOverviewProps {
  data: RevenueData;
}

export function RevenueOverview({ data }: RevenueOverviewProps) {
  const totalStreams = [
    { name: "Referrals", value: data.referralEarnings, percent: 25 },
    { name: "Featured", value: data.featuredProposalsEarnings, percent: 20 },
    { name: "Assessments", value: data.skillAssessmentsEarnings, percent: 30 },
    { name: "Partners", value: data.partnersEarnings, percent: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          💰 Faturamento
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Acompanhe seus ganhos em tempo real
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  ESTE MÊS
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  R$ {data.monthlyEarnings.toLocaleString("pt-BR")}
                </p>
              </div>
              <Calendar className="size-8 text-blue-600" />
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  ESTE ANO
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  R$ {data.yearlyEarnings.toLocaleString("pt-BR")}
                </p>
              </div>
              <TrendingUp className="size-8 text-green-600" />
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  MRR (Subscriptions)
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  R$ {data.mrrActiveSubscriptions.toLocaleString("pt-BR")}
                </p>
              </div>
              <DollarSign className="size-8 text-purple-600" />
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  PROJEÇÃO
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  R$ {data.projectedMonthlyTotal.toLocaleString("pt-BR")}
                </p>
              </div>
              <Target className="size-8 text-orange-600" />
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* Revenue streams breakdown */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-900 dark:text-white">
            Fontes de Renda
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalStreams.map(stream => (
            <div key={stream.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {stream.name}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  R$ {stream.value.toLocaleString("pt-BR")} ({stream.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${stream.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-6">
          <p className="text-sm text-green-900 dark:text-green-200">
            <span className="font-bold">💡 Insight:</span> Seus ganhos aumentaram {((data.monthlyEarnings / (data.yearlyEarnings / 12)) - 1) * 100 > 0 ? "🔥" : "📉"} em relação à média anual.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
