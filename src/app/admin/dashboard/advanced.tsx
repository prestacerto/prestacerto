'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, TrendingUp, DollarSign, Briefcase,
  ArrowUp, ArrowDown, Zap, Award, Target, Bell,
  BarChart3, LineChart, PieChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, Legend } from 'recharts';

interface KPIData {
  totalUsers: number;
  newUsersMonth: number;
  newUsersWeek: number;
  activeUsersMonth: number;
  churnRate: number;
  revenueToday: number;
  revenueMonth: number;
  revenueTotal: number;
  avgProjectValue: number;
  ltv: number;
  revenueGrowth: number;
  userGrowth: number;
  projectGrowth: number;
}

interface TopFreelancer {
  id: string;
  name: string;
  revenue: number;
  projects: number;
  rating: number;
}

interface TopProject {
  id: string;
  title: string;
  value: number;
  status: 'completed' | 'in_progress' | 'pending';
  profitability: number;
}

export function AdvancedDashboard() {
  const [data, setData] = useState<KPIData | null>(null);
  const [topFreelancers, setTopFreelancers] = useState<TopFreelancer[]>([]);
  const [topProjects, setTopProjects] = useState<TopProject[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar dados simulados (você pode conectar com API real)
      const kpiData: KPIData = {
        totalUsers: 1240,
        newUsersMonth: 156,
        newUsersWeek: 34,
        activeUsersMonth: 892,
        churnRate: 28.1,
        revenueToday: 2450.50,
        revenueMonth: 68400.00,
        revenueTotal: 428760.00,
        avgProjectValue: 850.00,
        ltv: 3450.00,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
        projectGrowth: 15.2,
      };

      const freelancers: TopFreelancer[] = [
        { id: '1', name: 'João Silva', revenue: 18500, projects: 24, rating: 4.9 },
        { id: '2', name: 'Maria Santos', revenue: 15200, projects: 18, rating: 4.8 },
        { id: '3', name: 'Pedro Costa', revenue: 12800, projects: 15, rating: 4.7 },
        { id: '4', name: 'Ana Paula', revenue: 11400, projects: 14, rating: 4.9 },
        { id: '5', name: 'Carlos Mendes', revenue: 9600, projects: 12, rating: 4.6 },
      ];

      const projects: TopProject[] = [
        { id: '1', title: 'E-commerce Rebuild', value: 4500, status: 'completed', profitability: 42 },
        { id: '2', title: 'Mobile App Dev', value: 3800, status: 'completed', profitability: 38 },
        { id: '3', title: 'Brand Design', value: 2200, status: 'completed', profitability: 55 },
        { id: '4', title: 'SEO Optimization', value: 1800, status: 'in_progress', profitability: 65 },
        { id: '5', title: 'API Integration', value: 2800, status: 'in_progress', profitability: 48 },
      ];

      const chart = [
        { date: 'Jan', users: 240, revenue: 4000, projects: 24 },
        { date: 'Fev', users: 310, revenue: 5200, projects: 32 },
        { date: 'Mar', users: 420, revenue: 7400, projects: 45 },
        { date: 'Abr', users: 580, revenue: 9800, projects: 58 },
        { date: 'Mai', users: 750, revenue: 12400, projects: 72 },
        { date: 'Jun', users: 892, revenue: 14200, projects: 89 },
      ];

      setData(kpiData);
      setTopFreelancers(freelancers);
      setTopProjects(projects);
      setChartData(chart);

      // Detectar anomalias
      const anomaliesList = [];
      if (kpiData.churnRate > 25) anomaliesList.push('⚠️ Churn rate acima de 25%');
      if (kpiData.userGrowth < 5) anomaliesList.push('📉 Crescimento de usuários abaixo de meta');
      if (kpiData.revenueMonth < 60000) anomaliesList.push('💰 Receita do mês abaixo da meta');
      setAnomalies(anomaliesList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  if (!data) return <div>Carregando...</div>;

  return (
    <div className="space-y-8">
      {/* Alertas de Anomalias */}
      {anomalies.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Alertas Detectados</h3>
              <ul className="mt-2 space-y-1 text-sm text-red-800">
                {anomalies.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards - Row 1 (9 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {/* Total Users */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Users className="w-5 h-5 text-blue-600" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{data.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-blue-700">
              <TrendingUp className="w-4 h-4" />
              <span>+{data.userGrowth}% vs mês</span>
            </div>
          </CardContent>
        </Card>

        {/* New Users Month */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ArrowUp className="w-5 h-5 text-green-600" />
              Novos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{data.newUsersMonth}</div>
            <div className="text-xs text-green-700 mt-2">
              {data.newUsersWeek} esta semana
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="w-5 h-5 text-purple-600" />
              Ativos (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{data.activeUsersMonth}</div>
            <div className="text-xs text-purple-700 mt-2">
              {((data.activeUsersMonth / data.totalUsers) * 100).toFixed(1)}% do total
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ArrowDown className="w-5 h-5 text-red-600" />
              Taxa de Saída
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{data.churnRate.toFixed(1)}%</div>
            <div className="text-xs text-red-700 mt-2">
              {((data.totalUsers - data.activeUsersMonth) / data.totalUsers * 100).toFixed(0)} usuários
            </div>
          </CardContent>
        </Card>

        {/* Revenue Today */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              Receita Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">
              R$ {data.revenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Month */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Receita Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">
              R$ {(data.revenueMonth / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-emerald-700">
              <TrendingUp className="w-4 h-4" />
              <span>+{data.revenueGrowth}% vs mês</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Award className="w-5 h-5 text-indigo-600" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">
              R$ {(data.revenueTotal / 1000).toFixed(0)}k
            </div>
          </CardContent>
        </Card>

        {/* Avg Project Value */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="w-5 h-5 text-orange-600" />
              Valor Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              R$ {data.avgProjectValue.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        {/* LTV */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Target className="w-5 h-5 text-pink-600" />
              LTV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-900">
              R$ {data.ltv.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-pink-700 mt-2">Lifetime Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Crescimento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Crescimento de Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Freelancers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top 5 Freelancers (Receita)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFreelancers.map((f, idx) => (
              <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{f.name}</p>
                    <p className="text-xs text-slate-600">⭐ {f.rating} • {f.projects} projetos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">R$ {f.revenue.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Top 5 Projetos Lucrativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      p.status === 'completed' ? 'bg-green-100 text-green-700' :
                      p.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {p.status === 'completed' ? '✅ Concluído' :
                       p.status === 'in_progress' ? '⏳ Em andamento' : '📋 Pendente'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">R$ {p.value.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-green-600 font-semibold">{p.profitability}% margin</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}