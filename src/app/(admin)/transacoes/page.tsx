"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, TrendingUp } from "lucide-react";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  type: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
}

export default function TransacoesPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const { data } = await supabase
        .from("payments")
        .select(`
          id,
          user_id,
          amount,
          status,
          type,
          created_at,
          profiles!inner(full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      setPayments(data || []);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.profiles?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "todos" || p.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totalHoje = payments
    .filter((p) => {
      const hoje = new Date();
      const pData = new Date(p.created_at);
      return (
        pData.toDateString() === hoje.toDateString() && p.status === "completed"
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMês = payments
    .filter((p) => {
      const agora = new Date();
      const pData = new Date(p.created_at);
      return (
        pData.getMonth() === agora.getMonth() &&
        pData.getFullYear() === agora.getFullYear() &&
        p.status === "completed"
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const statusLabels = {
    completed: "Concluído",
    pending: "Pendente",
    failed: "Falhou",
    refunded: "Reembolsado",
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    refunded: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Transações
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Histórico de pagamentos e receita
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Receita Hoje
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              R$ {totalHoje.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Receita Este Mês
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              R$ {totalMês.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total de Transações
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {payments.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ml-4 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
            >
              <option value="todos">Todos</option>
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Usuário
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {payment.profiles?.full_name || "—"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {payment.profiles?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {payment.type || "—"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          R$ {payment.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[payment.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[payment.status as keyof typeof statusLabels] || payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(payment.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPayments.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Nenhuma transação encontrada
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
