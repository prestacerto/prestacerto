'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ChevronRight } from 'lucide-react';

export function ProposalComparison() {
  const [proposal1, setProposal1] = useState('');
  const [proposal2, setProposal2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    if (!proposal1.trim() || !proposal2.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/optimize-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'compare',
          proposal: proposal1,
          proposal2: proposal2,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-base">Proposta 1</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={proposal1}
              onChange={(e) => setProposal1(e.target.value)}
              placeholder="Cole a primeira proposta..."
              className="w-full h-40 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-base">Proposta 2</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={proposal2}
              onChange={(e) => setProposal2(e.target.value)}
              placeholder="Cole a segunda proposta..."
              className="w-full h-40 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </CardContent>
        </Card>
      </div>

      <button
        onClick={handleCompare}
        disabled={!proposal1.trim() || !proposal2.trim() || loading}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        {loading ? 'Comparando...' : 'Comparar Propostas'}
      </button>

      {/* Comparison Results */}
      {result && (
        <div className="space-y-4">
          {/* Winner Card */}
          <Card className={`border-2 ${result.winner === 1 ? 'border-green-500 bg-green-900/10' : 'border-slate-700'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Resultado da Comparação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">{result.reason}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${result.winner === 1 ? 'border-green-500 bg-green-900/20' : 'border-slate-600 bg-slate-700/30'}`}>
                  <p className="text-xs text-slate-400 mb-1">Proposta 1</p>
                  <p className="text-3xl font-bold text-green-400">{result.proposal1_score}</p>
                  <p className="text-xs text-slate-500">/ 100</p>
                </div>

                <div className={`p-4 rounded-lg border ${result.winner === 2 ? 'border-green-500 bg-green-900/20' : 'border-slate-600 bg-slate-700/30'}`}>
                  <p className="text-xs text-slate-400 mb-1">Proposta 2</p>
                  <p className="text-3xl font-bold text-green-400">{result.proposal2_score}</p>
                  <p className="text-xs text-slate-500">/ 100</p>
                </div>
              </div>

              {result.winner && (
                <div className={`p-3 rounded-lg ${result.winner === 1 ? 'bg-green-900/30 border border-green-500/50' : 'bg-green-900/30 border border-green-500/50'}`}>
                  <p className="text-sm text-green-300 font-semibold">
                    ✨ Proposta {result.winner} é melhor!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          {result.comparison && (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-base">Análise Detalhada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.comparison).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-300 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
