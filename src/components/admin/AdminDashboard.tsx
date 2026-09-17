'use client';

export function AdminDashboard() {
  // Mock data - conectar com APIs depois
  const metrics = {
    totalUsers: 1250,
    totalFreelancers: 890,
    totalClients: 360,
    totalTransactions: 3450,
    totalRevenue: 145000,
    monthlyRevenue: 28500,
    acceptedProposals: 892,
    rejectedProposals: 1245,
    avgResponseTime: 4.2,
    platformFee: 0.10, // 10%
  };

  const topFreelancers = [
    { name: 'João Silva', projects: 45, revenue: 8500, rating: 4.9 },
    { name: 'Maria Santos', projects: 38, revenue: 7200, rating: 4.8 },
    { name: 'Carlos Dev', projects: 35, revenue: 6800, rating: 4.7 },
    { name: 'Ana Costa', projects: 32, revenue: 5900, rating: 4.6 },
    { name: 'Pedro Tech', projects: 28, revenue: 5100, rating: 4.5 },
  ];

  const growth = {
    users: 12.5,
    transactions: 8.3,
    revenue: 15.2,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral da plataforma</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Faturamento Total</p>
          <p className="text-3xl font-bold">R$ {(metrics.totalRevenue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-green-600 dark:text-green-400">↑ {growth.revenue}% mês</p>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Faturamento Este Mês</p>
          <p className="text-3xl font-bold">R$ {(metrics.monthlyRevenue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Sua comissão: R$ {((metrics.monthlyRevenue * metrics.platformFee) / 1000).toFixed(1)}k</p>
        </div>

        {/* Total Users */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
          <p className="text-3xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-green-600 dark:text-green-400">↑ {growth.users}% mês</p>
        </div>

        {/* Accepted Proposals */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Projetos Aceitos</p>
          <p className="text-3xl font-bold">{metrics.acceptedProposals.toLocaleString()}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400">Taxa: {((metrics.acceptedProposals / (metrics.acceptedProposals + metrics.rejectedProposals)) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Freelancers</h3>
          <p className="mt-2 text-2xl font-bold">{metrics.totalFreelancers.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{((metrics.totalFreelancers / metrics.totalUsers) * 100).toFixed(1)}% do total</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Clientes</h3>
          <p className="mt-2 text-2xl font-bold">{metrics.totalClients.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{((metrics.totalClients / metrics.totalUsers) * 100).toFixed(1)}% do total</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Transações</h3>
          <p className="mt-2 text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</p>
          <p className="text-xs text-gray-500">↑ {growth.transactions}% mês</p>
        </div>
      </div>

      {/* Top Freelancers */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Top 5 Freelancers</h2>
        <div className="space-y-3">
          {topFreelancers.map((freelancer, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex-1">
                <p className="font-semibold">{freelancer.name}</p>
                <p className="text-xs text-gray-500">{freelancer.projects} projetos • ⭐ {freelancer.rating}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">R$ {freelancer.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">Comissão: R$ {((freelancer.revenue * 0.1) / 1000).toFixed(1)}k</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold">Tempo Médio de Resposta</h3>
          <p className="text-3xl font-bold">{metrics.avgResponseTime}h</p>
          <p className="text-xs text-green-600 dark:text-green-400">Excelente ✓</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-semibold">Taxa de Aceitação</h3>
          <p className="text-3xl font-bold">{((metrics.acceptedProposals / (metrics.acceptedProposals + metrics.rejectedProposals)) * 100).toFixed(1)}%</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">Acima da média</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Análise de Receita</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Receita Bruta (Freelancers)</span>
              <span className="font-bold">R$ {(metrics.totalRevenue / 1.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 w-full rounded-full bg-blue-500" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Sua Comissão (10%)</span>
              <span className="font-bold">R$ {(metrics.totalRevenue / 10).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
