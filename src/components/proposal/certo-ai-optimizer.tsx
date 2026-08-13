"use client";

import { useState } from "react";
import { Wand2, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OptimizerResult {
  original: string;
  optimized: string;
  score: number;
  issues: string[];
  suggestions: string[];
  estimatedWinRate: number;
}

export function CertoAIOptimizer() {
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizerResult | null>(null);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    if (!proposal.trim()) {
      setError("Escreva uma proposta primeiro");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response = await fetch("/api/ai/optimize-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimize",
          proposal,
        }),
      });

      if (!response.ok) {
        response = await fetch("/api/ai/optimize-proposal-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "optimize",
            proposal,
          }),
        });
      }

      if (!response.ok) throw new Error("Falha ao otimizar");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Erro ao conectar com Certo AI");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOptimized = () => {
    if (result?.optimized) {
      navigator.clipboard.writeText(result.optimized);
      alert("✅ Proposta otimizada copiada!");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="text-blue-600" size={20} />
            <h3 className="font-bold text-lg">✨ Certo AI — Otimizador de Propostas</h3>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Deixa a IA reescrever sua proposta para soar mais profissional e aumentar suas chances de ganhar.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Sua Proposta</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Cole sua proposta aqui... (máximo 500 caracteres)"
              maxLength={500}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {proposal.length}/500 caracteres
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleOptimize}
            disabled={loading || !proposal.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "🔄 Otimizando..." : "✨ Otimizar com IA"}
          </button>

          {result && (
            <div className="mt-6 space-y-4">
              {/* Resultado */}
              <div>
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Proposta Otimizada
                </h4>
                <div className="bg-white p-4 border-l-4 border-green-500 rounded text-sm">
                  {result.optimized}
                </div>
                <button
                  onClick={handleCopyOptimized}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  📋 Copiar proposta otimizada
                </button>
              </div>

              {/* Score */}
              <div className="bg-white p-4 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <TrendingUp size={16} className="text-purple-600" />
                    Taxa de Ganho Estimada
                  </h4>
                  <span className="text-2xl font-bold text-purple-600">{result.estimatedWinRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all"
                    style={{ width: `${result.estimatedWinRate}%` }}
                  />
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-600" />
                    Pontos de Melhoria
                  </h4>
                  <ul className="space-y-1">
                    {result.issues.map((issue, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-orange-600">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2">💡 Sugestões</h4>
                  <ul className="space-y-1">
                    {result.suggestions.map((sug, i) => (
                      <li key={i} className="text-sm text-green-700 flex gap-2">
                        <span className="text-green-600">✓</span>
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <p>
          💰 <strong>Certo AI Premium:</strong> R$ 4,90 por otimização | Teste grátis: 3/mês
        </p>
      </div>
    </div>
  );
}
