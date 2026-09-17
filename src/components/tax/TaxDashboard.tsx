'use client';

import { useEffect, useState } from 'react';

interface TaxData {
  totalRevenue: number;
  estimatedTax: number;
  taxReserve: number;
  monthlyTaxRate: number;
  irRate: number;
  ssRate: number;
  projects: Array<{
    id: string;
    name: string;
    amount: number;
    tax: number;
    date: string;
  }>;
  nfCount: number;
}

export function TaxDashboard() {
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIRForm, setShowIRForm] = useState(false);

  useEffect(() => {
    fetchTaxData();
  }, []);

  const fetchTaxData = async () => {
    try {
      const res = await fetch('/api/tax/calculator');
      const data = await res.json();
      setTaxData(data.taxData);
    } catch (error) {
      console.error('Failed to fetch tax data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!taxData) return <div>Erro ao carregar dados fiscais</div>;

  return (
    <div className="space-y-6">
      {/* Tax Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 p-6 text-white">
          <p className="text-sm opacity-90">Receita Total (Ano)</p>
          <p className="text-3xl font-bold">R$ {(taxData.totalRevenue / 100).toFixed(2)}</p>
          <p className="mt-2 text-xs opacity-75">Bruto (antes de impostos)</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 p-6 text-white">
          <p className="text-sm opacity-90">Imposto Estimado</p>
          <p className="text-3xl font-bold">R$ {(taxData.estimatedTax / 100).toFixed(2)}</p>
          <p className="mt-2 text-xs opacity-75">{(taxData.monthlyTaxRate * 100).toFixed(1)}% da receita</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-6 text-white">
          <p className="text-sm opacity-90">Guardado em Reserva</p>
          <p className="text-3xl font-bold">R$ {(taxData.taxReserve / 100).toFixed(2)}</p>
          <p className="mt-2 text-xs opacity-75">Pronto pra imposto</p>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">💰 Composição de Impostos</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Imposto de Renda (IR)</span>
              <span className="font-bold">{(taxData.irRate * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-red-500" style={{ width: `${taxData.irRate * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Estimado: R$ {((taxData.totalRevenue * taxData.irRate) / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Contribuição Social (INSS)</span>
              <span className="font-bold">{(taxData.ssRate * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-orange-500" style={{ width: `${taxData.ssRate * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Estimado: R$ {((taxData.totalRevenue * taxData.ssRate) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Projects & Tax */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-bold">📊 Projetos & Impostos</h2>

        <div className="space-y-3">
          {taxData.projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex-1">
                <p className="font-semibold">{project.name}</p>
                <p className="text-xs text-gray-500">{new Date(project.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">R$ {(project.amount / 100).toFixed(2)}</p>
                <p className="text-xs text-red-600">-R$ {(project.tax / 100).toFixed(2)} imposto</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NF & IR Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20">
          <h3 className="mb-3 font-bold text-blue-900 dark:text-blue-200">📄 Notas Fiscais</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
            {taxData.nfCount} NF emitidas neste mês
          </p>
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Emitir Nova NF
          </button>
        </div>

        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6 dark:border-green-700 dark:bg-green-900/20">
          <h3 className="mb-3 font-bold text-green-900 dark:text-green-200">📋 Declaração IR</h3>
          <p className="text-sm text-green-800 dark:text-green-300 mb-4">
            Pronta para download
          </p>
          <button onClick={() => setShowIRForm(true)} className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Download IR 2024
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 font-bold">💡 Dicas Fiscais</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✅ Emita NF para cada projeto pra documentar receita</li>
          <li>✅ Guarde 30% de cada projeto em conta separada</li>
          <li>✅ Declare despesas profissionais pra reduzir imposto</li>
          <li>✅ Mantenha recibos de equipamento, software, internet</li>
          <li>✅ Consulte contador anualmente pra otimizar regime fiscal</li>
        </ul>
      </div>

      {/* Connected Accountant */}
      <div className="rounded-lg border-2 border-purple-300 bg-purple-50 p-6 dark:border-purple-700 dark:bg-purple-900/20">
        <h3 className="mb-3 font-bold text-purple-900 dark:text-purple-200">👨‍💼 Contador Conectado</h3>
        <p className="text-sm text-purple-800 dark:text-purple-300 mb-4">
          Seus dados estão sincronizados com seu contador
        </p>
        <button className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Conectar/Trocar Contador
        </button>
      </div>
    </div>
  );
}
