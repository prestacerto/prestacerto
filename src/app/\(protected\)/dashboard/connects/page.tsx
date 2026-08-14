'use client';

import { useState } from 'react';
import { Zap, CheckCircle, Clock, Users } from 'lucide-react';

interface Connect {
  id: string;
  title: string;
  client: string;
  budget: number;
  deadline: string;
  status: 'open' | 'bid' | 'active' | 'completed';
  skills: string[];
  description: string;
  proposals: number;
  views: number;
}

export default function ConnectsPage() {
  const [connects] = useState<Connect[]>([
    {
      id: '1',
      title: 'Desenvolver Dashboard React',
      client: 'Tech Startup',
      budget: 8000,
      deadline: '2024-09-30',
      status: 'open',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      description: 'Dashboard de analytics com gráficos em tempo real',
      proposals: 12,
      views: 247,
    },
    {
      id: '2',
      title: 'API REST com Node.js',
      client: 'SaaS Company',
      budget: 12000,
      deadline: '2024-10-15',
      status: 'open',
      skills: ['Node.js', 'PostgreSQL', 'Express'],
      description: 'API para e-commerce com 20+ endpoints',
      proposals: 8,
      views: 156,
    },
    {
      id: '3',
      title: 'Otimização de Performance',
      client: 'Digital Agency',
      budget: 5000,
      deadline: '2024-09-20',
      status: 'bid',
      skills: ['Performance', 'Web Vitals', 'DevTools'],
      description: 'Melhorar Lighthouse score de 45 para 90+',
      proposals: 3,
      views: 89,
    },
    {
      id: '4',
      title: 'Migração para Next.js 15',
      client: 'Enterprise Corp',
      budget: 15000,
      deadline: '2024-11-30',
      status: 'active',
      skills: ['Next.js', 'React', 'TypeScript'],
      description: 'Migrar aplicação CRA para Next.js com App Router',
      proposals: 2,
      views: 567,
    },
    {
      id: '5',
      title: 'Implementar Autenticação OAuth',
      client: 'StartUp Y',
      budget: 4000,
      deadline: '2024-09-25',
      status: 'completed',
      skills: ['OAuth 2.0', 'JWT', 'Security'],
      description: 'Integrar Google, GitHub e LinkedIn login',
      proposals: 5,
      views: 234,
    },
  ]);

  const openConnects = connects.filter(c => c.status === 'open' || c.status === 'bid');
  const activeConnects = connects.filter(c => c.status === 'active');

  const statusConfig: any = {
    open: { color: 'bg-green-100 text-green-800', icon: '📂', label: 'Aberto' },
    bid: { color: 'bg-blue-100 text-blue-800', icon: '🤝', label: 'Em Negociação' },
    active: { color: 'bg-purple-100 text-purple-800', icon: '⚙️', label: 'Ativo' },
    completed: { color: 'bg-gray-100 text-gray-800', icon: '✓', label: 'Concluído' },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-blue-500" />
          Conectas Disponíveis
        </h1>
        <p className="text-gray-600">Projetos open-source e empresariais esperando por você</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Conectas Abertos</p>
          <p className="text-3xl font-bold">{openConnects.length}</p>
          <p className="text-xs opacity-75 mt-2">Aguardando propostas</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Ativos</p>
          <p className="text-3xl font-bold">{activeConnects.length}</p>
          <p className="text-xs opacity-75 mt-2">Em desenvolvimento</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Potencial Faturamento</p>
          <p className="text-3xl font-bold">R$ {(connects.reduce((sum, c) => sum + c.budget, 0) / 1000).toFixed(0)}k</p>
          <p className="text-xs opacity-75 mt-2">Total disponível</p>
        </div>
      </div>

      <div className="space-y-4">
        {connects.map(connect => {
          const config = statusConfig[connect.status];
          const daysLeft = Math.ceil((new Date(connect.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={connect.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{connect.title}</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Cliente:</strong> {connect.client}
                  </p>
                  <p className="text-sm text-gray-600">{connect.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">R$ {(connect.budget / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-gray-600 mt-2">Orçamento</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Prazo</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {daysLeft > 0 ? `${daysLeft}d` : 'Vencido'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Propostas</p>
                  <p className="font-semibold">{connect.proposals}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Visualizações</p>
                  <p className="font-semibold">{connect.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Skills</p>
                  <p className="font-semibold">{connect.skills.length}</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {connect.skills.map(skill => (
                  <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                {connect.status === 'open' || connect.status === 'bid' ? (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition">
                      <Zap className="w-4 h-4" />
                      Enviar Proposta
                    </button>
                    <button className="flex-1 border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                      Ver Detalhes
                    </button>
                  </>
                ) : connect.status === 'active' ? (
                  <>
                    <button className="flex-1 border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                      Ver Progresso
                    </button>
                    <button className="flex-1 border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                      Enviar Update
                    </button>
                  </>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-2 rounded cursor-not-allowed">
                    <CheckCircle className="w-4 h-4" />
                    Concluído
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
