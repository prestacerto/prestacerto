/**
 * AI Insights Widget - Example component
 * Shows how to use the OpenAI insights API
 */

"use client";

import { useState } from "react";
import { Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { InsightsOutput } from "@/lib/openai-service";

interface AIInsightsWidgetProps {
  userId: string;
  skills: string[];
  experience: number;
}

export function AIInsightsWidget({
  userId,
  skills,
  experience,
}: AIInsightsWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightsOutput | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          skills,
          experience,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate insights");
      }

      const result = await response.json();
      setInsights(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Insights error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="size-5" />
            Certo Insights
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Market intelligence com trends de skills
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!insights ? (
            <button
              onClick={generateInsights}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Gerando..." : "Gerar Insights"}
            </button>
          ) : (
            <div className="space-y-4">
              {/* Oportunidade */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Opportunity Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {insights.opportunityScore}/100
                </p>
              </div>

              {/* Análise do Mercado */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Market Analysis</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {insights.marketAnalysis}
                </p>
              </div>

              {/* Skills em Alta Demanda */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Top Trending Skills</h4>
                <div className="space-y-2">
                  {insights.trendingSkills.slice(0, 3).map((skill) => (
                    <div
                      key={skill.skill}
                      className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{skill.skill}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            skill.demand === "high"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : skill.demand === "medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {skill.demand === "high"
                            ? "🔥 Alta"
                            : skill.demand === "medium"
                              ? "📈 Média"
                              : "📉 Baixa"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <p className="text-slate-500">Taxa Média</p>
                          <p className="font-medium">R$ {skill.avgRate.toFixed(2)}/h</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Recomendado</p>
                          <p className="font-medium">
                            R$ {skill.recommendedRate.toFixed(2)}/h
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">
                          +{skill.growth}%
                        </span>
                        <span className="text-xs text-slate-500">growth this month</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendações */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-slate-600 dark:text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setInsights(null)}
                className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium"
              >
                Generate New Insights
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
              <AlertCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
