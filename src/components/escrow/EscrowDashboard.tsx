'use client';

import { useEffect, useState } from 'react';

interface EscrowTransaction {
  id: string;
  project_id: string;
  client_id: string;
  freelancer_id: string;
  amount: number;
  status: 'pending' | 'locked' | 'released' | 'disputed';
  created_at: string;
  released_at?: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  completion_date?: string;
}

export function EscrowDashboard() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLocked, setTotalLocked] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/escrow/transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);

      const locked = data.transactions
        .filter((t: EscrowTransaction) => t.status === 'locked')
        .reduce((sum: number, t: EscrowTransaction) => sum + t.amount, 0);

      setTotalLocked(locked);
    } catch (error) {
      console.error('Failed to fetch escrow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">
          <p className="text-sm opacity-90">Valor em Escrow</p>
          <p className="text-3xl font-bold">R$ {(totalLocked / 100).toFixed(2)}</p>
          <p className="mt-2 text-xs opacity-75">Protegido automaticamente</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white">
          <p className="text-sm opacity-90">Transações Ativas</p>
          <p className="text-3xl font-bold">
            {transactions.filter((t) => t.status !== 'released').length}
          </p>
          <p className="mt-2 text-xs opacity-75">Em andamento ou aprovadas</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white">
          <p className="text-sm opacity-90">Taxa (PrestaCerto)</p>
          <p className="text-3xl font-bold">5%</p>
          <p className="mt-2 text-xs opacity-75">3% cliente + 2% freelancer</p>
        </div>
      </div>

      {/* Active Transactions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">Transações Ativas</h2>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-lg border border-gray-100 p-4 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold">Projeto #{transaction.project_id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    R$ {(transaction.amount / 100).toFixed(2)} · {transaction.milestones.length} milestones
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    transaction.status === 'locked'
                      ? 'bg-yellow-100 text-yellow-800'
                      : transaction.status === 'released'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {transaction.status === 'locked' ? '🔒 Liberado' : '⏳ Aguardando'}
                </span>
              </div>

              {/* Milestones Progress */}
              <div className="mt-3 space-y-2">
                {transaction.milestones.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">{m.title}</span>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-1.5 rounded-full ${
                            m.status === 'approved'
                              ? 'bg-green-500'
                              : m.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-gray-400'
                          }`}
                          style={{
                            width:
                              m.status === 'approved'
                                ? '100%'
                                : m.status === 'rejected'
                                  ? '0%'
                                  : '50%',
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">R$ {(m.amount / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {transaction.status === 'locked' && (
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">
                    ✓ Aprovar & Liberar
                  </button>
                  <button className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20">
                    ⚠️ Disputar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How Escrow Works */}
      <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20">
        <h3 className="mb-3 font-bold text-blue-900 dark:text-blue-200">🔒 Como Funciona o Escrow?</h3>
        <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>
            <strong>1. Cliente deposita:</strong> Paga projeto + 3% de taxa de proteção
          </li>
          <li>
            <strong>2. PrestaCerto guarda:</strong> Valor fica seguro em nossa conta
          </li>
          <li>
            <strong>3. Freelancer trabalha:</strong> Sabe que o dinheiro está garantido
          </li>
          <li>
            <strong>4. Cliente aprova:</strong> Verifica qualidade do trabalho
          </li>
          <li>
            <strong>5. PrestaCerto libera:</strong> Freelancer recebe (menos 2% de taxa)
          </li>
          <li>
            <strong>6. Se houver disputa:</strong> PrestaCerto arbitra e resolve
          </li>
        </ol>
      </div>
    </div>
  );
}
