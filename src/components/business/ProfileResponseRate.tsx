'use client';

export function ProfileResponseRate({ responseRate, avgTime }: { responseRate: number; avgTime: number }) {
  return (
    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Resposta</p>
        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{responseRate}%</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">Tempo médio</p>
        <p className="text-lg font-semibold text-green-700 dark:text-green-400">{avgTime}h</p>
      </div>
    </div>
  );
}
