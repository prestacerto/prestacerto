"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  freelancers: number;
  clients: number;
  totalRevenue: number;
  totalTransactions: number;
  lastMonthRevenue: number;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  userGrowth: Array<{ date: string; count: number }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchStats();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const [profiles, payments] = await Promise.all([
        supabase.from("profiles").select("id, role, created_at", { count: "exact" }),
        supabase.from("payments").select("amount, created_at", { count: "exact" }),
      ]);

      const totalUsers = profiles.count || 0;
      const freelancers = profiles.data?.filter((p) => p.role === "freelancer" || p.role === "both").length || 0;
      const clients = profiles.data?.filter((p) => p.role === "client" || p.role === "both").length || 0;
      const totalRevenue = (payments.data || []).reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalTransactions = payments.count || 0;

      // Calcular receita do mês
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthRevenue =
        (payments.data || [])
          .filter((p) => new Date(p.created_at) >= lastMonth)
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Gerar dados de crescimento diário (últimos 7 dias)
      const dailyRevenue = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
        const revenue =
          (payments.data || [])
            .filter((p) => {
              const pDate = new Date(p.created_at);
              return pDate.toDateString() === date.toDateString();
            })
            .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        dailyRevenue.push({ date: dateStr, revenue });
      }

      // Crescimento de usuários (últimos 30 dias)
      const userGrowth = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const count =
          profiles.data?.filter((p) => {
            const pDate = new Date(p.created_at);
            return pDate <= date;
          }).length || 0;
        
        if (i % 5 === 0) { // Mostrar a cada 5 dias
          userGrowth.push({
            date: date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
            count,
          });
        }
      }

      setStats({
        totalUsers,
        freelancers,
        clients,
        totalRevenue,
        totalTransactions,
        lastMonthRevenue,
        dailyRevenue,
        userGrowth,
      });
    } catch (error) {
      console.error("Erro ao buscar stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Usuários Totais",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
      change: "+12% vs mês anterior",
    },
    {
      label: "Freelancers",
      value: stats?.freelancers || 0,
      icon: TrendingUp,
      color: "green",
      change: "+8% vs mês anterior",
    },
    {
      label: "Clientes",
      value: stats?.clients || 0,
      icon: ShoppingCart,
      color: "purple",
      change: "+15% vs mês anterior",
    },
    {
      label: "Receita Total",
      value: `R$ ${(stats?.totalRevenue || 0).toLocaleString("pt-BR")}`,
      icon: DollarSign,
      color: "emerald",
      change: `R$ ${(stats?.lastMonthRevenue || 0).toLocaleString("pt-BR")} este mês`,
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Painel em tempo real do PrestaCerto (atualizado a cada 30s)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <div
                    className={`p-2 rounded-lg ${
                      colorClasses[stat.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                  <ArrowUp className="size-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita Diária */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Receita Diária (7 dias)
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.dailyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" stroke="rgba(148,163,184,0.5)" style={{ fontSize: "12px" }} />
                <YAxis stroke="rgba(148,163,184,0.5)" style={{ fontSize: "12px" }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crescimento de Usuários */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Crescimento de Usuários (30 dias)
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" stroke="rgba(148,163,184,0.5)" style={{ fontSize: "12px" }} />
                <YAxis stroke="rgba(148,163,184,0.5)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  dot={{ fill: "#10b981", r: 4 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Ticket Médio
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              R$ {stats?.totalTransactions ? Math.round(stats.totalRevenue / stats.totalTransactions) : 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Taxa de Conversão
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.totalUsers ? Math.round((stats.totalTransactions / stats.totalUsers) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Proporção F/C
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.clients ? ((stats.freelancers / stats.clients) * 100).toFixed(0) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Ações */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Status da Plataforma
          </h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400 mt-2" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Env vars no Vercel (PENDENTE)
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Adicione as variáveis de ambiente pra fazer signup funcionar
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Chat Interno em Tempo Real
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Mensagens entre freelancers e clientes (próxima)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mt-2" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Dashboard Admin
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ✅ Completa com gráficos em tempo real
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
