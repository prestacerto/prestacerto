'use client';

import { useState } from 'react';
import { DollarSign, Zap, Users, TrendingUp } from 'lucide-react';

interface MonetizationStream {
  id: string;
  name: string;
  description: string;
  icon: string;
  potential: number;
  current: number;
  status: 'active' | 'inactive' | 'coming_soon';
}

export default function MonetizationPage() {
  const [streams] = useState<MonetizationStream[]>([
    {
      id: 'projects',
      name: 'Projetos Freelancer',
      description: 'Ganhe com projetos diretos de clientes',
      icon: '💼',
      potential: 50000,
      current: 12500,
      status: 'active',
    },
    {
      id: 'referrals',
      name: 'Programa de Afiliados',
      description: 'Ganhe 15% comissão de cada referência',
      icon: '🔗',
      potential: 8000,
      current: 2100,
      status: 'active',
    },
    {
      id: 'courses',
      name: 'Venda de Cursos',
      description: 'Crie e venda cursos sobre suas skills',
      icon: '📚',
      potential: 15000,
      current: 0,
      status: 'inactive',
    },
    {
      id: 'templates',
      name: 'Marketplace de Templates',
      description: 'Venda templates, componentes e recursos',
      icon: '🎨',
      potential: 5000,
      current: 0,
      status: 'inactive',
    },
    {
      id: 'mentoring',
      name: 'Sessões de Mentoria',
      description: 'Mentor 1-on-1 com pagamento por hora',
      icon: '👨‍🏫',
      potential: 12000,
      current: 3200,
      status: 'active',
    },
    {
      id: 'content',
      name: 'Monetização de Conteúdo',
      description: 'Ganhe com blog, vídeos e tutoriais',
      icon: '🎬',
      potential: 4000,
      current: 0,
      status: 'coming_soon',
    },
  ]);

  const totalPotential = streams.reduce((sum, s) => sum + s.potential, 0);
  const totalCurrent = streams.reduce((sum, s) => sum + s.current, 0);
  const activeStreams = streams.filter(s => s.status === 'active');

  const statusConfig: any = {
    active: { color: 'bg-green-100 text-green-800', icon: '✓', label: 'Ativo' },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: '○', label: 'Inativo' },
    coming_soon: { color: 'bg-blue-100 text-blue-800', icon: '🔜', label: 'Em Breve' },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <DollarSign className="w-8 h-8 text-green-500" />
          Monetização
        </h1>
        <p className="text-gray-600">Múltiplas formas de ganho para potencializar sua renda</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Ganho Este Mês</p>
          <p className="text-3xl font-bold">R$ {(totalCurrent / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <Zap className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Potencial Mensal</p>
          <p className="text-3xl font-bold">R$ {(totalPotential / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Fluxos Ativos</p>
          <p className="text-3xl font-bold">{activeStreams.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <DollarSign className="w-6 h-6 mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Meta Anual</p>
          <p className="text-3xl font-bold">R$ {(totalPotential * 12 / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Monetization Streams */}
      <div className="space-y-6">
        {streams.map(stream => {
          const config = statusConfig[stream.status];
          const utilization = (stream.current / stream.potential) * 100;

          return (
            <div key={stream.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{stream.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold">{stream.name}</h3>
                      <p className="text-sm text-gray-600">{stream.description}</p>
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${config.color}`}>
                  {config.icon} {config.label}
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Ganho Atual</span>
                  <span className="text-sm font-bold">R$ {(stream.current / 1000).toFixed(1)}k / R$ {(stream.potential / 1000).toFixed(1)}k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {utilization.toFixed(0)}% da capacidade total
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {stream.status === 'active' ? (
                  <>
                    <button className="flex-1 text-sm border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                      Gerenciar
                    </button>
                    <button className="flex-1 text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                      Otimizar Ganhos
                    </button>
                  </>
                ) : stream.status === 'coming_soon' ? (
                  <button className="w-full text-sm border text-gray-700 py-2 rounded hover:bg-gray-50 transition cursor-not-allowed opacity-50">
                    Em Breve
                  </button>
                ) : (
                  <button className="w-full text-sm bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                    Ativar Fluxo de Renda
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategy Tips */}
      <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">💡 Estratégia de Diversificação</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="text-lg">1️⃣</span>
            <span>
              <strong>Maximize seus Projetos Freelancer:</strong> Você está em 25% da capacidade. Aumente seu preço ou volume para atingir R$ 50k/mês.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">2️⃣</span>
            <span>
              <strong>Ative Cursos:</strong> Com sua expertise em React/Next.js, um curso iniciante pode gerar R$ 5-10k/mês passivamente.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">3️⃣</span>
            <span>
              <strong>Expanda Mentorias:</strong> Você está faturando R$ 3.2k em mentoria. Com 2-3 sessões a mais por semana, pode dobrar isso.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">4️⃣</span>
            <span>
              <strong>Crie um Produtinho:</strong> Templates React vendendo por R$ 50-100 cada. Meta: 50 vendas = R$ 3.5k/mês.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
