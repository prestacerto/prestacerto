import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, Filter, BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";

export const metadata = { title: "Relatórios — Admin Dashboard" };

export default async function ReportsPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.email !== "finaltest@prestacerto.com.br") {
    redirect("/");
  }

  const periods = [
    { label: "Hoje", value: "today", icon: "📅" },
    { label: "Esta Semana", value: "week", icon: "📊" },
    { label: "Este Mês", value: "month", icon: "📈" },
    { label: "Trimestre", value: "quarter", icon: "📉" },
    { label: "Este Ano", value: "year", icon: "🎯" },
    { label: "Customizado", value: "custom", icon: "⚙️" },
  ];

  const reportTypes = [
    {
      title: "Relatório de Receita",
      description: "Análise detalhada de faturamento por período",
      metrics: ["Total", "Crescimento", "Ticket médio"],
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Relatório de Usuários",
      description: "Crescimento e análise de usuários",
      metrics: ["Novos usuários", "Ativos", "Churn"],
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Relatório de Projetos",
      description: "Análise de projetos completados",
      metrics: ["Total", "Rentabilidade", "Tempo médio"],
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: "Relatório de Performance",
      description: "KPIs e métricas de crescimento",
      metrics: ["Conversão", "Retention", "LTV"],
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white">📊 Relatórios Avançados</h1>
          <p className="text-slate-400 mt-2">Análises completas do seu negócio por período</p>
        </div>

        {/* Period Selector */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Selecione o Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {periods.map((period) => (
                <button
                  key={period.value}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition border border-slate-600 hover:border-slate-500"
                >
                  <span className="text-2xl">{period.icon}</span>
                  <span className="text-sm font-semibold text-slate-300">{period.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📋 Tipos de Relatório</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.title} className="bg-slate-800/50 border-slate-700 hover:border-slate-500 transition cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-blue-400">{report.icon}</div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 mb-4">{report.description}</p>
                  <div className="space-y-2 mb-4">
                    {report.metrics.map((metric) => (
                      <div key={metric} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {metric}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm">
                    Gerar Relatório
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Categoria</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  <option>Todas as categorias</option>
                  <option>Desenvolvimento</option>
                  <option>Design</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Status</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  <option>Todos os status</option>
                  <option>Completo</option>
                  <option>Em andamento</option>
                  <option>Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Freelancer</label>
                <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  <option>Todos os freelancers</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gerar Relatório
              </button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">📚 Relatórios Recentes</h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {["Receita - Agosto 2026", "Usuários - Agosto 2026", "Performance - Julho 2026"].map(
                  (report) => (
                    <div
                      key={report}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
                    >
                      <span className="font-semibold text-slate-300">{report}</span>
                      <button className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Baixar
                      </button>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
