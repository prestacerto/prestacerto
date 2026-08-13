'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, DollarSign, Calendar, BarChart3 } from 'lucide-react';

export default function RevenuePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totals, setTotals] = useState({ total: 0, month: 0, week: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        setTransactions(data || []);

        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const total = data?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
        const month = data?.filter((t: any) => new Date(t.created_at) >= monthAgo).reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
        const week = data?.filter((t: any) => new Date(t.created_at) >= weekAgo).reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;

        setTotals({ total, month, week });
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div><p>Carregando...</p></div></div>;
  }

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Receita & Analytics</h1>
        <p className="text-gray-600">Acompanhe seus ganhos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Recebido</p>
          <p className="text-3xl font-bold">R$ {(totals.total / 1000).toFixed(2)}k</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Este Mês</p>
          <p className="text-3xl font-bold">R$ {(totals.month / 1000).toFixed(2)}k</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Esta Semana</p>
          <p className="text-3xl font-bold">R$ {(totals.week / 1000).toFixed(2)}k</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Histórico de Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{new Date(t.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-3 text-sm">{t.description || 'Transferência'}</td>
                    <td className="px-6 py-3 text-sm font-bold text-emerald-600">R$ {(t.amount / 100).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm"><span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">Pago</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhuma transação encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
