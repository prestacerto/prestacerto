'use client';

import { useState } from 'react';

export default function PreçoProductPage() {
  const [formData, setFormData] = useState({
    projectType: 'desenvolvimento',
    complexity: 'média',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const assinifyLink = 'https://assinify.com.br/certo-preço?price=1490&type=monthly';

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/preço', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">
          Produto Premium
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Certo Preço
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Engine de preços com IA que recomenda o valor ideal para seu projeto baseado
          em tipo, complexidade e dados de mercado. Maximize sua rentabilidade.
        </p>
      </div>

      {/* Pricing */}
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assinatura Mensal</h3>
            <p className="mt-1 text-sm text-slate-600">Acesso ao engine de preços com IA</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              R$ 14<span className="text-sm text-slate-600">,90</span>
            </div>
            <p className="text-xs text-slate-500">/mês</p>
          </div>
        </div>
        <a
          href={assinifyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Assinar Agora
        </a>
      </div>

      {/* Calculator */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Calculadora de Preços</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Projeto
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="design">Design</option>
                <option value="desenvolvimento">Desenvolvimento</option>
                <option value="marketing">Marketing</option>
                <option value="consultoria">Consultoria</option>
                <option value="design-gráfico">Design Gráfico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Complexidade
              </label>
              <select
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Calculando...' : 'Calcular Preço'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm text-slate-600 mb-2">Preço Recomendado</p>
              <div className="text-4xl font-bold text-emerald-600 mb-4">
                R$ {result.recommendedPrice?.toLocaleString('pt-BR')}
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-600">Faixa Competitiva</p>
                  <p className="font-semibold text-slate-900">
                    R$ {result.insights?.competitorRange?.min?.toLocaleString('pt-BR')} - R$ {result.insights?.competitorRange?.max?.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">O que você ganha:</h2>
        <ul className="grid gap-3 text-sm text-slate-700">
          <li className="flex items-start">
            <span className="mr-3 text-emerald-600 font-bold">•</span>
            Calculadora inteligente de preços baseada em tipo e complexidade
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-emerald-600 font-bold">•</span>
            Análise de faixa de preços competitivos de mercado
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-emerald-600 font-bold">•</span>
            Histórico de cálculos para comparação
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-emerald-600 font-bold">•</span>
            Recomendações para otimizar margem de lucro
          </li>
        </ul>
      </div>
    </div>
  );
}
