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
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";
import { TrendingUp, AlertCircle, DollarSign } from "lucide-react";

export default function CertoPrecoDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "settings" | "help"
  >("overview");
  const [autoAdjustEnabled, setAutoAdjustEnabled] = useState(true);
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [competitorTracking, setCompetitorTracking] = useState(true);

  // Mock data
  const pricingHistory = [
    { week: "Week 1", avgPrice: 4800, winRate: 28, proposals: 12 },
    { week: "Week 2", avgPrice: 5200, winRate: 35, proposals: 18 },
    { week: "Week 3", avgPrice: 5800, winRate: 42, proposals: 25 },
    { week: "Week 4", avgPrice: 6100, winRate: 38, proposals: 28 },
  ];

  const priceVsWinRate = [
    { price: 3000, winRate: 85, competition: "high" },
    { price: 4000, winRate: 72, competition: "high" },
    { price: 5000, winRate: 58, competition: "medium" },
    { price: 6000, winRate: 45, competition: "medium" },
    { price: 7000, winRate: 32, competition: "low" },
    { price: 8000, winRate: 18, competition: "low" },
    { price: 9000, winRate: 8, competition: "low" },
  ];

  const categoryPrices = [
    { category: "Front-End", current: 5200, recommended: 5800, market: 5500 },
    { category: "Back-End", current: 5800, recommended: 6400, market: 6200 },
    { category: "Full-Stack", current: 7200, recommended: 8100, market: 7800 },
    { category: "DevOps", current: 8500, recommended: 9200, market: 8900 },
  ];

  const stats = {
    avgProposalPrice: 5850,
    acceptanceRate: 42,
    monthlyRevenue: 42500,
    optimalPrice: 6100,
    marketAvg: 5900,
    priceAdjustments: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: "💰" },
              { id: "analytics", label: "Analytics", icon: "📊" },
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
                    ? "border-emerald-500 text-emerald-400"
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
                💰 Certo Preço — Dashboard
              </h1>
              <p className="text-slate-400">
                Dynamic Pricing - Recomendação de preço ótimo baseado em IA
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-emerald-500 transition">
                <p className="text-slate-400 text-sm mb-2">Avg Proposal Price</p>
                <p className="text-3xl font-bold text-white">
                  R$ {stats.avgProposalPrice.toLocaleString()}
                </p>
                <p className="text-emerald-400 text-xs mt-2">+5.2% vs last month</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-emerald-500 transition">
                <p className="text-slate-400 text-sm mb-2">Acceptance Rate</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats.acceptanceRate}%
                </p>
                <p className="text-emerald-400 text-xs mt-2">proposals won</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-green-500 transition">
                <p className="text-slate-400 text-sm mb-2">This Month Revenue</p>
                <p className="text-3xl font-bold text-green-400">
                  R$ {(stats.monthlyRevenue / 1000).toFixed(1)}k
                </p>
                <p className="text-green-400 text-xs mt-2">+18% vs last month</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-yellow-500 transition">
                <p className="text-slate-400 text-sm mb-2">Optimal Price</p>
                <p className="text-3xl font-bold text-yellow-400">
                  R$ {stats.optimalPrice.toLocaleString()}
                </p>
                <p className="text-yellow-400 text-xs mt-2">AI recommended</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500 transition">
                <p className="text-slate-400 text-sm mb-2">Market Average</p>
                <p className="text-3xl font-bold text-purple-400">
                  R$ {stats.marketAvg.toLocaleString()}
                </p>
                <p className="text-purple-400 text-xs mt-2">
                  {stats.avgProposalPrice > stats.marketAvg ? "Above" : "Below"}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition">
                <p className="text-slate-400 text-sm mb-2">Adjustments Made</p>
                <p className="text-3xl font-bold text-indigo-400">
                  {stats.priceAdjustments}
                </p>
                <p className="text-indigo-400 text-xs mt-2">this month</p>
              </div>
            </div>

            {/* Pricing Trend */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📈 Pricing Trend & Win Rate
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={pricingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="avgPrice"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="winRate"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Win Rate %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Price vs Win Rate */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🎯 Price vs Win Rate Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="price" stroke="#94a3b8" name="Price (R$)" />
                  <YAxis stroke="#94a3b8" name="Win Rate %" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Scatter
                    name="Projects"
                    data={priceVsWinRate}
                    fill="#10b981"
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-slate-400 text-sm mt-4">
                ℹ️ Sweet spot is around R$ 6.000-6.500 for maximum win rate
              </p>
            </div>

            {/* Category Pricing */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📋 Category Recommendations
              </h3>
              <div className="space-y-4">
                {categoryPrices.map((cat) => (
                  <div key={cat.category} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{cat.category}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          cat.recommended > cat.current
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-green-900 text-green-400"
                        }`}
                      >
                        {cat.recommended > cat.current ? "↑ Increase" : "↓ Lower"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">Your Current</p>
                        <p className="text-white font-bold">
                          R$ {cat.current.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">AI Recommended</p>
                        <p className="text-emerald-400 font-bold">
                          R$ {cat.recommended.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Market Avg</p>
                        <p className="text-slate-300">
                          R$ {cat.market.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 bg-slate-800 rounded p-2 flex gap-2">
                      <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded transition">
                        Update
                      </button>
                      <button className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold py-2 rounded transition">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Proposals */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📨 Recent Proposals
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "React Dashboard",
                    price: 6500,
                    status: "won",
                    margin: "High",
                  },
                  {
                    title: "API Development",
                    price: 5800,
                    status: "pending",
                    margin: "Medium",
                  },
                  {
                    title: "E-commerce Site",
                    price: 7200,
                    status: "won",
                    margin: "High",
                  },
                  {
                    title: "Mobile App",
                    price: 4500,
                    status: "rejected",
                    margin: "Low",
                  },
                ].map((prop, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{prop.title}</p>
                      <p className="text-slate-400 text-sm">
                        Margin: {prop.margin}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-bold">
                        R$ {prop.price.toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prop.status === "won"
                            ? "bg-green-900 text-green-400"
                            : prop.status === "pending"
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-red-900 text-red-400"
                        }`}
                      >
                        {prop.status.toUpperCase()}
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
            <h2 className="text-3xl font-bold text-white">📊 Pricing Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Elasticity */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Price Elasticity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { pricePoint: "3k", demand: 95, revenue: 285 },
                      { pricePoint: "5k", demand: 65, revenue: 325 },
                      { pricePoint: "7k", demand: 35, revenue: 245 },
                      { pricePoint: "9k", demand: 15, revenue: 135 },
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
                      dataKey="demand"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Demand %"
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Revenue (k)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Competitor Prices */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Competitor Benchmark
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        competitor: "You",
                        price: 5850,
                        fill: "#10b981",
                      },
                      {
                        competitor: "Comp A",
                        price: 5200,
                        fill: "#94a3b8",
                      },
                      {
                        competitor: "Comp B",
                        price: 6100,
                        fill: "#94a3b8",
                      },
                      {
                        competitor: "Comp C",
                        price: 5400,
                        fill: "#94a3b8",
                      },
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
                    <Bar dataKey="price" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Price Variance</p>
                <p className="text-2xl font-bold text-blue-400">±15%</p>
                <p className="text-xs text-slate-500 mt-2">Fluctuation range</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Optimal Margin</p>
                <p className="text-2xl font-bold text-green-400">28.5%</p>
                <p className="text-xs text-slate-500 mt-2">Current vs market</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Revenue Impact</p>
                <p className="text-2xl font-bold text-purple-400">+22%</p>
                <p className="text-xs text-slate-500 mt-2">vs recommended pricing</p>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>

            {/* Pricing Strategy */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  💼 Pricing Strategy
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={autoAdjustEnabled}
                        onChange={(e) => setAutoAdjustEnabled(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">AI Auto-Adjust Pricing</span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Automatically adjust prices based on market demand and
                      competition
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={competitorTracking}
                        onChange={(e) => setCompetitorTracking(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">
                        Track Competitor Prices
                      </span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Monitor competitor pricing and get alerts when you're
                      significantly above/below market
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <label className="block mb-4">
                  <span className="text-white font-semibold block mb-2">
                    Risk Tolerance
                  </span>
                  <p className="text-slate-400 text-sm mb-4">
                    How aggressive should pricing adjustments be?
                  </p>
                  <div className="space-y-2">
                    {[
                      { value: "conservative", label: "Conservative" },
                      { value: "medium", label: "Medium" },
                      { value: "aggressive", label: "Aggressive" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="risk"
                          value={option.value}
                          checked={riskTolerance === option.value}
                          onChange={(e) => setRiskTolerance(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Base Rates by Category</h4>
                <div className="space-y-3">
                  {["Front-End", "Back-End", "Full-Stack", "DevOps"].map((cat) => (
                    <div key={cat} className="flex items-center gap-2">
                      <label className="text-slate-300 w-24">{cat}</label>
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue="5200"
                          className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 text-sm"
                        />
                        <span className="text-slate-400">/project</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">
                  Adjustment Limits
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm">
                      Max Increase per Week: ±10%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      defaultValue="10"
                      className="w-full mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">
                      Min Price Floor: R$ 3.000
                    </label>
                    <input
                      type="number"
                      defaultValue="3000"
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">
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
                  q: "Como o Certo Preço determina o preço recomendado?",
                  a: "Nossa IA analisa dados de mercado, sua experiência, histórico de vitórias, tempo de resposta e concorrência para recomendar um preço que maximize suas chances de ganhar mantendo uma boa margem.",
                },
                {
                  q: "Qual é a diferença entre preço recomendado e meu preço atual?",
                  a: "O preço recomendado é baseado em análise de mercado em tempo real. Se você está cobrando menos, pode estar perdendo receita. Se está cobrando mais, pode estar perdendo oportunidades.",
                },
                {
                  q: "Como funciona o Auto-Adjust?",
                  a: "Com Auto-Adjust habilitado, o sistema ajusta seus preços gradualmente com base em mudanças de demanda, competição e seu histórico de vitórias. Você sempre pode revisar e aprovar antes das mudanças.",
                },
                {
                  q: "Posso desabilitar o AI para controlar meus preços manualmente?",
                  a: "Sim! Você pode desabilitar o Auto-Adjust a qualquer momento e controlar todos os preços manualmente. As recomendações ainda estarão disponíveis como referência.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                      <p className="text-slate-400 text-sm">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>
                  ✅ Acompanhe regularmente o preço recomendado e ajuste conforme
                  necessário
                </li>
                <li>
                  ✅ Use as recomendações por categoria para manter consistência nos
                  preços
                </li>
                <li>
                  ✅ Análise de concorrência ajuda a entender se você está competitivo
                </li>
                <li>
                  ✅ Aumentos graduais funcionam melhor que grandes mudanças repentinas
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📞 Need Help?
              </h3>
              <p className="text-slate-400 mb-4">
                Dúvidas sobre pricing strategy? Fale com nosso especialista.
              </p>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">
                💬 Chat with Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
