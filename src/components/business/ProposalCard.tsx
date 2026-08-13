'use client';

import { Badge } from '@/components/ui/badge';

interface Proposal {
  id: string;
  project_title: string;
  status: string;
  created_at: string;
  amount_cents?: number;
}

interface ProposalCardProps {
  proposals: Proposal[];
  stats?: {
    sent: number;
    accepted: number;
    rejected: number;
    viewed: number;
    acceptanceRate: number;
  };
}

export function ProposalCard({ proposals, stats }: ProposalCardProps) {
  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const statusColors = {
    sent: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    viewed: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200',
    accepted: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    withdrawn: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Propostas Enviadas</h3>
        <div className="grid grid-cols-5 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.sent}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Enviadas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{stats.viewed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Visualizadas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.accepted}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Aceitas</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.rejected}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rejeitadas</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.acceptanceRate}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Taxa Aceita</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Últimas Propostas</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {proposals.slice(0, 5).map((p) => (
            <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="text-sm">{p.project_title}</span>
              <Badge className={`text-xs ${statusColors[p.status as keyof typeof statusColors] || statusColors.sent}`}>
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
