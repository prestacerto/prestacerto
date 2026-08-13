'use client';

import { formatCurrency } from '@/lib/utils';

interface RevenueCardProps {
  revenue?: {
    thisWeekRevenue: number;
    thisWeekGrowth: number;
  };
}

export function RevenueCard({ revenue }: RevenueCardProps) {
  if (!revenue) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const growth = revenue.thisWeekGrowth;
  const isPositive = growth >= 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 shadow border border-green-200 dark:border-green-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Esta Semana</p>
          <h3 className="text-3xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(revenue.thisWeekRevenue)}
          </h3>
        </div>
        <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
          isPositive
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(growth)}%
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">vs semana anterior</p>
    </div>
  );
}
