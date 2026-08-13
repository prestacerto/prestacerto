'use client';

import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function InsightsPage() {
  const marketData = [
    { category: 'Web Development', share: 35, growth: '+28%', value: 'R$ 45.2M' },
    { category: 'Mobile', share: 25, growth: '+15%', value: 'R$ 32.1M' },
    { category: 'Data & AI', share: 20, growth: '+52%', value: 'R$ 25.8M' },
    { category: 'DevOps', share: 12, growth: '+35%', value: 'R$ 15.4M' },
    { category: 'Design', share: 8, growth: '+12%', value: 'R$ 10.2M' },
  ];

  const opportunities = [
    { skill: 'LLM Integration', demand: 'Crítica', avgPrice: 12000, growth: '+145%' },
    { skill: 'Kubernetes', demand: 'Alta', avgPrice: 11000, growth: '+48%' },
    { skill: 'Go/Rust', demand: 'Alta', avgPrice: 10500, growth: '+62%' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Insights</h1>
        <p className="text-gray-600">Inteligência de mercado em tempo real</p>
      </div>

      {/* Market Overview */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Market Share */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Market Share por Categoria
          </h2>
          <div className="space-y-4">
            {marketData.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{item.category}</p>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{item.share}%</p>
                    <p className="text-xs text-gray-600">{item.value}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {item.growth}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90">Total de Projetos</p>
            <p className="text-4xl font-bold">128.7k</p>
            <p className="text-sm opacity-75 mt-2">Últimos 30 dias</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90">Valor Médio de Projeto</p>
            <p className="text-4xl font-bold">R$ 7.8k</p>
            <p className="text-sm opacity-75 mt-2">+12% mês anterior</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <p className="text-sm opacity-90">Freelancers Ativos</p>
            <p className="text-4xl font-bold">45.2k</p>
            <p className="text-sm opacity-75 mt-2">+8% crescimento</p>
          </div>
        </div>
      </div>

      {/* Top Opportunities */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Maiores Oportunidades
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div key={opp.skill} className="border rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="font-bold mb-3">{opp.skill}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Demanda</span>
                  <span className={`font-semibold ${opp.demand === 'Crítica' ? 'text-red-600' : 'text-orange-600'}`}>
                    {opp.demand}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço Médio</span>
                  <span className="font-bold">R$ {(opp.avgPrice / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crescimento</span>
                  <span className="text-green-600 font-bold">{opp.growth}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded text-sm font-semibold hover:bg-blue-600 transition">
                Explorar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">📊 Tendências do Mercado</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>🚀 IA é a área com maior crescimento (+145% em LLM Integration)</li>
          <li>💼 Empresas buscam especialistas em DevOps/Kubernetes (demanda crítica)</li>
          <li>📈 Preços médios subiram 12% — skills especializadas valem mais</li>
          <li>⚙️ Go e Rust ganham tração em projetos backend de alto desempenho</li>
        </ul>
      </div>
    </div>
  );
}
