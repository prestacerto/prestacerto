"use client";

import { TrendingUp, TrendingDown, Lock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WINNING_PATTERNS, LOSING_PATTERNS } from "@/lib/proposal-insights";

interface InsightsDashboardProps {
  isPro?: boolean;
}

export function ProposalInsightsDashboard({ isPro = false }: InsightsDashboardProps) {
  const insights = [
    { metric: 'Taxa de aceitação', value: 42, unit: '%', trend: 12 },
    { metric: 'Tempo de resposta', value: 3.2, unit: 'h', trend: -15 },
    { metric: 'Palavras ideais', value: 150, unit: 'palavras', trend: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Seu Desempenho */}
      <Card>
        <CardHeader>
          <h2 className="font-bold">📊 Seu Desempenho em Propostas</h2>
          <p className="text-xs text-slate-500 mt-1">Comparado com freelancers da sua categoria</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight) => (
              <div key={insight.metric} className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">{insight.metric}</p>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {insight.value}
                  </span>
                  <span className="text-xs text-slate-500">{insight.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {insight.trend > 0 ? (
                    <>
                      <TrendingUp className="size-3 text-green-600" />
                      <span className="text-green-600 font-bold">+{insight.trend}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="size-3 text-red-600" />
                      <span className="text-red-600 font-bold">{insight.trend}%</span>
                    </>
                  )}
                  <span className="text-slate-500">vs semana passada</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Padrões Vencedores */}
      <Card>
        <CardHeader>
          <h2 className="font-bold">🏆 Padrões que VENCEM (dados exclusivos PrestaCerto)</h2>
          <p className="text-xs text-slate-500 mt-1">Análise de 1.000+ propostas aceitas</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {WINNING_PATTERNS.map((pattern, idx) => (
              <div key={idx} className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-green-900 dark:text-green-200">{pattern.name}</p>
                    <p className="text-sm text-green-800 dark:text-green-300 mt-1">{pattern.description}</p>
                    {pattern.examples.length > 0 && (
                      <div className="mt-2 text-xs text-green-700 dark:text-green-400 bg-white dark:bg-slate-900 rounded p-2 space-y-1">
                        {pattern.examples.map((ex, i) => (
                          <p key={i}>"<em>{ex}</em>"</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-green-600">{pattern.winRate}%</div>
                    <p className="text-xs text-green-600">taxa de aceitação</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Padrões Perdedores */}
      <Card>
        <CardHeader>
          <h2 className="font-bold">❌ Evite Esses Padrões</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LOSING_PATTERNS.map((pattern, idx) => (
              <div key={idx} className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">❌ {pattern}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pro Feature: Copiloto */}
      {!isPro && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lock className="size-5 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 dark:text-blue-200">🤖 Copiloto de Propostas (PRO)</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  IA analisa seu projeto e gera proposta otimizada usando padrões vencedores
                </p>
                <button className="mt-3 px-4 py-2 rounded bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">
                  Upgrade pra Pro
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
