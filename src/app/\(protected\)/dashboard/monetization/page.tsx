"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TrendingUp,
  Zap,
  Users,
  DollarSign,
  Lock,
  Rocket,
  Star,
  Target,
  Award,
  BookOpen,
  Radio,
  Code,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const MONETIZATION_FEATURES = [
  {
    id: "conectar",
    name: "Conectar/Propostas Limitadas",
    description: "Limite de propostas por mês",
    revenue: "R$ 600k/ano",
    icon: Zap,
    status: "active",
    tiers: ["Free (5)", "Pro (50)", "Business (∞)"],
    color: "#f59e0b",
  },
  {
    id: "priority-queue",
    name: "Priority Queue",
    description: "Fila prioritária (Gold/Platinum/Diamond)",
    revenue: "R$ 150k/ano",
    icon: Rocket,
    status: "active",
    tiers: ["Gold R$15.90/3d", "Platinum R$25.90/7d", "Diamond R$40.90/14d"],
    color: "#8b5cf6",
  },
  {
    id: "contests",
    name: "Contests & Desafios",
    description: "25-40% comissão em prêmios",
    revenue: "R$ 350k/ano",
    icon: Target,
    status: "active",
    tiers: ["25% base", "35% volume", "40% premium"],
    color: "#ec4899",
  },
  {
    id: "business-premium",
    name: "Business Premium",
    description: "R$299.90/mês + R$50 por seat",
    revenue: "R$ 400k/ano",
    icon: Award,
    status: "active",
    tiers: ["Até 5 membros", "Analytics avançada"],
    color: "#6366f1",
  },
  {
    id: "referral",
    name: "Programa de Referral",
    description: "10% lifetime commission",
    revenue: "R$ 300k/ano",
    icon: Users,
    status: "active",
    tiers: ["10% referrals", "Sem limite"],
    color: "#10b981",
  },
  {
    id: "courses",
    name: "Marketplace de Cursos",
    description: "30-50% comissão",
    revenue: "R$ 200k/ano",
    icon: BookOpen,
    status: "active",
    tiers: ["30-50% split"],
    color: "#f97316",
  },
  {
    id: "webinars",
    name: "Webinars & Eventos",
    description: "Registro + revenue share",
    revenue: "R$ 100k/ano",
    icon: Radio,
    status: "active",
    tiers: ["Pay-per-view", "Subscriptions"],
    color: "#ef4444",
  },
  {
    id: "api-enterprise",
    name: "API Enterprise",
    description: "Planos de API premium",
    revenue: "R$ 250k/ano",
    icon: Code,
    status: "active",
    tiers: ["Starter", "Pro", "Enterprise"],
    color: "#3b82f6",
  },
  {
    id: "ads",
    name: "Publicidade (Ads)",
    description: "Banner + Feed + Sidebar",
    revenue: "R$ 200k/ano",
    icon: AlertCircle,
    status: "planning",
    tiers: ["Banner Top", "Feed Cards", "Sidebar"],
    color: "#a855f7",
  },
  {
    id: "whitelabel",
    name: "White Label",
    description: "Domínio customizado + branding",
    revenue: "R$ 400k/ano",
    icon: Lock,
    status: "planning",
    tiers: ["Custom domain", "Full branding"],
    color: "#14b8a6",
  },
  {
    id: "escrow",
    name: "Escrow & Proteção",
    description: "2-3% taxa de holding",
    revenue: "R$ 300k/ano",
    icon: DollarSign,
    status: "planning",
    tiers: ["2-3% fee", "Proteção total"],
    color: "#e11d48",
  },
  {
    id: "featured",
    name: "Projetos Destaque",
    description: "R$50 por 7 dias",
    revenue: "R$ 150k/ano",
    icon: Star,
    status: "active",
    tiers: ["R$50/7 dias"],
    color: "#06b6d4",
  },
  {
    id: "verified-badge",
    name: "Badge Verificado",
    description: "R$5/mês na profile",
    revenue: "R$ 80k/ano",
    icon: CheckCircle,
    status: "active",
    tiers: ["R$5/mês"],
    color: "#22c55e",
  },
  {
    id: "portfolio-premium",
    name: "Portfolio Premium",
    description: "R$10/mês + analytics",
    revenue: "R$ 120k/ano",
    icon: TrendingUp,
    status: "active",
    tiers: ["R$10/mês", "Analytics"],
    color: "#f43f5e",
  },
  {
    id: "certifications",
    name: "Certificações",
    description: "Emissão + validação",
    revenue: "R$ 80k/ano",
    icon: Award,
    status: "planning",
    tiers: ["Emissão", "Validação"],
    color: "#8b5cf6",
  },
  {
    id: "marketplace-tools",
    name: "Marketplace Tools",
    description: "Ferramentas avançadas",
    revenue: "R$ 50k/ano",
    icon: Zap,
    status: "planning",
    tiers: ["Bulk tools", "Automação"],
    color: "#facc15",
  },
];

