'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function AnalyticsProPage() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          Analytics Pro
        </h1>
        <p className="text-gray-600">Análise detalhada da sua performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['week', 'month', 'quarter', 'year'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-white border text-gray-700 hover:border-blue-500'
            }`}
          >
            {range === 'week' && 'Esta Semana'}
            {range === 'month' && 'Este Mês'}
            {range === 'quarter' && 'Este Trimestre'}
            {range === 'year' && 'Este Ano'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Taxa de Conversão</p>
          <p className="text-3xl font-bold">68%</p>
          <p className="text-xs opacity-75 mt-2">+12% vs mês anterior</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Clientes Recorrentes</p>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs opacity-75 mt-2">42% do total</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <Clock className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Tempo Médio/Projeto</p>
          <p className="text-3xl font-bold">28 dias</p>
          <p className="text-xs opacity-75 mt-2">-5 dias vs trimestre anterior</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <BarChart3 className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Revenue per Project</p>
          <p className="text-3xl font-bold">R$ 8.5k</p>
          <p className="text-xs opacity-75 mt-2">+8% vs mês anterior</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Projects Over Time */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Projetos ao Longo do Tempo</h3>
          <div className="space-y-3">
            {['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'].map((week, i) => (
              <div key={week}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">{week}</span>
                  <span className="text-sm font-bold">{8 + i * 2} projetos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(8 + i * 2) * 5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Performance */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Performance por Skill</h3>
          <div className="space-y-3">
            {[
              { skill: 'React/Next.js', count: 18, rating: 4.9 },
              { skill: 'Python/AI', count: 12, rating: 4.8 },
              { skill: 'DevOps', count: 8, rating: 4.7 },
              { skill: 'Design', count: 5, rating: 4.6 },
            ].map(item => (
              <div key={item.skill} className="flex items-center justify-between">
                <span className="text-sm font-semibold">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{item.count} projetos</span>
                  <span className="text-sm font-bold text-yellow-600">{item.rating}★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Satisfação de Clientes</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-yellow-500 mb-2">4.8★</p>
            <p className="text-sm text-gray-600">Baseado em {45} avaliações</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>⭐⭐⭐⭐⭐ 38 (84%)</p>
              <p>⭐⭐⭐⭐ 6 (13%)</p>
              <p>⭐⭐⭐ 1 (2%)</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Taxa de Resposta</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-green-600 mb-2">1.2h</p>
            <p className="text-sm text-gray-600">Tempo médio de resposta</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>Respostas hoje: 8</p>
              <p>Total este mês: 156</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Oportunidades Perdidas</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-red-600 mb-2">5</p>
            <p className="text-sm text-gray-600">Este mês</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>Motivo principal: Preço</p>
              <p>Valor perdido: R$ 45k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">📊 Recomendações de Otimização</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>✓ <strong>Aumentar preços:</strong> Seus ratings (4.8★) justificam aumento de 15% no preço médio</li>
          <li>✓ <strong>Focar em React:</strong> 60% dos projetos bem-avaliados usam React - é sua especialidade</li>
          <li>✓ <strong>Responder mais rápido:</strong> Clientes que recebem resposta em < 1h têm 40% mais chance de aceitar proposta</li>
          <li>✓ <strong>Especializar em AI:</strong> Python/AI é a skill com maior crescimento (+45% este trimestre)</li>
        </ul>
      </div>
    </div>
  );
}
