'use client';

export function ConsistencyBadgeDisplay() {
  const streakDays = 24;
  const maxStreak = 30;
  const earned = streakDays >= maxStreak;
  const progress = Math.round((streakDays / maxStreak) * 100);

  return (
    <div className={`rounded-lg p-6 border-2 ${
      earned
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl mb-2">{earned ? '🏆' : '⏳'}</p>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {earned ? 'Badge de Consistência' : 'Caminho para Badge'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {streakDays} dias seguidos
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progress}%</p>
          <p className="text-xs text-gray-500">{30 - streakDays} dias restantes</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${
            earned ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {earned && (
        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3 font-semibold">
          ✨ Desbloqueado! Você é consistente!
        </p>
      )}
    </div>
  );
}
