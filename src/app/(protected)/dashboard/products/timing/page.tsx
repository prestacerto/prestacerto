'use client';

import { useState } from 'react';

export default function TimingProductPage() {
  const [formData, setFormData] = useState({
    projectType: 'desenvolvimento',
    targetAudience: 'profissionais',
    competitorActivity: 'medium',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const assinifyLink = 'https://assinify.com.br/certo-timing?price=990&type=monthly';

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products/timing', {
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
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
          Produto Premium
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Certo Timing
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Recomendações com IA sobre o melhor momento para publicar, lançar ou fazer
          promoção de seus projetos. Maximize o alcance e a conversão.
        </p>
      </div>

      {/* Pricing */}
      <div className="rounded-xl border border-orange-300 bg-orange-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assinatura Mensal</h3>
            <p className="mt-1 text-sm text-slate-600">Análise de timing com IA</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              R$ 9<span className="text-sm text-slate-600">,90</span>
            </div>
            <p className="text-xs text-slate-500">/mês</p>
          </div>
        </div>
        <a
          href={assinifyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Assinar Agora
        </a>
      </div>

      {/* Analyzer */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Analisador de Timing</h2>

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
                <option value="desenvolvimento">Desenvolvimento</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="educação">Educação</option>
                <option value="consultoria">Consultoria</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Público-alvo
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="profissionais">Profissionais</option>
                <option value="estudantes">Estudantes</option>
                <option value="empreendedores">Empreendedores</option>
                <option value="público-geral">Público Geral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Atividade Competitiva
              </label>
              <select
                value={formData.competitorActivity}
                onChange={(e) => setFormData({ ...formData, competitorActivity: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Analisando...' : 'Analisar Timing'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-lg bg-orange-50 p-4 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Melhor Dia</p>
                <p className="text-2xl font-bold text-orange-600">{result.recommendation?.bestDay}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Melhor Horário</p>
                <p className="text-2xl font-bold text-orange-600">{result.recommendation?.bestHour}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Confiança</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full"
                      style={{ width: `${(result.recommendation?.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {Math.round((result.recommendation?.confidence || 0) * 100)}%
                  </span>
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
            <span className="mr-3 text-orange-600 font-bold">•</span>
            Análise de melhor dia e horário para publicar
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-orange-600 font-bold">•</span>
            Score de confiança baseado em dados históricos
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-orange-600 font-bold">•</span>
            Próxima janela de oportunidade em dias
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-orange-600 font-bold">•</span>
            Análise de atividade competitiva em tempo real
          </li>
        </ul>
      </div>
    </div>
  );
}