const chartData = [
  { month: "Jan", revenue: 180000, users: 240, conversion: 24 },
  { month: "Fev", revenue: 200000, users: 280, conversion: 27 },
  { month: "Mar", revenue: 220000, users: 320, conversion: 29 },
  { month: "Abr", revenue: 250000, users: 380, conversion: 31 },
  { month: "Mai", revenue: 280000, users: 450, conversion: 33 },
  { month: "Jun", revenue: 320000, users: 520, conversion: 36 },
];

const featureStats = [
  { name: "Conectar", value: 280000, fill: "#f59e0b" },
  { name: "Business", value: 200000, fill: "#6366f1" },
  { name: "Contests", value: 175000, fill: "#ec4899" },
  { name: "Referral", value: 150000, fill: "#10b981" },
  { name: "Outros", value: 215000, fill: "#a0aec0" },
];

export default function MonetizationDashboard() {
  const [activeFeatures, setActiveFeatures] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState("R$ 1.02M");
  const [monthlyGrowth, setMonthlyGrowth] = useState("+12.5%");

  useEffect(() => {
    const active = MONETIZATION_FEATURES.filter((f) => f.status === "active").length;
    setActiveFeatures(active);
  }, []);

  const activeCount = MONETIZATION_FEATURES.filter((f) => f.status === "active").length;
  const planningCount = MONETIZATION_FEATURES.filter((f) => f.status === "planning").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">💰 Centro de Monetização</h1>
        <p className="text-slate-600 mt-2">16 features gerando R$ 4.2M+/ano</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600">Receita Anual</p>
                <p className="text-3xl font-bold text-green-600 mt-2">R$ 4.2M+</p>
                <p className="text-xs text-green-600 mt-1">Projetado</p>
              </div>
              <DollarSign className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600">Features Ativas</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{activeCount}/16</p>
                <p className="text-xs text-blue-600 mt-1">{planningCount} em planejamento</p>
              </div>
              <Zap className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600">Crescimento Mês</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{monthlyGrowth}</p>
                <p className="text-xs text-purple-600 mt-1">vs mês anterior</p>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-600">Taxa Conversão</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">3.8%</p>
                <p className="text-xs text-orange-600 mt-1">Média plataforma</p>
              </div>
              <Target className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Receita (R$)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Feature */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Receita por Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={featureStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} R$${(value / 1000).toFixed(0)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Feature Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🎁 16 Features de Monetização</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {}}
            >
              Todas ({activeCount + planningCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {}}
            >
              Ativas ({activeCount})
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MONETIZATION_FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isActive = feature.status === "active";

            return (
              <Card
                key={feature.id}
                className={`relative overflow-hidden transition-all ${
                  isActive
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                    : "border-slate-200 bg-slate-50 opacity-75"
                }`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                    style={{ backgroundColor: feature.color }}
                  />
                )}

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: `${feature.color}20`,
                        }}
                      >
                        <Icon size={20} style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{feature.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="text-green-600">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Receita Anual</p>
                    <p className="font-bold text-lg">{feature.revenue}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-2">Tiers/Planos</p>
                    <div className="flex flex-wrap gap-1">
                      {feature.tiers.map((tier, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-white border"
                          style={{
                            borderColor: `${feature.color}40`,
                            color: feature.color,
                          }}
                        >
                          {tier}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isActive && (
                    <Button size="sm" className="w-full mt-2" variant="outline">
                      Ver Analytics <ChevronRight size={14} className="ml-1" />
                    </Button>
                  )}

                  {!isActive && (
                    <Button size="sm" className="w-full mt-2" variant="secondary">
                      Em Breve
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">💡 Recomendações de Up-sell</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex-shrink-0">
              <Rocket className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">Priority Queue é sua maior oportunidade</p>
              <p className="text-sm text-slate-600 mt-1">
                Apenas 8% dos seus freelancers usam. Implementar A/B test de notificação
                poderia aumentar em 25-40%.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex-shrink-0">
              <Target className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">Contests cresceu 45% no mês</p>
              <p className="text-sm text-slate-600 mt-1">
                Feature mais promissora. Foco em marketing = R$500k+ no próximo trimestre.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="flex-shrink-0">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-semibold text-sm">Referral Program tá dormindo</p>
              <p className="text-sm text-slate-600 mt-1">
                Apenas 2% engagement. Criar "Referral Bonuses" poderia gerar +R$100k/ano.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🗺️ Próximas Features (Roadmap)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MONETIZATION_FEATURES.filter((f) => f.status === "planning").map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-slate-400" />
                  <div>
                    <p className="font-semibold text-sm">{feature.name}</p>
                    <p className="text-xs text-slate-500">{feature.revenue}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Agendar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex gap-3 flex-wrap">
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          📊 Ver Todas as Analytics
        </Button>
        <Button size="lg" variant="outline">
          📈 Exportar Relatório
        </Button>
        <Button size="lg" variant="outline">
          ⚙️ Configurar Features
        </Button>
      </div>
    </div>
  );
}
