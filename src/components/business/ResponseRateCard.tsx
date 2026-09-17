'use client';

interface ResponseRateCardProps {
  metrics?: {
    responseRate: number;
    avgResponseTime: number;
    thisWeekVisits: number;
    proposals30Days: number;
  };
}

export function ResponseRateCard({ metrics }: ResponseRateCardProps) {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 shadow border border-blue-200 dark:border-blue-800">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Taxa de Resposta</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{metrics.responseRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Último mês</p>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Tempo Médio</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{metrics.avgResponseTime}h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Resposta</p>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Visitas Esta Semana</p>
          <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{metrics.thisWeekVisits}</p>
        </div>

        <div>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">Propostas (30d)</p>
          <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{metrics.proposals30Days}</p>
        </div>
      </div>

      {metrics.responseRate >= 90 && (
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/40 rounded text-xs text-blue-700 dark:text-blue-300">
          ⭐ Você tem uma taxa de resposta excelente!
        </div>
      )}
    </div>
  );
}
