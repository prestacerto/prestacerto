"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface ComparisonResult {
  winner: 1 | 2;
  reasoning: string;
  scores: { proposal1: number; proposal2: number };
}

export function ProposalComparison() {
  const [proposal1, setProposal1] = useState("");
  const [proposal2, setProposal2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!proposal1.trim() || !proposal2.trim()) {
      setError("Escreva ambas as propostas para comparar");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/optimize-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "compare",
          proposal1,
          proposal2,
        }),
      });

      if (!response.ok) throw new Error("Falha ao comparar");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Erro ao conectar com Certo AI");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4">⚖️ Comparar Propostas</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Proposta 1</label>
              <textarea
                value={proposal1}
                onChange={(e) => setProposal1(e.target.value)}
                placeholder="Cole sua primeira proposta..."
                maxLength={500}
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{proposal1.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Proposta 2</label>
              <textarea
                value={proposal2}
                onChange={(e) => setProposal2(e.target.value)}
                placeholder="Cole sua segunda proposta..."
                maxLength={500}
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{proposal2.length}/500</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={loading || !proposal1.trim() || !proposal2.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "🔄 Comparando..." : "⚖️ Comparar com IA"}
          </button>

          {result && (
            <div className="mt-6 space-y-4">
              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${result.winner === 1 ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                  <p className="text-sm text-gray-600 mb-1">Proposta 1</p>
                  <p className="text-4xl font-bold text-gray-900">{result.scores.proposal1}%</p>
                  {result.winner === 1 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                      <CheckCircle size={16} />
                      Melhor!
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${result.winner === 2 ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                  <p className="text-sm text-gray-600 mb-1">Proposta 2</p>
                  <p className="text-4xl font-bold text-gray-900">{result.scores.proposal2}%</p>
                  {result.winner === 2 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                      <CheckCircle size={16} />
                      Melhor!
                    </div>
                  )}
                </div>
              </div>

              {/* Reasoning */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-bold text-sm mb-2">Por que a Proposta {result.winner} ganhou:</h4>
                <p className="text-sm text-gray-700">{result.reasoning}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
