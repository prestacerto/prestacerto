"use client";

import { useState } from "react";
import { Sparkles, Copy, RefreshCw, ThumbsUp, Send } from "lucide-react";

export function AIProposalCoach() {
  const [proposal, setProposal] = useState(
    "Olá, gostaria de criar um website moderno para meu negócio. Preciso de design responsivo, integração com banco de dados e painel administrativo. O orçamento é de R$ 5000."
  );

  const [improved, setImproved] = useState(
    "Olá! Sou desenvolvedor full-stack especializado em criar websites modernos e escaláveis. Vejo que você precisa de:\n\n✓ Design responsivo (mobile-first)\n✓ Backend robusto com banco de dados\n✓ Admin dashboard intuitivo\n\nTenho 5+ anos de experiência em React + Node.js, com portfolio de 20+ projetos entregues. Posso fazer isso em 3-4 semanas com suporte pós-lançamento incluído.\n\nMeu preço: R$ 6500 (investimento que se recupera em vendas). Primeira consulta gratuita. Vamos conversar?"
  );

  const [suggestions, setSuggestions] = useState([
    {
      type: "price",
      title: "💰 Ajuste de Preço",
      desc: "Seu preço está 30% abaixo da média do mercado. Suba para R$ 6500.",
      applied: true,
    },
    {
      type: "social-proof",
      title: "🏆 Adicione Prova Social",
      desc: "Mencione experiência anterior (anos, projetos) para ganhar confiança.",
      applied: true,
    },
    {
      type: "specificity",
      title: "🎯 Seja Mais Específico",
      desc: "Detalhe qual tech stack usa (React, Node, etc) para atrair matches.",
      applied: true,
    },
    {
      type: "urgency",
      title: "⏰ Crie Senso de Urgência",
      desc: "Mencione slots limitados ou timeline atual para aumentar conversão.",
      applied: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: Call OpenAI API via /api/ai/improve-proposal
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="size-8 text-yellow-500" />
          Copiloto de Propostas com IA
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Reescreva suas propostas em 30 segundos e aumente taxa de aceitação
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Before */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
            📝 Sua Proposta Original
          </label>
          <textarea
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {proposal.length}/2000 caracteres
          </p>
        </div>

        {/* After */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
            ✨ Proposta Otimizada
          </label>
          <textarea
            value={improved}
            readOnly
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950 text-slate-900 dark:text-white focus:outline-none"
          />
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✅ Pronto para copiar e enviar
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleImprove}
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="size-4" />
          {loading ? "Gerando..." : "Gerar Melhoria"}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Copy className="size-4" />
          {copied ? "✅ Copiado!" : "Copiar"}
        </button>
        <button className="flex-1 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          <Send className="size-4" />
          Enviar
        </button>
      </div>

      {/* AI Suggestions */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          🤖 Sugestões de IA
        </h3>
        <div className="space-y-3">
          {suggestions.map((sugg) => (
            <div
              key={sugg.type}
              className={`p-4 rounded-lg border-2 transition-all ${
                sugg.applied
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {sugg.title}
                    {sugg.applied && <span className="text-green-600">✓</span>}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {sugg.desc}
                  </p>
                </div>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 ${
                    sugg.applied
                      ? "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300"
                  }`}
                >
                  {sugg.applied ? "Aplicado" : "Aplicar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">+35%</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Aumento de Aceitação
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-green-600">R$ +2k</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Preço Médio Maior
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-purple-600">30s</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tempo de Melhoria
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="mt-12 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          💡 Plano Premium
        </h3>
        <p className="text-3xl font-bold text-orange-600 mb-2">R$ 19/mês</p>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          ✨ Reescritas ilimitadas com IA + Sugestões personalizadas
        </p>
        <button className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-colors">
          Ativar Premium Agora
        </button>
      </div>
    </div>
  );
}
