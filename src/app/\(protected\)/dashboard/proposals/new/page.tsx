'use client';

import { useState } from 'react';
import { PricePrediction } from '@/components/proposal/PricePrediction';

export default function NewProposalPage() {
  const [price, setPrice] = useState(1500);
  const marketAvg = 1800; // Fetch from API

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nova Proposta</h1>

      <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        {/* Project */}
        <div>
          <label className="block font-semibold mb-2">Projeto</label>
          <input
            type="text"
            placeholder="Dashboard React com TypeScript"
            className="w-full border dark:border-gray-700 p-3 rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Descrição</label>
          <textarea
            placeholder="Sua proposta..."
            rows={5}
            className="w-full border dark:border-gray-700 p-3 rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="block font-semibold mb-2">Seu Preço</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex-1 border dark:border-gray-700 p-3 rounded-lg dark:bg-gray-700"
              placeholder="1500"
            />
            <span className="flex items-center text-gray-600 dark:text-gray-400">R$</span>
          </div>
        </div>

        {/* PRICE PREDICTION - AQUI! */}
        <PricePrediction userPrice={price} marketAvg={marketAvg} />

        {/* Timeline */}
        <div>
          <label className="block font-semibold mb-2">Prazo (dias)</label>
          <input
            type="number"
            defaultValue={7}
            className="w-full border dark:border-gray-700 p-3 rounded-lg dark:bg-gray-700"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
          Enviar Proposta
        </button>
      </form>
    </div>
  );
}
