"use client";

import { useState } from "react";
import { calculateTaxBreakdown } from "@/lib/tax/calculator";

export default function TaxDashboard() {
  const [grossIncome, setGrossIncome] = useState(5000);
  const [workType, setWorkType] = useState("freelancer_other");
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [breakdown, setBreakdown] = useState(
    calculateTaxBreakdown(grossIncome, workType as any, otherDeductions)
  );

  const handleCalculate = () => {
    const newBreakdown = calculateTaxBreakdown(
      grossIncome,
      workType as any,
      otherDeductions
    );
    setBreakdown(newBreakdown);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            💰 Certo Tax — Calcule seu Imposto
          </h1>
          <p className="text-gray-600 mt-2">
            Descubra quanto você realmente ganha após IR + INSS
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Informações Financeiras
            </h2>

            {/* Renda Bruta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renda Bruta Mensal
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-600">R$</span>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Arraste ou digite seu ganho mensal
              </p>
            </div>

            {/* Tipo de Trabalho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trabalho
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="freelancer_dev">Dev/Programador</option>
                <option value="freelancer_designer">Designer</option>
                <option value="freelancer_consultant">Consultor</option>
                <option value="freelancer_other">Outro</option>
              </select>
            </div>

            {/* Deduções */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deduções Adicionais (R$)
              </label>
              <input
                type="number"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Despesas profissionais, cursos, etc
              </p>
            </div>

            {/* Botão Calcular */}
            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              ✨ Calcular Imposto
            </button>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            {/* Card Renda Bruta */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Renda Bruta</p>
              <p className="text-3xl font-bold text-gray-900">
                R$ {breakdown.grossIncome.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Card INSS */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">
                INSS ({breakdown.inssRate}%)
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                -R$ {breakdown.inssCalculated.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Card IR */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600">
                Imposto de Renda ({breakdown.irRate}%)
              </p>
              <p className="text-3xl font-bold text-red-600">
                -R$ {breakdown.irCalculated.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Card Renda Líquida */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm opacity-90">Renda Líquida Real</p>
              <p className="text-4xl font-bold">
                R$ {breakdown.liquidIncome.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs opacity-75 mt-2">
                Isso é quanto você realmente recebe
              </p>
            </div>

            {/* Dica: Guardar */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-900">
                💡 Recomendação: Guarde R${" "}
                {breakdown.shouldSaveMonthly.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}{" "}
                por mês
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Para pagar IR no final do ano
              </p>
            </div>

            {/* Notas */}
            {breakdown.taxNotes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                {breakdown.taxNotes.map((note, i) => (
                  <p key={i} className="text-sm text-blue-900">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabela de Histórico (future) */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Próximas Features
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Histórico de cálculos (últimos 12 meses)</li>
            <li>📊 Gráficos de evolução de renda</li>
            <li>💾 Exportar cálculos em PDF</li>
            <li>🔄 Integração automática com sua renda em PrestaCerto</li>
            <li>📱 App mobile com notificações</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
