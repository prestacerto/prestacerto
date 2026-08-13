'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, MessageSquare, Link2, Zap, Briefcase, DollarSign, Star, Users } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    proposals: 0,
    projects: 0,
    revenue: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);

        try {
          const { data: proposals } = await supabase
            .from('proposals')
            .select('id')
            .eq('freelancer_id', authUser.id);

          const { data: projects } = await supabase
            .from('projects')
            .select('id')
            .eq('freelancer_id', authUser.id);

          const { data: transactions } = await supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', authUser.id);

          setStats({
            proposals: proposals?.length || 0,
            projects: projects?.length || 0,
            revenue: transactions?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0,
            rating: 4.9,
          });
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const features = [
    { icon: Zap, name: 'Certo AI', desc: 'Otimize propostas', href: '/dashboard/certo-ai', color: 'yellow' },
    { icon: MessageSquare, name: 'Chat', desc: 'Mensagens', href: '/dashboard/messages', color: 'blue' },
    { icon: Link2, name: 'Referrais', desc: 'Ganhe indicações', href: '/dashboard/referral', color: 'green' },
    { icon: TrendingUp, name: 'Receita', desc: 'Analytics', href: '/dashboard/revenue', color: 'purple' },
    { icon: Briefcase, name: 'Projetos', desc: 'Meus projetos', href: '/dashboard/projects', color: 'indigo' },
    { icon: Users, name: 'Clientes', desc: 'Meus clientes', href: '/dashboard/clients', color: 'pink' },
    { icon: Star, name: 'Portfólio', desc: 'Meus trabalhos', href: '/dashboard/portfolio', color: 'orange' },
    { icon: DollarSign, name: 'Planos', desc: 'Premium', href: '/dashboard/plans', color: 'emerald' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Bem-vindo de volta, {user?.email?.split('@')[0]}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Propostas</p>
          <p className="text-3xl font-bold">{stats.proposals}</p>
          <p className="text-xs opacity-75 mt-2">Enviadas este mês</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Projetos</p>
          <p className="text-3xl font-bold">{stats.projects}</p>
          <p className="text-xs opacity-75 mt-2">Ativos</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Faturamento</p>
          <p className="text-3xl font-bold">R$ {(stats.revenue / 1000).toFixed(1)}k</p>
          <p className="text-xs opacity-75 mt-2">Total recebido</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Rating</p>
          <p className="text-3xl font-bold">{stats.rating}★</p>
          <p className="text-xs opacity-75 mt-2">Avaliação média</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Funcionalidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const colorMap: any = {
              yellow: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
              blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
              green: 'text-green-500 bg-green-50 dark:bg-green-900/20',
              purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
              indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
              pink: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20',
              orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
              emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
            };

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 transition"
              >
                <div className={`w-10 h-10 rounded-lg ${colorMap[feature.color]} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold mb-1">{feature.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Próximas Oportunidades</h2>
        <p className="mb-4 opacity-90">Você tem {Math.max(0, 5 - stats.projects)} oportunidades aguardando resposta.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/projects" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition">
            Ver Projetos →
          </Link>
          <Link href="/dashboard/certo-ai" className="border-2 border-white text-white px-6 py-2 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition">
            Usar Certo AI
          </Link>
        </div>
      </div>
    </div>
  );
}
