"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Settings,
  HelpCircle,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function CertoMatchDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "settings" | "help"
  >("overview");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(75);

  // Mock data
  const matchData = [
    { week: "Week 1", matches: 12, applied: 10, won: 3 },
    { week: "Week 2", matches: 15, applied: 12, won: 4 },
    { week: "Week 3", matches: 18, applied: 15, won: 5 },
    { week: "Week 4", matches: 22, applied: 18, won: 6 },
  ];

  const scoreDistribution = [
    { name: "Excellent (90+)", value: 25, color: "#10b981" },
    { name: "Good (75-89)", value: 45, color: "#3b82f6" },
    { name: "Fair (60-74)", value: 20, color: "#f59e0b" },
    { name: "Low (<60)", value: 10, color: "#ef4444" },
  ];

  const winRateByCategory = [
    { category: "Skills Match", rate: 92 },
    { category: "Rate Match", rate: 78 },
    { category: "Experience", rate: 85 },
    { category: "Rating", rate: 88 },
  ];

  const stats = {
    totalMatches: 67,
    totalApplied: 55,
    totalWon: 18,
    winRate: 32.7,
    avgMatchScore: 78.5,
    thisMonthRevenue: 12500,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "settings", label: "Settings", icon: "⚙️" },
              { id: "help", label: "Help", icon: "❓" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as "overview" | "analytics" | "settings" | "help")
                }
                className={`py-4 px-2 border-b-2 transition font-semibold ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🎯 Certo Match — Dashboard
              </h1>
              <p className="text-slate-400">
                IA Matching - Descubra sua chance de ganhar cada projeto
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition">
                <p className="text-slate-400 text-sm mb-2">Total Matches</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalMatches}
                </p>
                <p className="text-green-400 text-xs mt-2">+12 this week</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition">
                <p className="text-slate-400 text-sm mb-2">Applied</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalApplied}
                </p>
                <p className="text-blue-400 text-xs mt-2">
                  {((stats.totalApplied / stats.totalMatches) * 100).toFixed(0)}%
                  conversion
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-green-500 transition">
                <p className="text-slate-400 text-sm mb-2">Won Projects</p>
                <p className="text-3xl font-bold text-green-400">
                  {stats.totalWon}
                </p>
                <p className="text-green-400 text-xs mt-2">
                  {stats.winRate.toFixed(1)}% win rate
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-yellow-500 transition">
                <p className="text-slate-400 text-sm mb-2">Avg Match Score</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {stats.avgMatchScore.toFixed(1)}
                </p>
                <p className="text-yellow-400 text-xs mt-2">out of 100</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500 transition">
                <p className="text-slate-400 text-sm mb-2">This Month</p>
                <p className="text-3xl font-bold text-purple-400">
                  R$ {(stats.thisMonthRevenue / 1000).toFixed(1)}k
                </p>
                <p className="text-purple-400 text-xs mt-2">+25% vs last month</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition">
                <p className="text-slate-400 text-sm mb-2">Active Projects</p>
                <p className="text-3xl font-bold text-indigo-400">8</p>
                <p className="text-indigo-400 text-xs mt-2">In progress</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Match Trend */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  📈 Match Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={matchData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="matches"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="applied"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="won"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Score Distribution */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🎯 Score Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Win Rate by Category */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🏆 Win Rate by Category
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={winRateByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Bar dataKey="rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Matches */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📋 Recent Matches
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "React + Node.js Project",
                    score: 94,
                    status: "won",
                    amount: 8500,
                  },
                  {
                    title: "Next.js Dashboard",
                    score: 88,
                    status: "applied",
                    amount: 5500,
                  },
                  {
                    title: "TypeScript API Development",
                    score: 92,
                    status: "won",
                    amount: 6200,
                  },
                  {
                    title: "Database Migration",
                    score: 71,
                    status: "pending",
                    amount: 3800,
                  },
                ].map((match, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{match.title}</p>
                      <p className="text-slate-400 text-sm">Match Score: {match.score}%</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-semibold">
                        R$ {match.amount.toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          match.status === "won"
                            ? "bg-green-900 text-green-400"
                            : match.status === "applied"
                            ? "bg-blue-900 text-blue-400"
                            : "bg-yellow-900 text-yellow-400"
                        }`}
                      >
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">📊 Detailed Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Over Time */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Performance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Jan", score: 65, wins: 2 },
                      { month: "Feb", score: 70, wins: 3 },
                      { month: "Mar", score: 75, wins: 4 },
                      { month: "Apr", score: 78.5, wins: 6 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="wins"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Performance */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Category Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={winRateByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                      }}
                    />
                    <Bar dataKey="rate" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-400">82.1%</p>
                <p className="text-xs text-slate-500 mt-2">Applied / Matched</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Avg Response Time</p>
                <p className="text-2xl font-bold text-green-400">2.4 hrs</p>
                <p className="text-xs text-slate-500 mt-2">Time to apply</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">32.7%</p>
                <p className="text-xs text-slate-500 mt-2">Applied / Won</p>
              </div>
            </div>

            {/* Top Skills */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🔥 Top Performing Skills
              </h3>
              <div className="space-y-2">
                {[
                  { skill: "React", matches: 24, winRate: 41.7 },
                  { skill: "Node.js", matches: 18, winRate: 38.9 },
                  { skill: "TypeScript", matches: 16, winRate: 37.5 },
                  { skill: "Next.js", matches: 12, winRate: 41.7 },
                ].map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between p-2 bg-slate-700 rounded"
                  >
                    <span className="text-white">{item.skill}</span>
                    <div className="flex gap-4">
                      <span className="text-slate-400 text-sm">
                        {item.matches} matches
                      </span>
                      <span className="text-green-400 font-semibold">
                        {item.winRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>

            {/* Match Preferences */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  📋 Match Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={notificationEnabled}
                        onChange={(e) => setNotificationEnabled(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">
                        Enable Match Notifications
                      </span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Get notified when new high-match projects appear
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={autoApplyEnabled}
                        onChange={(e) => setAutoApplyEnabled(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Auto-Apply to High Matches</span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Automatically apply when match score exceeds minimum
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <label className="block mb-2">
                  <span className="text-white font-semibold">
                    Minimum Match Score
                  </span>
                  <p className="text-slate-400 text-sm">
                    Only consider projects with at least this score
                  </p>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minMatchScore}
                    onChange={(e) => setMinMatchScore(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white font-bold text-lg w-12 text-right">
                    {minMatchScore}%
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Skills Priority</h4>
                <div className="space-y-2">
                  {["React", "Node.js", "TypeScript", "Next.js"].map((skill) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-slate-300">{skill}</span>
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Budget Range</h4>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-slate-400 text-sm">Minimum</label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-slate-400 text-sm">Maximum</label>
                      <input
                        type="number"
                        defaultValue="50000"
                        className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                💾 Save Changes
              </button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition">
                ↩️ Reset to Default
              </button>
            </div>
          </div>
        )}

        {/* HELP TAB */}
        {activeTab === "help" && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-white">❓ Help & Support</h2>

            {/* FAQ */}
            <div className="space-y-4">
              {[
                {
                  q: "Como o Certo Match calcula a compatibilidade?",
                  a: "Certo Match analisa suas skills, taxa horária, histórico de projetos, avaliação e experiência para calcular uma nota de 0-100. Quanto maior a nota, maior sua chance de ganhar o projeto.",
                },
                {
                  q: "O que significa Win Chance?",
                  a: "Win Chance é a probabilidade estimada de você ganhar aquele projeto específico baseado em fatores como score de match, concorrência, e histórico de aplicações similares.",
                },
                {
                  q: "Como posso melhorar meu Match Score?",
                  a: "Você pode melhorar seu match score completando mais projetos, aumentando sua avaliação, atualizando suas skills, e respondendo rapidamente às oportunidades.",
                },
                {
                  q: "Posso usar Auto-Apply com segurança?",
                  a: "Sim! Auto-Apply respeita seus critérios de score mínimo e não envia propostas que não cumprem seus requisitos. Você sempre pode revisar propostas enviadas após o fato.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                      <p className="text-slate-400 text-sm">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>
                  ✅ Responda rapidamente às oportunidades - tempo de resposta é um
                  fator importante
                </li>
                <li>
                  ✅ Mantenha suas skills atualizadas - isso melhora a precisão do
                  matching
                </li>
                <li>
                  ✅ Realize mais projetos e ganhe avaliações para aumentar seu score
                </li>
                <li>
                  ✅ Use o histórico de matches para entender quais projetos são mais
                  lucrativos
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📞 Need Help?
              </h3>
              <p className="text-slate-400 mb-4">
                Se você não encontrou sua resposta acima, entre em contato com nosso
                time de suporte.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                💬 Chat with Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
