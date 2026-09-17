'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Target, CheckCircle, DollarSign, BarChart3 } from 'lucide-react';

interface BusinessStats {
  total_earned: number;
  completed_projects: number;
  proposals_sent: number;
  proposals_accepted: number;
  acceptance_rate: number;
  average_project_value: number;
  avg_response_time_minutes: number;
  monthly_revenue: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  transactions_count: number;
}

export function BusinessDashboard() {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch('/api/business/stats'),
          fetch('/api/business/monthly-history'),
        ]);

        const statsData = await statsRes.json();
        const historyData = await historyRes.json();

        setStats(statsData);
        setMonthlyData(historyData.monthly || []);
      } catch (error) {
        console.error('Erro ao carregar stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-700/30 rounded-lg" />;
  }

  if (!stats) {
    return null;
  }

  const totalEarned = stats.total_earned / 100;
  const monthlyRevenue = stats.monthly_revenue / 100;
  const avgProjectValue = stats.average_project_value / 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-slate-800/30 border border-emerald-600/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-2">Ganho Total</p>
            <h2 className="text-4xl font-bold text-emerald-400">
              R$ {totalEarned.toFixed(2).replace('.', ',')}
            </h2>
          </div>
          <DollarSign className="w-12 h-12 text-emerald-400 opacity-50" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Projetos Completados */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Projetos Completos</p>
          <p className="text-2xl font-bold text-blue-400">{stats.completed_projects}</p>
          <p className="text-slate-500 text-xs mt-2">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            {((stats.completed_projects / Math.max(stats.proposals_sent, 1)) * 100).toFixed(0)}% taxa
          </p>
        </div>

        {/* Propostas Aceitas */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Taxa de Aceitação</p>
          <p className="text-2xl font-bold text-emerald-400">
            {stats.acceptance_rate?.toFixed(0) || 0}%
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {stats.proposals_accepted} de {stats.proposals_sent} propostas
          </p>
        </div>

        {/* Valor Médio */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Ticket Médio</p>
          <p className="text-2xl font-bold text-amber-400">
            R$ {avgProjectValue.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-slate-500 text-xs mt-2">por projeto</p>
        </div>

        {/* Tempo de Resposta */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Tempo de Resposta</p>
          <p className="text-2xl font-bold text-blue-400">
            {stats.avg_response_time_minutes || 0}
            <span className="text-sm">min</span>
          </p>
          <p className="text-slate-500 text-xs mt-2">média</p>
        </div>
      </div>

      {/* Revenue This Month */}
      {monthlyData.length > 0 && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Receita Este Mês
          </h3>

          <div className="flex items-end gap-2 h-32 mb-4">
            {monthlyData.slice(0, 12).map((month, idx) => {
              const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);
              const percentage = (month.revenue / maxRevenue) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                    style={{ height: `${Math.max(percentage, 5)}%` }}
                    title={`${month.month}: R$ ${(month.revenue / 100).toFixed(2)}`}
                  />
                  <span className="text-xs text-slate-400 mt-2">{month.month}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Este mês:</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {monthlyRevenue.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">💡 Insights</h3>
        <div className="space-y-3">
          {stats.acceptance_rate > 50 && (
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Taxa de aceitação forte</p>
                <p className="text-slate-400 text-xs">Você tem {stats.acceptance_rate.toFixed(0)}% de aprovação - clientes confiam em você!</p>
              </div>
            </div>
          )}

          {stats.monthly_revenue > 0 && (
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Receita ativa este mês</p>
                <p className="text-slate-400 text-xs">R$ {monthlyRevenue.toFixed(2).replace('.', ',')} em {monthlyData[0]?.transactions_count || 0} transações</p>
              </div>
            </div>
          )}

          {stats.completed_projects > 0 && (
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Histórico sólido</p>
                <p className="text-slate-400 text-xs">{stats.completed_projects} projetos completados com sucesso</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 text-blue-400 py-3 rounded-lg font-semibold transition text-sm">
        📊 Ver relatório detalhado
      </button>
    </div>
  );
}
