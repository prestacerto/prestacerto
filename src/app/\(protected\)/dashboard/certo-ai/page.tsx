'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { CertoAIOptimizer } from '@/components/ai/certo-ai-optimizer';
import { ProposalComparison } from '@/components/ai/proposal-comparison';

export default function CertoAIDashboard() {
  const [activeTab, setActiveTab] = useState('optimizer');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-black text-white">Certo AI</h1>
          </div>
          <p className="text-slate-400">Potencialize suas propostas com inteligência artificial</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-400 mb-1">Propostas Otimizadas</div>
              <div className="text-3xl font-bold text-blue-400">1,247</div>
              <div className="text-xs text-slate-500 mt-1">+12% vs mês anterior</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-400 mb-1">Usuários Ativos</div>
              <div className="text-3xl font-bold text-green-400">3,842</div>
              <div className="text-xs text-slate-500 mt-1">Plataforma Presta</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-400 mb-1">Score Médio</div>
              <div className="text-3xl font-bold text-yellow-400">78/100</div>
              <div className="text-xs text-slate-500 mt-1">Qualidade das propostas</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-slate-400 mb-1">Taxa de Ganho</div>
              <div className="text-3xl font-bold text-green-400">73%</div>
              <div className="text-xs text-slate-500 mt-1">Média de sucesso</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Otimizador
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Comparar
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Optimizer Tab */}
          <TabsContent value="optimizer">
            <CertoAIOptimizer />
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="compare">
            <ProposalComparison />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {/* Top Insights */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Padrões de Propostas Vencedoras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">Personalização</span>
                        <span className="text-sm text-green-400">+35%</span>
                      </div>
                      <p className="text-xs text-slate-400">Propostas com caso de uso específico ganham 35% mais</p>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">Portfolio</span>
                        <span className="text-sm text-green-400">+28%</span>
                      </div>
                      <p className="text-xs text-slate-400">Mencionar projetos similares aumenta taxa de sucesso</p>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">Timeline</span>
                        <span className="text-sm text-green-400">+22%</span>
                      </div>
                      <p className="text-xs text-slate-400">Propostas com prazo definido têm 22% mais conversão</p>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-300">Diferencial</span>
                        <span className="text-sm text-green-400">+40%</span>
                      </div>
                      <p className="text-xs text-slate-400">Explicar o que te diferencia dobra a taxa de ganho</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle>Performance ao Longo do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-around gap-2 px-4">
                    {[65, 68, 72, 75, 78, 81, 79].map((score, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all"
                          style={{ height: `${(score / 100) * 150}px` }}
                        />
                        <span className="text-xs text-slate-500 mt-2">Sem {idx}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Optimizations */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle>Otimizações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { score: 89, category: 'Desenvolvimento Web', time: '2 horas atrás' },
                      { score: 76, category: 'Design UI/UX', time: '5 horas atrás' },
                      { score: 92, category: 'Consultoria', time: '1 dia atrás' },
                      { score: 71, category: 'Mobile App', time: '2 dias atrás' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{item.category}</p>
                          <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                        <span className="text-lg font-bold text-blue-400">{item.score}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Plan Info Card */}
        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Plano: Grátis</h3>
          <p className="text-sm text-blue-200 mb-4">
            Você tem 3 otimizações por mês. Upgrade para Premium por R$ 19,90/mês para ilimitado!
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            Upgrade para Premium →
          </button>
        </div>
      </div>
    </div>
  );
}
