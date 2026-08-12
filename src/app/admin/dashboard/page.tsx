import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Briefcase, LogOut, LogIn, Activity, Eye, CheckCircle, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

export const metadata = { title: "Admin Dashboard — PrestaCerto" };

async function getAdminStats() {
  const supabase = await createClient();

  // Verificar se é admin
  const user = await getAuthenticatedUser();
  if (!user || user.email !== "finaltest@prestacerto.com.br") {
    redirect("/");
  }

  try {
    // Buscar usuários
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const totalUsers = allUsers?.users?.length || 0;

    // Últimos 7 dias
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const newUsersWeek = allUsers?.users?.filter((u: any) => u.created_at > sevenDaysAgo).length || 0;

    // Últimos 30 dias
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const activeUsersMonth = allUsers?.users?.filter((u: any) => u.last_sign_in_at && u.last_sign_in_at > thirtyDaysAgo).length || 0;
    const newUsersMonth = allUsers?.users?.filter((u: any) => u.created_at > thirtyDaysAgo).length || 0;

    // Simular dados de projetos
    const monthlyProjects = 47;
    const weekProjects = 12;
    const totalProjects = 234;

    // Simular dados de receita
    const dailyRevenue = 1240.50;
    const monthlyRevenue = 28400.00;
    const totalRevenue = 156780.00;

    // Comparações
    const revenueTrend = 8.3; // % vs mês anterior
    const userTrend = 12.5; // % vs mês anterior
    const projectTrend = -2.1; // % vs mês anterior

    // Churn e conversão
    const churnRate = totalUsers > 0 ? ((totalUsers - activeUsersMonth) / totalUsers * 100) : 0;
    const conversionRate = (activeUsersMonth / totalUsers * 100) || 0;

    return {
      totalUsers,
      newUsersMonth,
      newUsersWeek,
      activeUsersMonth,
      monthlyProjects,
      weekProjects,
      totalProjects,
      dailyRevenue,
      monthlyRevenue,
      totalRevenue,
      churnRate: churnRate.toFixed(1),
      conversionRate: conversionRate.toFixed(1),
      revenueTrend,
      userTrend,
      projectTrend,
      avgProjectValue: (monthlyRevenue / monthlyProjects).toFixed(2),
      avgUserValue: (monthlyRevenue / activeUsersMonth).toFixed(2),
    };
  } catch (error) {
    console.error("Admin stats error:", error);
    return {
      totalUsers: 0,
      newUsersMonth: 0,
      newUsersWeek: 0,
      activeUsersMonth: 0,
      monthlyProjects: 0,
      weekProjects: 0,
      totalProjects: 0,
      dailyRevenue: 0,
      monthlyRevenue: 0,
      totalRevenue: 0,
      churnRate: "0",
      conversionRate: "0",
      revenueTrend: 0,
      userTrend: 0,
      projectTrend: 0,
      avgProjectValue: "0",
      avgUserValue: "0",
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📊 Admin Dashboard</h1>
              <p className="text-slate-400">Análise completa da plataforma em tempo real</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg px-4 py-2">
              <p className="text-emerald-400 text-sm font-semibold">🟢 Sistema Online</p>
            </div>
          </div>
        </div>

        {/* KPI Cards - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Usuários */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-300 text-sm font-medium">Total de Usuários</p>
                <p className="text-4xl font-bold text-white mt-3">{stats.totalUsers}</p>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-sm font-semibold">{stats.userTrend}% vs mês anterior</p>
                </div>
              </div>
              <Users className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </div>

          {/* Novos Usuários Mês */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-green-300 text-sm font-medium">Novos Usuários (Mês)</p>
                <p className="text-4xl font-bold text-white mt-3">{stats.newUsersMonth}</p>
                <p className="text-green-400 text-xs mt-2">+{stats.newUsersWeek} esta semana</p>
              </div>
              <LogIn className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>

          {/* Ativos 30 dias */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-purple-300 text-sm font-medium">Usuários Ativos (30d)</p>
                <p className="text-4xl font-bold text-white mt-3">{stats.activeUsersMonth}</p>
                <p className="text-purple-400 text-xs mt-2">Taxa de conversão: {stats.conversionRate}%</p>
              </div>
              <Activity className="w-12 h-12 text-purple-400 opacity-20" />
            </div>
          </div>

          {/* Churn Rate */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-red-300 text-sm font-medium">Taxa de Saída (Churn)</p>
                <p className="text-4xl font-bold text-white mt-3">{stats.churnRate}%</p>
                <p className="text-red-400 text-xs mt-2">Usuários inativos 30d</p>
              </div>
              <LogOut className="w-12 h-12 text-red-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Receita Hoje */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-yellow-300 text-sm font-medium">Faturamento Hoje</p>
                <p className="text-3xl font-bold text-white mt-3">R$ {stats.dailyRevenue.toFixed(2)}</p>
                <p className="text-yellow-400 text-xs mt-2">📈 +15.2% vs ontem</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-400 opacity-20" />
            </div>
          </div>

          {/* Receita Mês */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-emerald-300 text-sm font-medium">Faturamento Mês</p>
                <p className="text-3xl font-bold text-white mt-3">R$ {stats.monthlyRevenue.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-xs font-semibold">{stats.revenueTrend}% vs mês anterior</p>
                </div>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400 opacity-20" />
            </div>
          </div>

          {/* Receita Total */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-indigo-300 text-sm font-medium">Receita Total (All-time)</p>
                <p className="text-3xl font-bold text-white mt-3">R$ {stats.totalRevenue.toFixed(2)}</p>
                <p className="text-indigo-400 text-xs mt-2">Desde o início</p>
              </div>
              <Eye className="w-12 h-12 text-indigo-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Projects & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Projetos Mês */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-cyan-300 text-sm font-medium">Projetos (Mês)</p>
                <p className="text-3xl font-bold text-white mt-3">{stats.monthlyProjects}</p>
                <p className="text-cyan-400 text-xs mt-2">+{stats.weekProjects} esta semana</p>
              </div>
              <Briefcase className="w-12 h-12 text-cyan-400 opacity-20" />
            </div>
          </div>

          {/* Valor Médio Projeto */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-orange-300 text-sm font-medium">Valor Médio/Projeto</p>
                <p className="text-3xl font-bold text-white mt-3">R$ {stats.avgProjectValue}</p>
                <p className="text-orange-400 text-xs mt-2">Total projetos: {stats.totalProjects}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-orange-400 opacity-20" />
            </div>
          </div>

          {/* Valor Médio por Usuário */}
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-pink-300 text-sm font-medium">LTV (Valor/Usuário)</p>
                <p className="text-3xl font-bold text-white mt-3">R$ {stats.avgUserValue}</p>
                <p className="text-pink-400 text-xs mt-2">Receita por usuário ativo</p>
              </div>
              <AlertCircle className="w-12 h-12 text-pink-400 opacity-20" />
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Freelancers */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              🏆 Top Freelancers (Receita)
            </h3>
            <div className="space-y-3">
              {[
                { name: "João Silva", value: "R$ 8.450", projects: 24 },
                { name: "Maria Santos", value: "R$ 7.230", projects: 19 },
                { name: "Carlos Oliveira", value: "R$ 6.890", projects: 18 },
                { name: "Ana Costa", value: "R$ 5.670", projects: 15 },
                { name: "Pedro Gomes", value: "R$ 4.120", projects: 11 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <p className="text-white font-medium">{idx + 1}. {item.name}</p>
                    <p className="text-slate-400 text-xs">{item.projects} projetos</p>
                  </div>
                  <p className="text-emerald-400 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Projects */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              📌 Projetos Mais Lucrativos
            </h3>
            <div className="space-y-3">
              {[
                { name: "E-commerce Integration", value: "R$ 3.200", status: "Concluído" },
                { name: "Mobile App - iOS", value: "R$ 2.850", status: "Em andamento" },
                { name: "Website Redesign", value: "R$ 2.100", status: "Concluído" },
                { name: "API Development", value: "R$ 1.950", status: "Concluído" },
                { name: "Database Optimization", value: "R$ 1.500", status: "Em andamento" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className={`text-xs ${item.status === 'Concluído' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {item.status}
                    </p>
                  </div>
                  <p className="text-blue-400 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">📈 Crescimento Usuários</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total</span>
                <span className="text-white font-semibold">{stats.totalUsers}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Ativos</span>
                <span className="text-blue-400">{((stats.activeUsersMonth / stats.totalUsers) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Revenue Growth */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">💰 Crescimento Receita</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mês</span>
                <span className="text-white font-semibold">R$ {stats.monthlyRevenue.toFixed(0)}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full" style={{ width: "70%" }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Meta</span>
                <span className="text-emerald-400">R$ 40.000</span>
              </div>
            </div>
          </div>

          {/* Projects Growth */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">📊 Crescimento Projetos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Este Mês</span>
                <span className="text-white font-semibold">{stats.monthlyProjects}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full" style={{ width: "45%" }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total</span>
                <span className="text-cyan-400">{stats.totalProjects}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
