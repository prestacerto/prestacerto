import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Briefcase, LogOut, LogIn, Activity } from "lucide-react";

export const metadata = { title: "Admin Dashboard — PrestaCerto" };

async function getAdminStats() {
  const supabase = await createClient();

  // Verificar se é admin
  const user = await getAuthenticatedUser();
  if (!user || user.email !== "finaltest@prestacerto.com.br") {
    redirect("/");
  }

  try {
    // Total de usuários
    const { data: allUsers } = await supabase
      .from("user_metadata")
      .select("id", { count: "exact" });

    // Usuários novos (últimos 7 dias)
    const { data: newUsers } = await supabase
      .from("user_metadata")
      .select("id", { count: "exact" })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Usuários ativos (últimos 30 dias)
    const { data: activeUsers } = await supabase
      .from("user_metadata")
      .select("id", { count: "exact" })
      .gte("last_sign_in_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Projetos do mês
    const { data: monthProjects } = await supabase
      .from("projects")
      .select("id", { count: "exact" })
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Faturamento simulado (será integrado com Stripe depois)
    const dailyRevenue = 1240.50;
    const monthlyRevenue = 18900.00;

    return {
      totalUsers: allUsers?.length || 0,
      newUsers: newUsers?.length || 0,
      activeUsers: activeUsers?.length || 0,
      monthProjects: monthProjects?.length || 0,
      dailyRevenue,
      monthlyRevenue,
      avgProjectValue: monthProjects?.length ? (monthlyRevenue / monthProjects.length).toFixed(2) : 0,
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return {
      totalUsers: 0,
      newUsers: 0,
      activeUsers: 0,
      monthProjects: 0,
      dailyRevenue: 0,
      monthlyRevenue: 0,
      avgProjectValue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const churnRate = stats.totalUsers ? ((stats.totalUsers - stats.activeUsers) / stats.totalUsers * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Admin Dashboard</h1>
          <p className="text-slate-400">Acompanhe métricas em tempo real da plataforma</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Usuários */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total de Usuários</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                <p className="text-blue-400 text-xs mt-2">Todos os tempos</p>
              </div>
              <Users className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </div>

          {/* Usuários Novos */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Novos Usuários</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.newUsers}</p>
                <p className="text-green-400 text-xs mt-2">Últimos 7 dias</p>
              </div>
              <LogIn className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>

          {/* Usuários Ativos */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Usuários Ativos</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                <p className="text-purple-400 text-xs mt-2">Últimos 30 dias</p>
              </div>
              <Activity className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </div>

          {/* Taxa Saída */}
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Taxa Saída (Churn)</p>
                <p className="text-3xl font-bold text-white mt-2">{churnRate}%</p>
                <p className="text-red-400 text-xs mt-2">Usuários inativos</p>
              </div>
              <LogOut className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Revenue & Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Faturamento Dia */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Faturamento Hoje</p>
                <p className="text-3xl font-bold text-white mt-2">R$ {stats.dailyRevenue.toFixed(2)}</p>
                <p className="text-yellow-400 text-xs mt-2">+15.2% vs ontem</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </div>

          {/* Faturamento Mês */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Faturamento Mês</p>
                <p className="text-3xl font-bold text-white mt-2">R$ {stats.monthlyRevenue.toFixed(2)}</p>
                <p className="text-emerald-400 text-xs mt-2">+8.3% vs mês anterior</p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400 opacity-50" />
            </div>
          </div>

          {/* Projetos Mês */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-300 text-sm font-medium">Projetos (Mês)</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.monthProjects}</p>
                <p className="text-indigo-400 text-xs mt-2">Valor médio: R$ {stats.avgProjectValue}</p>
              </div>
              <Briefcase className="w-12 h-12 text-indigo-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Timeline */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">📈 Crescimento de Usuários</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Cadastrados</span>
                <span className="text-white font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Ativos Hoje</span>
                <span className="text-white font-semibold">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Timeline */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">💰 Projeção Mensal</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Faturado (Mês)</span>
                <span className="text-white font-semibold">R$ {stats.monthlyRevenue.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.min((stats.monthlyRevenue / 30000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Meta Mensal</span>
                <span className="text-white font-semibold">R$ 30.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
