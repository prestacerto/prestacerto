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
  AreaChart,
  Area,
} from "recharts";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

export default function CertoTimingDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "settings" | "help"
  >("overview");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [bestTimeStrategy, setBestTimeStrategy] = useState("peak-hours");
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(false);

  // Mock data
  const timingData = [
    { day: "Monday", bestTime: "9:00", winRate: 45, submissions: 8 },
    { day: "Tuesday", bestTime: "10:00", winRate: 52, submissions: 12 },
    { day: "Wednesday", bestTime: "14:00", winRate: 48, submissions: 10 },
    { day: "Thursday", bestTime: "15:00", winRate: 55, submissions: 14 },
    { day: "Friday", bestTime: "11:00", winRate: 38, submissions: 9 },
  ];

  const hourlyPerformance = [
    { hour: "6:00", winRate: 18, traffic: "low" },
    { hour: "8:00", winRate: 32, traffic: "low" },
    { hour: "10:00", winRate: 52, traffic: "high" },
    { hour: "12:00", winRate: 48, traffic: "very-high" },
    { hour: "14:00", winRate: 55, traffic: "very-high" },
    { hour: "16:00", winRate: 42, traffic: "high" },
    { hour: "18:00", winRate: 38, traffic: "medium" },
    { hour: "20:00", winRate: 28, traffic: "low" },
  ];

  const competitionByTime = [
    { time: "Morning", competition: 65, avgPrice: 5200 },
    { time: "Afternoon", competition: 88, avgPrice: 5800 },
    { time: "Evening", competition: 42, avgPrice: 4800 },
  ];

  const stats = {
    optimalSubmitTime: "2:15 PM",
    bestDay: "Thursday",
    avgResponseTime: "2.4 hrs",
    peakWinRate: 55,
    idealBuffer: "15 min",
    submissions: 53,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: "⏰" },
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
                    ? "border-orange-500 text-orange-400"
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
                ⏰ Certo Timing — Dashboard
              </h1>
              <p className="text-slate-400">
                Hora de Ouro - Melhor momento para enviar suas propostas
              </p>
            </div>

            {/* Alert Banner */}
            <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-orange-300 font-semibold">Golden Hour Alert!</p>
                <p className="text-orange-200 text-sm">
                  Best time to submit is in 8 minutes (2:15 PM today). You have 3
                  projects ready to submit.
                </p>
              </div>
              <button className="ml-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-semibold transition">
                Submit Now
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-orange-500 transition">
                <p className="text-slate-400 text-sm mb-2">Optimal Submit</p>
                <p className="text-2xl font-bold text-white">
                  {stats.optimalSubmitTime}
                </p>
                <p className="text-orange-400 text-xs mt-2">Today</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-orange-500 transition">
                <p className="text-slate-400 text-sm mb-2">Best Day</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats.bestDay}
                </p>
                <p className="text-orange-400 text-xs mt-2">55% win rate</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-yellow-500 transition">
                <p className="text-slate-400 text-sm mb-2">Avg Response</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.avgResponseTime}
                </p>
                <p className="text-yellow-400 text-xs mt-2">First response</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-green-500 transition">
                <p className="text-slate-400 text-sm mb-2">Peak Win Rate</p>
                <p className="text-3xl font-bold text-green-400">
                  {stats.peakWinRate}%
                </p>
                <p className="text-green-400 text-xs mt-2">at optimal time</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-purple-500 transition">
                <p className="text-slate-400 text-sm mb-2">Ideal Buffer</p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.idealBuffer}
                </p>
                <p className="text-purple-400 text-xs mt-2">Before best time</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition">
                <p className="text-slate-400 text-sm mb-2">Total Submissions</p>
                <p className="text-3xl font-bold text-indigo-400">
                  {stats.submissions}
                </p>
                <p className="text-indigo-400 text-xs mt-2">This month</p>
              </div>
            </div>

            {/* Hourly Performance Heatmap */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🔥 Hourly Performance Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyPerformance}>
                  <defs>
                    <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="winRate"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorWinRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-slate-400 text-sm mt-4">
                ℹ️ Peak window: 2:00 PM - 4:00 PM (Afternoon peak competition but
                highest win rate)
              </p>
            </div>

            {/* Day Performance */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📅 Day-by-Day Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timingData}>
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
                  <Bar dataKey="winRate" fill="#f97316" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="submissions" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Competition Analysis */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                👥 Competition by Time of Day
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={competitionByTime}>
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
                  <Bar
                    dataKey="competition"
                    fill="#ef4444"
                    name="Competition Level"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="avgPrice"
                    fill="#3b82f6"
                    name="Avg Price (R$)"
                    yAxisId="right"
                    radius={[8, 8, 0, 0]}
                  />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Time Recommendations */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📋 Recommended Submission Times
              </h3>
              <div className="space-y-3">
                {[
                  {
                    day: "Monday",
                    time: "9:00 AM",
                    winRate: 45,
                    competition: "Medium",
                  },
                  {
                    day: "Tuesday",
                    time: "10:00 AM",
                    winRate: 52,
                    competition: "Medium-High",
                  },
                  {
                    day: "Wednesday",
                    time: "2:00 PM",
                    winRate: 48,
                    competition: "Very High",
                  },
                  {
                    day: "Thursday",
                    time: "3:00 PM",
                    winRate: 55,
                    competition: "Very High",
                  },
                  {
                    day: "Friday",
                    time: "11:00 AM",
                    winRate: 38,
                    competition: "High",
                  },
                ].map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{rec.day}</p>
                      <p className="text-slate-400 text-sm">
                        Competition: {rec.competition}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-orange-400 font-bold">{rec.time}</p>
                        <p className="text-green-400 text-xs">
                          {rec.winRate}% win rate
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-semibold transition">
                        Set Reminder
                      </button>
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
            <h2 className="text-3xl font-bold text-white">📊 Timing Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submission Trend */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Submission Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { week: "Week 1", submissions: 8, winRate: 28 },
                      { week: "Week 2", submissions: 12, winRate: 35 },
                      { week: "Week 3", submissions: 15, winRate: 42 },
                      { week: "Week 4", submissions: 18, winRate: 45 },
                    ]}
                  >
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
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="submissions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="winRate"
                      stroke="#f97316"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Response Time Impact */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Response Time Impact
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { timeRange: "0-1h", winRate: 68 },
                      { timeRange: "1-2h", winRate: 55 },
                      { timeRange: "2-4h", winRate: 42 },
                      { timeRange: "4-8h", winRate: 28 },
                      { timeRange: "8-24h", winRate: 15 },
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
                    <Line
                      type="monotone"
                      dataKey="winRate"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Fastest Response</p>
                <p className="text-2xl font-bold text-green-400">45 min</p>
                <p className="text-xs text-slate-500 mt-2">Average in gold hours</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Best Day Advantage</p>
                <p className="text-2xl font-bold text-orange-400">+17%</p>
                <p className="text-xs text-slate-500 mt-2">
                  Thursday vs worst day
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Worst Time Window</p>
                <p className="text-2xl font-bold text-red-400">6:00 PM</p>
                <p className="text-xs text-slate-500 mt-2">18% win rate</p>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>

            {/* Timing Preferences */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  ⏱️ Timing Preferences
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Golden Hour Notifications</span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Get notified 15 minutes before optimal submission time
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={autoSubmitEnabled}
                        onChange={(e) => setAutoSubmitEnabled(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Auto-Submit at Golden Hour</span>
                    </label>
                    <p className="text-slate-400 text-sm ml-7">
                      Automatically submit prepared proposals at optimal time
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <label className="block mb-4">
                  <span className="text-white font-semibold block mb-2">
                    Timing Strategy
                  </span>
                  <p className="text-slate-400 text-sm mb-4">
                    Which strategy should we use?
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        value: "peak-hours",
                        label: "Peak Hours",
                        desc: "Submit when most projects are posted",
                      },
                      {
                        value: "low-competition",
                        label: "Low Competition",
                        desc: "Submit when fewer people are competing",
                      },
                      {
                        value: "balanced",
                        label: "Balanced",
                        desc: "Mix of both strategies",
                      },
                    ].map((option) => (
                      <label key={option.value} className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="strategy"
                          value={option.value}
                          checked={bestTimeStrategy === option.value}
                          onChange={(e) => setBestTimeStrategy(e.target.value)}
                          className="w-4 h-4 mt-1"
                        />
                        <div>
                          <p className="text-slate-300 font-medium">{option.label}</p>
                          <p className="text-slate-500 text-sm">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </label>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Days to Monitor</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label key={day} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-slate-300 text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Time Range Preferences</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-sm">
                      Early Start Time
                    </label>
                    <input
                      type="time"
                      defaultValue="06:00"
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm">
                      Late End Time
                    </label>
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="text-white font-semibold mb-3">Notification Lead Time</h4>
                <select className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600">
                  <option>5 minutes before</option>
                  <option selected>15 minutes before</option>
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition">
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
                  q: "Por que a hora de envio é tão importante?",
                  a: "Estudos mostram que propostas enviadas nos melhores horários têm até 55% de chance de vitória, vs 18% nos piores horários. A hora importa tanto quanto a qualidade da proposta.",
                },
                {
                  q: "O que é a 'Golden Hour'?",
                  a: "A Golden Hour é o melhor momento do dia para enviar suas propostas. Varia por dia da semana, mas geralmente é entre 2-4 PM quando há alto volume de projetos mas timing certo.",
                },
                {
                  q: "Por que o Thursday tem melhor win rate?",
                  a: "No meio da semana, clientes estão mais engajados, há menos propostas urgentes, e é o último dia útil para iniciar projetos. Quinta-feira é equilibrada entre demanda e competição.",
                },
                {
                  q: "Como a 'Auto-Submit' funciona?",
                  a: "Com Auto-Submit habilitado, propostas que você preparou serão enviadas automaticamente na hora recomendada. Você pode revisar o histórico e desativar propostas antes do envio.",
                },
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                      <p className="text-slate-400 text-sm">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>
                  ✅ Prepare propostas com antecedência para poder enviar na golden hour
                </li>
                <li>
                  ✅ Thursday 3 PM é seu melhor momento estatisticamente (55% win rate)
                </li>
                <li>
                  ✅ Responda em menos de 1 hora para máximas chances de ganho
                </li>
                <li>
                  ✅ Use notificações para não perder sua janela de ouro
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📞 Need Help?
              </h3>
              <p className="text-slate-400 mb-4">
                Dúvidas sobre timing strategy? Nosso time pode ajudar.
              </p>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition">
                💬 Chat with Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
