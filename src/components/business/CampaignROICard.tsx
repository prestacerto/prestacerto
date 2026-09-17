'use client';

export function CampaignROICard() {
  const spent = 2500; // R$ gastos em campanhas
  const revenue = 8400; // R$ retornados
  const roi = Math.round(((revenue - spent) / spent) * 100);
  const payback = (spent / (revenue / 30)).toFixed(1); // dias pra recuperar

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">ROI de Campanhas</h3>
        <span className="text-3xl">📊</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Spent */}
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Gasto</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">R$ {spent.toLocaleString()}</p>
        </div>

        {/* Revenue */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Retorno</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {revenue.toLocaleString()}</p>
        </div>

        {/* ROI */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{roi}%</p>
        </div>

        {/* Payback */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">Payback</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{payback}d</p>
        </div>
      </div>

      {/* Simple progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Lucro Líquido</span>
          <span className="font-bold">R$ {(revenue - spent).toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${Math.min((revenue / spent) * 50, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
