'use client';

import { useState } from 'react';

export function CashLoan() {
  const [loanAmount, setLoanAmount] = useState(5000);
  const [interest] = useState(3);

  const monthlyPayment = Math.floor(loanAmount * (1 + interest / 100));

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">💸 CERTO Loan</h2>
        <p className="mb-6">Adiantamento de cash em 24h</p>

        <div className="bg-white/10 p-4 rounded-lg backdrop-blur mb-4">
          <p className="text-sm opacity-90">✨ Até 80% do milestone adiantado</p>
          <p className="text-sm opacity-90">✨ Aprovação automática em 24h</p>
          <p className="text-sm opacity-90">✨ Juros 3% ao mês (competitivo)</p>
          <p className="text-sm opacity-90">✨ Scoring baseado em histórico PrestaCerto</p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm opacity-90">Quanto precisa?</label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-2xl font-bold mt-2">R$ {loanAmount.toLocaleString()}</p>
          </div>

          <div className="bg-white/20 p-3 rounded">
            <p className="text-sm opacity-90">Você paga:</p>
            <p className="text-2xl font-bold">R$ {monthlyPayment.toLocaleString()}</p>
            <p className="text-xs opacity-75">+ 2% de taxa (R$ {Math.floor(loanAmount * 0.02)})</p>
          </div>
        </div>

        <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-gray-100">
          Solicitar Empréstimo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">💰 3% ao mês</h3>
          <p className="text-sm text-gray-600">Juros (competitivo)</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">📈 Potencial</h3>
          <p className="text-sm text-gray-600">R$ 15k/mês (100 loans)</p>
        </div>
      </div>
    </div>
  );
}
