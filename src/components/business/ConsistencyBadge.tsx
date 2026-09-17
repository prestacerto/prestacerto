'use client';

import { useEffect, useState } from 'react';

export function ConsistencyBadge() {
  const [streak, setStreak] = useState(0);
  const [earned, setEarned] = useState(false);

  useEffect(() => {
    fetch('/api/business/consistency-badge')
      .then(r => r.json())
      .then(d => {
        setStreak(d.streak);
        setEarned(d.earned);
      });
  }, []);

  if (!streak) return null;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      earned
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{earned ? '🏆' : '⏳'}</div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{streak} dias seguidos</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {earned ? 'Badge de Consistência desbloqueado!' : `Faltam ${30 - streak} dias`}
          </p>
        </div>
      </div>
    </div>
  );
}
