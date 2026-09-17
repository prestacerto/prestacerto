"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, DollarSign, Zap } from "lucide-react";

const proposalData = [
  { month: "Jan", sent: 12, accepted: 3, rate: 25 },
  { month: "Feb", sent: 15, accepted: 5, rate: 33 },
  { month: "Mar", sent: 18, accepted: 7, rate: 39 },
  { month: "Apr", sent: 22, accepted: 9, rate: 41 },
  { month: "May", sent: 20, accepted: 8, rate: 40 },
  { month: "Jun", sent: 25, accepted: 11, rate: 44 },
];

const earningsData = [
  { month: "Jan", earned: 5000 },
  { month: "Feb", earned: 8500 },
  { month: "Mar", earned: 12000 },
  { month: "Apr", earned: 15500 },
  { month: "May", earned: 14000 },
  { month: "Jun", earned: 18500 },
];

const categoryPerformance = [
  { name: "Web Dev", value: 45 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 20 },
  { name: "Outros", value: 10 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export function PremiumAnalytics() {
  const metrics = [
    {
      label: "Taxa de Aceitação",
      value: "44%",
      change: "+19%",
      icon: Target,
      color: "blue",
    },
    {
      label: "Faturamento Médio",
      value: "R$ 13.2k",
      change: "+270%",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "ROI por Proposta",
      value: "3.2x",
      change: "+45%",
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Tempo Resposta",
      value: "2.1h",
      change: "-35%",
      icon: Zap,
      color: "amber",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          📊 Premium Analytics
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Dados em tempo real para aumentar seus ganhos
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`size-6 text-${metric.color}-600`} />
                <span className="text-xs font-bold text-green-600">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Win Rate Trend */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            📈 Taxa de Aceitação Histórica
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={proposalData}>
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
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            ✨ Sua taxa subiu 19% em 6 meses! Continue com as mesmas práticas.
          </p>
        </div>

        {/* Earnings Trend */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            💰 Faturamento Mensal
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
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
              <Bar dataKey="earned" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            🎯 Crescimento de +270% YoY! Parabéns!
          </p>
        </div>
      </div>

      {/* Proposal Stats & Category Breakdown */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Proposal Funnel */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            🎯 Funil de Propostas
          </h3>
          <div className="space-y-4">
            {proposalData.slice(-1).map((month) => (
              <div key={month.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Enviadas
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {month.sent}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="flex items-center justify-between mb-2 mt-4">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Aceitas
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {month.accepted}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(month.accepted / month.sent) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  Taxa de conversão: <strong>{month.rate}%</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            💼 Ganhos por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* Recommendations */}
      <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-6">
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-3">
          💡 Recomendações Personalizadas
        </h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-amber-800 dark:text-amber-200">
            <span>✅</span>
            <span>
              Você é forte em <strong>Web Development</strong> - aumente o preço em +15% e concentre-se nessa categoria
            </span>
          </li>
          <li className="flex gap-2 text-amber-800 dark:text-amber-200">
            <span>✅</span>
            <span>
              Sua taxa de resposta (2.1h) é <strong>35% melhor que a média</strong> - mencione isso nas propostas
            </span>
          </li>
          <li className="flex gap-2 text-amber-800 dark:text-amber-200">
            <span>✅</span>
            <span>
              <strong>Design</strong> tem potencial de crescimento - considere oferecer pacotes de Web Dev + Design
            </span>
          </li>
        </ul>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">🚀 Desbloqueie Análises Completas</h3>
        <p className="mb-6 text-blue-100">
          Forecasting, benchmark com peers, insights de mercado
        </p>
        <p className="text-3xl font-bold mb-4">R$ 29/mês</p>
        <button className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors">
          Ativar Premium Analytics
        </button>
      </div>
    </div>
  );
}
