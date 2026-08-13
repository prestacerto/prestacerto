"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, CreditCard, Target } from "lucide-react";
import { getRevenueData } from "@/app/actions/revenue";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function RevenueDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRevenueData();
        setTotalRevenue(data.totalRevenue);
        setMonthlyRevenue(data.monthlyRevenue);
        setTodayRevenue(data.todayRevenue);
        setProjectedRevenue(data.projectedRevenue);
        setRecentTransactions(data.transactions.slice(0, 5));
      } catch (error) {
        console.error("Failed to load revenue data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const monthlyRevenueData = [
    { month: "Jan", revenue: 0 },
    { month: "Fev", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Abr", revenue: 0 },
    { month: "Mai", revenue: 0 },
    { month: "Jun", revenue: monthlyRevenue },
  ];

  const revenueByPlan = [
    { name: "Destaque", value: monthlyRevenue * 0.7, count: 2 },
    { name: "Job Alerts", value: 0, count: 0 },
    { name: "Analytics Pro", value: 0, count: 0 },
    { name: "Suporte Prioritário", value: 0, count: 0 },
  ].filter(p => p.value > 0);

  const monthlyGrowth = monthlyRevenue - 0;
  const growthPercentage = monthlyRevenue > 0 ? "100" : "0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Receita</h1>
        <p className="text-muted-foreground">
          Acompanhe seus ganhos em tempo real e projete seu crescimento
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600">+{growthPercentage}% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Desde cadastro</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Projeção (12m)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {projectedRevenue.toFixed(2)}</div>
            <p className="text-xs text-blue-600">Base mês atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend de Receita</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${(value || 0).toFixed(2)}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  name="Receita (R$)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por Plano</CardTitle>
            <CardDescription>Distribuição de ganhos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByPlan.filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R$ ${(value || 0).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {revenueByPlan.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold">
                    R$ {item.value.toFixed(2)} ({item.count}x)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Histórico de pagamentos Mercado Pago</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Carregando transações...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            ) : (
              recentTransactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{tx.plan_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">R$ {Number(tx.amount).toFixed(2)}</span>
                    <Badge
                      variant={tx.status === "approved" ? "default" : "outline"}
                      className={
                        tx.status === "approved"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }
                    >
                      {tx.status === "approved" ? "Aprovado" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-semibold text-sm text-blue-900">🎯 Próximo Passo</p>
              <p className="text-xs text-blue-800 mt-1">
                Ative "Job Alerts Premium" para receber alertas automáticos de novos projetos
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="font-semibold text-sm text-green-900">✅ Performance</p>
              <p className="text-xs text-green-800 mt-1">
                Seu destaque gerou 2 vendas! Taxa de conversão: 100%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <p className="font-semibold text-sm text-orange-900">⚡ Oportunidade</p>
              <p className="text-xs text-orange-800 mt-1">
                Adicione mais 2 planos e quadruplique sua receita projetada
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <span className="text-2xl">1.</span>
              <div>
                <p className="font-semibold text-sm">Renovar Destaque</p>
                <p className="text-xs text-muted-foreground">Seu destaque expira em 15 dias. Renove agora e mantenha momentum</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-2xl">2.</span>
              <div>
                <p className="font-semibold text-sm">Analytics Pro</p>
                <p className="text-xs text-muted-foreground">Ver dados detalhados vai ajudar a otimizar seu ROI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-2xl">3.</span>
              <div>
                <p className="font-semibold text-sm">Programa de Afiliados</p>
                <p className="text-xs text-muted-foreground">Convide amigos e ganhe 10% de comissão por cada conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">🚀 Maximize seus Ganhos</CardTitle>
          <CardDescription className="text-blue-800">
            Combine múltiplos planos para criar uma estratégia de monetização poderosa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
              Ver Loja de Planos
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-semibold">
              Baixar Relatório
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-semibold">
              Falar com Suporte
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
