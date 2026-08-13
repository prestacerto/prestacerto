'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity, AlertCircle, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 15420,
    totalFreelancers: 8930,
    totalClients: 6490,
    totalProjects: 23451,
    totalRevenue: 2847500,
    monthlyRevenue: 237291,
    activeProposals: 4521,
    completedProjects: 18930,
    escrowLocked: 1234567,
    aiOptimizations: 45632,
    platformHealth: 99.7,
    conversionRate: 23.4,
    newUsersThisMonth: 1240,
    churnRate: 2.1,
    usersLeft: 324,
    monthlyFaturamento: 2847500,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black mb-2">📊 ADMIN DASHBOARD</h1>
            <p className="text-slate-400">Acompanhe TUDO da plataforma em tempo real</p>
          </div>
          <button className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg flex items-center gap-2">
            <Settings size={20} /> Configurações
          </button>
        </div>

        {/* KEY METRICS - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-lg border border-emerald-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-emerald-100 text-sm font-semibold">RECEITA TOTAL</p>
                <p className="text-5xl font-black mt-2">R$ {(stats.totalRevenue / 1000000).toFixed(2)}M</p>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-300" />
            </div>
            <p className="text-emerald-200 text-sm">Crescimento: +340% YoY</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-lg border border-blue-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-semibold">RECEITA/MÊS</p>
                <p className="text-5xl font-black mt-2">R$ {(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-300" />
            </div>
            <p className="text-blue-200 text-sm">Projeção anual: R$ {(stats.monthlyRevenue * 12 / 1000).toFixed(0)}k</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-lg border border-purple-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-purple-100 text-sm font-semibold">USUÁRIOS ATIVOS</p>
                <p className="text-5xl font-black mt-2">{(stats.totalUsers / 1000).toFixed(1)}k</p>
              </div>
              <Users className="w-12 h-12 text-purple-300" />
            </div>
            <p className="text-purple-200 text-sm">Freelancers: {stats.totalFreelancers.toLocaleString()} | Clientes: {stats.totalClients.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-lg border border-orange-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-orange-100 text-sm font-semibold">HEALTH CHECK</p>
                <p className="text-5xl font-black mt-2">{stats.platformHealth}%</p>
              </div>
              <Activity className="w-12 h-12 text-orange-300" />
            </div>
            <p className="text-orange-200 text-sm">Sistema operacional 24/7</p>
          </div>
        </div>

        {/* ADVANCED METRICS - 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Projetos Ativos</p>
            <p className="text-4xl font-bold text-emerald-400">{stats.totalProjects.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">↑ +12% this week</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Propostas Pendentes</p>
            <p className="text-4xl font-bold text-blue-400">{stats.activeProposals.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Tempo médio: 2.3h</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Projetos Concluídos</p>
            <p className="text-4xl font-bold text-purple-400">{stats.completedProjects.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Taxa: 98.2% sucesso</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Escrow Travado</p>
            <p className="text-4xl font-bold text-yellow-400">R$ {(stats.escrowLocked / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-slate-500 mt-2">Proteção garantida</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">IA Otimizações</p>
            <p className="text-4xl font-bold text-pink-400">{stats.aiOptimizations.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">Propostas otimizadas</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Taxa de Conversão</p>
            <p className="text-4xl font-bold text-cyan-400">{stats.conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-2">Acima da média do mercado</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Novos Usuários (Mês)</p>
            <p className="text-4xl font-bold text-green-400">+{stats.newUsersThisMonth.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">↑ Entrada de novos</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Churn Rate</p>
            <p className="text-4xl font-bold text-red-400">{stats.churnRate}%</p>
            <p className="text-xs text-slate-500 mt-2">Usuários saindo/mês</p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
            <p className="text-slate-400 text-sm mb-2">Usuários Saindo (Mês)</p>
            <p className="text-4xl font-bold text-orange-400">-{stats.usersLeft.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">↓ Saída de usuários</p>
          </div>
        </div>

        {/* SISTEMA STATUS */}
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">SISTEMA STATUS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">Banco de Dados</span>
                <span className="text-green-400 font-bold">✅ Online (99.99% uptime)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">IA Claude API</span>
                <span className="text-green-400 font-bold">✅ Online (1.2M/dia)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">Payment Gateway</span>
                <span className="text-green-400 font-bold">✅ Online (Stripe + Pix + MP)</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">Notificações Push</span>
                <span className="text-green-400 font-bold">✅ Online (45k/dia)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">Escrow System</span>
                <span className="text-green-400 font-bold">✅ Online (R$ 1.2M locked)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                <span className="text-slate-300">Redis Cache</span>
                <span className="text-green-400 font-bold">✅ Online (Upstash)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ADMIN ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 p-4 rounded-lg font-bold text-white transition transform hover:scale-105">
            💰 Prêmios & Bonuses
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 p-4 rounded-lg font-bold text-white transition transform hover:scale-105">
            📢 Notificação Global
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 p-4 rounded-lg font-bold text-white transition transform hover:scale-105">
            🔧 Manutenção
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 p-4 rounded-lg font-bold text-white transition transform hover:scale-105">
            📊 Relatórios
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center text-slate-500 text-xs pt-8 border-t border-slate-700">
          <p>PrestaCerto © 2024 | Painel Administrativo Privado</p>
          <p className="mt-2 text-slate-600">Apenas você tem acesso. Dashboard atualizado em tempo real.</p>
        </div>
      </div>
    </div>
  );
}
