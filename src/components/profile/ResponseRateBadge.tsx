'use client';

export function ResponseRateBadge({ rate = 92 }: { rate?: number }) {
  const getColor = (r: number) => {
    if (r >= 95) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    if (r >= 85) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    if (r >= 75) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getColor(rate)}`}>
      <span className="text-lg">⚡</span>
      <div>
        <p className="text-sm font-bold">{rate}% de resposta</p>
        <p className="text-xs opacity-75">Muito rápido</p>
      </div>
    </div>
  );
}
