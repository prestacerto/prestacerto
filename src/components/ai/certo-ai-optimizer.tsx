'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Copy, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface OptimizationResult {
  optimized: string;
  score: number;
  win_rate: number;
  issues: string[];
  suggestions: string[];
  analysis: {
    strengths: string[];
    weaknesses: string[];
    market_comparison: string;
  };
}

export function CertoAIOptimizer() {
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState({ plan_type: 'free', optimizations_remaining: 3 });

  const handleOptimize = async () => {
    if (!proposal.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/optimize-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize', proposal }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimized) {
      navigator.clipboard.writeText(result.optimized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Cole sua proposta
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Deixa o Certo AI reescrever pra você ganhar mais!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Oi, posso fazer seu site? Tenho 5 anos de experiência..."
            className="w-full h-32 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {usage.plan_type === 'free' && (
                <span>Otimizações restantes: {usage.optimizations_remaining}/3</span>
              )}
              {usage.plan_type === 'premium' && (
                <span className="text-green-400">✓ Plano Premium - Ilimitado</span>
              )}
            </div>
            <button
              onClick={handleOptimize}
              disabled={!proposal.trim() || loading || usage.optimizations_remaining <= 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Processando...' : 'Otimizar com IA'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Score Card */}
          <Card className="border-green-500/30 bg-green-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm">Score de Qualidade</p>
                  <p className="text-4xl font-bold text-green-400">{result.score}/100</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Taxa de Ganho Estimada</p>
                  <p className="text-4xl font-bold text-green-400">{Math.round(result.win_rate * 100)}%</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Optimized Proposal */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Proposta Otimizada
                </CardTitle>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded flex items-center gap-2 transition"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-700/30 p-4 rounded-lg">
                {result.optimized}
              </p>
            </CardContent>
          </Card>

          {/* Issues & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Issues */}
            <Card className="border-red-500/30 bg-red-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Problemas Encontrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-red-400">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="border-blue-500/30 bg-blue-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Como Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((sugg, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-blue-400">→</span>
                      {sugg}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Analysis */}
          {result.analysis && (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-base">Análise Detalhada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Pontos Fortes</h4>
                  <p className="text-sm text-slate-400">{result.analysis.strengths?.join(', ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Pontos Fracos</h4>
                  <p className="text-sm text-slate-400">{result.analysis.weaknesses?.join(', ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Comparação com Mercado</h4>
                  <p className="text-sm text-slate-400">{result.analysis.market_comparison}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
