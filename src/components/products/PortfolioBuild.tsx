'use client';

import { useState } from 'react';

export function PortfolioBuild() {
  const [generating, setGenerating] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const generatePortfolio = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/portfolio/generate', { method: 'POST' });
      const data = await res.json();
      setPortfolioUrl(data.url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-3">🎨 CERTO Portfolio</h2>
        <p className="mb-6">Seu portfólio profissional gerado em 1 clique</p>

        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
            <p className="text-sm opacity-90">✨ Dados dos seus projetos em PrestaCerto</p>
            <p className="text-sm opacity-90">✨ PDF profissional automático</p>
            <p className="text-sm opacity-90">✨ Mini-site com depoimentos</p>
            <p className="text-sm opacity-90">✨ Integração Behance/GitHub</p>
          </div>

          <button
            onClick={generatePortfolio}
            disabled={generating}
            className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 disabled:bg-gray-300"
          >
            {generating ? 'Gerando...' : 'Gerar Portfólio Agora'}
          </button>

          {portfolioUrl && (
            <div className="bg-green-400/20 border border-green-400 p-4 rounded-lg">
              <p className="text-sm font-bold mb-2">✅ Portfólio gerado!</p>
              <a href={portfolioUrl} target="_blank" className="text-white underline">
                Visualizar: {portfolioUrl.slice(0, 40)}...
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">💰 R$ 29,90/mês</h3>
          <p className="text-sm text-gray-600">Portfólio premium ilimitado</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-bold mb-2">📈 Potencial</h3>
          <p className="text-sm text-gray-600">R$ 149.5k/mês (5k freelancers)</p>
        </div>
      </div>
    </div>
  );
}
