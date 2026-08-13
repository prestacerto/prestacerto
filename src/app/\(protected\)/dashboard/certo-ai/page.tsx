'use client';

import { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';

export default function CertoAIPage() {
  const [proposal, setProposal] = useState('');
  const [optimized, setOptimized] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptimize = async () => {
    if (!proposal.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/optimize-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'optimize', proposal }),
      });

      const data = await response.json();
      setOptimized(data.result?.optimized || '');
      setScore(data.result?.score || 0);
    } catch (error) {
      console.error('Erro:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo AI</h1>
        <p className="text-gray-600">Otimize suas propostas com IA em tempo real</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input */}
        <div>
          <label className="block text-sm font-semibold mb-3">Sua Proposta Original</label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Cole aqui sua proposta bruta ou escreva do zero..."
            className="w-full h-96 p-4 border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !proposal.trim()}
            className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? 'Otimizando...' : 'Otimizar com IA'}
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold">Proposta Otimizada</label>
            {score > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      score > 75 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-bold">{score}</span>
              </div>
            )}
          </div>

          <textarea
            value={optimized}
            readOnly
            placeholder="A proposta otimizada aparecerá aqui..."
            className="w-full h-96 p-4 border rounded-lg text-sm font-mono resize-none bg-gray-50"
          />

          {optimized && (
            <button
              onClick={copyToClipboard}
              className="mt-4 w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Proposta
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">💡 Dicas para Melhores Resultados</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Seja específico sobre as habilidades que você tem</li>
          <li>✓ Mencione resultados anteriores ou portfólio</li>
          <li>✓ Adapte para cada cliente, não use propostas genéricas</li>
          <li>✓ Seja breve, direto e profissional</li>
          <li>✓ Inclua um call-to-action claro</li>
        </ul>
      </div>
    </div>
  );
}
