'use client';

import { useState } from 'react';

export function ScaleAgency() {
  const [team, setTeam] = useState<any[]>([]);
  const [showHiring, setShowHiring] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">📈 CERTO Scale</h2>
        <p className="mb-6">Transforme-se em agência com sua própria equipe</p>

        <div className="bg-white/10 p-4 rounded-lg backdrop-blur mb-4">
          <p className="text-sm opacity-90">✨ Hiring automático de juniors</p>
          <p className="text-sm opacity-90">✨ Delegação de projetos + workflow</p>
          <p className="text-sm opacity-90">✨ Gestão de time integrada</p>
          <p className="text-sm opacity-90">✨ Faturamento compartilhado</p>
        </div>

        <button
          onClick={() => setShowHiring(!showHiring)}
          className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-gray-100"
        >
          {showHiring ? 'Fechar' : 'Contratar Primeiro Dev'}
        </button>
      </div>

      {showHiring && (
        <div className="border-2 border-green-400 p-6 rounded-lg">
          <h3 className="font-bold mb-4">🔍 Juniors Recomendados</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <p className="font-semibold">Dev Junior #{i}</p>
                  <p className="text-sm text-gray-600">React • Node.js • R$ {800 + i * 100}/projeto</p>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">💰 R$ 199/mês</h3>
          <p className="text-sm text-gray-600">+ 5% do faturamento extra</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">📈 Potencial</h3>
          <p className="text-sm text-gray-600">R$ 100k/mês (500 agências)</p>
        </div>
      </div>
    </div>
  );
}
