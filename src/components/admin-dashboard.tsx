"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, DollarSign, Activity, LogOut, LogIn } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 2000, subscriptions: 1200, features: 500, partners: 300 },
  { month: "Feb", revenue: 5500, subscriptions: 3000, features: 1500, partners: 1000 },
  { month: "Mar", revenue: 12000, subscriptions: 7000, features: 3000, partners: 2000 },
  { month: "Apr", revenue: 18500, subscriptions: 10000, features: 5000, partners: 3500 },
  { month: "May", revenue: 24000, subscriptions: 13000, features: 7000, partners: 4000 },
  { month: "Jun", revenue: 32000, subscriptions: 17000, features: 10000, partners: 5000 },
];

const userGrowth = [
  { month: "Jan", total: 150, active: 120, new: 45, churn: 5 },
  { month: "Feb", total: 380, active: 310, new: 230, churn: 12 },
  { month: "Mar", total: 820, active: 680, new: 440, churn: 18 },
  { month: "Apr", total: 1420, active: 1180, new: 600, churn: 22 },
  { month: "May", total: 2100, active: 1750, new: 680, churn: 28 },
  { month: "Jun", total: 3050, active: 2540, new: 950, churn: 35 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export function AdminDashboard() {
  const metrics = [
    {
      label: "Faturamento Total",
      value: "R$ 93.5k",
      change: "+33%",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Usuários Ativos",
      value: "2,540",
      change: "+45%",
      icon: Users,
      color: "blue",
    },
    {
      label: "MRR (Receita Mensal)",
      value: "R$ 32k",
      change: "+33%",
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Churn Rate",
      value: "1.2%",
      change: "-0.3%",
      icon: LogOut,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            📊 Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Métricas e faturamento da plataforma
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`size-6 text-${metric.color}-600`} />
                  <span className={`text-xs font-bold ${
                    metric.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              💰 Faturamento Mensal
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="subscriptions" fill="#3b82f6" name="Assinaturas" />
                <Bar dataKey="features" fill="#8b5cf6" name="Features Premium" />
                <Bar dataKey="partners" fill="#ec4899" name="Partners" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              👥 Crescimento de Usuários
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Ativos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn & Retention */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Churn Rate */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              📉 Churn Rate Mensal
            </h2>
            <div className="space-y-4">
              {userGrowth.slice(-3).map((month) => (
                <div key={month.month}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {month.month}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {((month.churn / month.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${(month.churn / month.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Sources */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              💵 Fontes de Receita (Junho)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Assinaturas", value: 17000 },
                    { name: "Features", value: 10000 },
                    { name: "Partners", value: 5000 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: R$ ${(value / 1000).toFixed(0)}k`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-green-900 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300">Entrada de Clientes</p>
            <p className="text-3xl font-bold text-green-600 mt-2">+950</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">este mês</p>
          </div>

          <div className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-red-900 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300">Saídas de Clientes</p>
            <p className="text-3xl font-bold text-red-600 mt-2">-35</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">este mês (1.2% churn)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">12.4%</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Free → Paid</p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 rounded-lg p-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">Lifetime Value (LTV)</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">R$ 1,240</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">por usuário</p>
          </div>
        </div>
      </div>
    </div>
  );
}
