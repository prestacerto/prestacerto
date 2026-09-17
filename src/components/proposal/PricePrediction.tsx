'use client';

export function PricePrediction({ userPrice = 1500, marketAvg = 1800 }: { userPrice?: number; marketAvg?: number }) {
  const diff = userPrice - marketAvg;
  const percentDiff = Math.round((diff / marketAvg) * 100);
  const isAbove = diff > 0;
  const isSimilar = Math.abs(percentDiff) <= 5;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${
      isSimilar
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : isAbove
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">💰</span>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            {isSimilar ? 'Preço no mercado' : isAbove ? 'Acima do mercado' : 'Abaixo do mercado'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Você: R$ {userPrice.toLocaleString()} | Mercado: R$ {marketAvg.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {isSimilar
              ? '✅ Seu preço é competitivo'
              : isAbove
              ? `⚠️ ${percentDiff}% acima da média (considere reduzir para mais propostas)`
              : `💚 ${Math.abs(percentDiff)}% abaixo da média (bom para competitividade)`}
          </p>
        </div>
      </div>
    </div>
  );
}
