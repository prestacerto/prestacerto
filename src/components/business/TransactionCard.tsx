'use client';

import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  project_title: string;
  amount_cents: number;
  status: string;
  category: string;
  created_at: string;
}

interface TransactionCardProps {
  transactions: Transaction[];
}

export function TransactionCard({ transactions }: TransactionCardProps) {
  if (!transactions?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h3 className="font-semibold mb-4">Transações Recentes</h3>
        <p className="text-gray-500 text-sm">Nenhuma transação ainda</p>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    disputed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    refunded: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="font-semibold mb-4">Transações Recentes</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.slice(0, 10).map((tx) => (
          <div key={tx.id} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <div className="flex-1">
              <p className="font-medium text-sm">{tx.project_title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(tx.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className="font-semibold text-green-700 dark:text-green-400">
                {formatCurrency(tx.amount_cents)}
              </p>
              <Badge className={`text-xs mt-1 ${statusColors[tx.status as keyof typeof statusColors] || statusColors.active}`}>
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
