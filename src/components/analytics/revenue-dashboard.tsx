'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

interface RevenueData {
  total_revenue: number;
  connects_revenue: number;
  referral_revenue: number;
  priority_queue_revenue: number;
  business_subs_revenue: number;
  contest_revenue: number;
  ad_revenue: number;
  total_transactions: number;
  active_users: number;
  churn_rate: number;
}

export function RevenueDashboard() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 5000);
    fetchMetrics();
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/revenue');
      if (response.ok) {
        setData(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch revenue metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <div className="animate-pulse h-64 bg-gray-200 rounded" />;

  const metrics = [
    {
      title: 'Receita Total',
      value: `R$ ${(data.total_revenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
    },
    {
      title: 'Conectar/Propostas',
      value: `R$ ${(data.connects_revenue / 100).toFixed(2)}`,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+23%',
    },
    {
      title: 'Usuários Ativos',
      value: data.active_users.toLocaleString(),
      icon: Users,
      color: 'bg-purple-500',
      change: '+8.2%',
    },
    {
      title: 'Transações',
      value: data.total_transactions.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 text-white ${metric.color} p-1 rounded`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-green-600 mt-1">{metric.change} este mês</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita por Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Conectar', value: data.connects_revenue / 100 },
              { name: 'Referrals', value: data.referral_revenue / 100 },
              { name: 'Priority Queue', value: data.priority_queue_revenue / 100 },
              { name: 'Business', value: data.business_subs_revenue / 100 },
              { name: 'Contests', value: data.contest_revenue / 100 },
            ].map((stream) => (
              <div key={stream.name} className="flex justify-between">
                <span className="text-sm">{stream.name}</span>
                <span className="font-semibold">R$ {stream.value.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Meta Mensal</span>
                  <span className="font-semibold">R$ 50.000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((data.total_revenue / 50000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                {Math.round((data.total_revenue / 50000) * 100)}% da meta alcançada
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
