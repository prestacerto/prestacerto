"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", views: 2400, proposals: 240, conversions: 24 },
  { month: "Fev", views: 3398, proposals: 221, conversions: 29 },
  { month: "Mar", views: 2800, proposals: 229, conversions: 20 },
  { month: "Abr", views: 3908, proposals: 200, conversions: 22 },
  { month: "Mai", views: 4800, proposals: 298, conversions: 29 },
  { month: "Jun", views: 3800, proposals: 208, conversions: 40 },
];

const categoryData = [
  { name: "Web Development", value: 35 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 20 },
  { name: "Consultoria", value: 20 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsProPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Pro</h1>
            <p className="text-muted-foreground">
              Dados detalhados de performance e ROI dos seus serviços
            </p>
          </div>
          <Badge className="bg-green-600">Ativo</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,321</div>
            <p className="text-xs text-green-600">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-green-600">Acima da média (5.3%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4%</div>
            <p className="text-xs text-yellow-600">Alvo: 5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2,847</div>
            <p className="text-xs text-muted-foreground">por mês</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend de Visualizações e Conversões</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="views" stroke="#3b82f6" name="Visualizações" />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" name="Conversões" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Propostas por Categoria</CardTitle>
            <CardDescription>Onde você recebe mais propostas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
            <CardDescription>Dicas para melhorar seu ROI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-semibold text-sm text-blue-900">📈 Aumentar Visibilidade</p>
              <p className="text-xs text-blue-800 mt-1">
                Ative "Destaque" para aparecer no topo das buscas
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-semibold text-sm text-green-900">✅ Otimizar Perfil</p>
              <p className="text-xs text-green-800 mt-1">
                Adicione certificações para aumentar taxa de confiança
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-semibold text-sm text-purple-900">⏱️ Responder Rápido</p>
              <p className="text-xs text-purple-800 mt-1">
                Freelancers que respondem em menos de 1h têm 40% mais conversões
              </p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="font-semibold text-sm text-orange-900">💬 Melhorar Descrição</p>
              <p className="text-xs text-orange-800 mt-1">
                Perfis com descrição completa recebem 3x mais propostas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Relatório</CardTitle>
          <CardDescription>Baixe seus dados de performance em PDF ou CSV</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition">
            📄 Baixar PDF
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition">
            📊 Baixar CSV
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
