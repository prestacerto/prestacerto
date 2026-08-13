'use client';

import { useState, useEffect } from 'react';

export default function AdminGodModePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Simulated admin stats
    setStats({
      total_users: 15420,
      total_freelancers: 8930,
      total_clients: 6490,
      total_projects: 23451,
      total_revenue: 2847500,
      monthly_revenue: 237291,
      active_proposals: 4521,
      completed_projects: 18930,
      escrow_locked: 1234567,
      ai_optimizations: 45632,
      platform_health: 99.7,
    });
  }, []);

  if (!stats) return <div className="p-6">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black mb-2">⚡ GODMODE DASHBOARD</h1>
          <p className="text-purple-400 text-lg">Acesso total. Controle absoluto. Visão 360°</p>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-6 rounded-lg">
            <p className="text-purple-200 text-sm">RECEITA TOTAL</p>
            <p className="text-4xl font-black">R$ {(stats.total_revenue / 100000).toFixed(1)}M</p>
            <p className="text-purple-300 text-xs mt-2">Crescimento: +340% YoY</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-6 rounded-lg">
            <p className="text-blue-200 text-sm">RECEITA/MÊS</p>
            <p className="text-4xl font-black">R$ {(stats.monthly_revenue / 1000).toFixed(0)}k</p>
            <p className="text-blue-300 text-xs mt-2">Em crescimento</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-900 p-6 rounded-lg">
            <p className="text-green-200 text-sm">USUÁRIOS ATIVOS</p>
            <p className="text-4xl font-black">{(stats.total_users / 1000).toFixed(1)}k</p>
            <p className="text-green-300 text-xs mt-2">+{stats.total_clients} clientes novos</p>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-lg">
            <p className="text-red-200 text-sm">HEALTH CHECK</p>
            <p className="text-4xl font-black">{stats.platform_health}%</p>
            <p className="text-red-300 text-xs mt-2">Sistema 100% operacional</p>
          </div>
        </div>

        {/* ADVANCED METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/30">
            <p className="text-gray-400 text-sm">Projetos Ativos</p>
            <p className="text-2xl font-bold">{stats.total_projects.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-blue-500/30">
            <p className="text-gray-400 text-sm">Propostas Pendentes</p>
            <p className="text-2xl font-bold">{stats.active_proposals.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
            <p className="text-gray-400 text-sm">Projetos Concluídos</p>
            <p className="text-2xl font-bold">{stats.completed_projects.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
            <p className="text-gray-400 text-sm">Escrow Travado</p>
            <p className="text-2xl font-bold">R$ {(stats.escrow_locked / 1000000).toFixed(1)}M</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-pink-500/30">
            <p className="text-gray-400 text-sm">IA Otimizações</p>
            <p className="text-2xl font-bold">{stats.ai_optimizations.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
            <p className="text-gray-400 text-sm">Freelancers Premium</p>
            <p className="text-2xl font-bold">{(stats.total_freelancers * 0.23).toFixed(0).toLocaleString()}</p>
          </div>
        </div>

        {/* LIVE ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-lg font-bold text-white transition">
            🚀 Iniciar Promoção Global
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-4 rounded-lg font-bold text-white transition">
            💰 Liberar Bonus Automático
          </button>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-4 rounded-lg font-bold text-white transition">
            📊 Gerar Relatório Fiscal
          </button>
          <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 p-4 rounded-lg font-bold text-white transition">
            ⚙️ Configurar Produtos IA
          </button>
        </div>

        {/* SISTEMA STATUS */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">SISTEMA STATUS</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Banco de Dados</span>
              <span className="text-green-400">✅ Online (99.99% uptime)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">IA Claude API</span>
              <span className="text-green-400">✅ Online (1.2M/dia)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Gateway</span>
              <span className="text-green-400">✅ Online (Stripe + Pix)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Notificações Push</span>
              <span className="text-green-400">✅ Online (45k/dia)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Escrow System</span>
              <span className="text-green-400">✅ Online (R$ 1.2M locked)</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-600 text-xs pt-8 border-t border-gray-700">
          <p>PrestaCerto © 2024 | Acesso Restrito | Só você tem essa visão</p>
          <p className="mt-2 text-purple-600 font-bold">🔐 Tudo sob controle. Você é o Godmode.</p>
        </div>
      </div>
    </div>
  );
}
