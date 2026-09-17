"use client";

import { useState } from "react";

export function CertoAIClient({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"optimize" | "compare" | "insights">("optimize");

  const [optimizer, comparator] = Array.isArray(children) ? children : [children, null];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setTab("optimize")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            tab === "optimize"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          🤖 Otimizador
        </button>
        <button
          onClick={() => setTab("compare")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            tab === "compare"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          ⚖️ Comparar
        </button>
        <button
          onClick={() => setTab("insights")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            tab === "insights"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          📊 Insights
        </button>
      </div>

      {/* Content */}
      <div>
        {tab === "optimize" && optimizer}
        {tab === "compare" && comparator}
        {tab === "insights" && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-lg mb-4">Padrões de Propostas Vencedoras</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">✅ Personalização</p>
                <p className="text-sm text-gray-600">Mencionar nome do cliente ou detalhe específico do projeto</p>
                <p className="text-xs text-green-600 mt-1">+18% de taxa de ganho</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">✅ Demonstração de experiência</p>
                <p className="text-sm text-gray-600">Listar projetos similares concluídos com sucesso</p>
                <p className="text-xs text-green-600 mt-1">+22% de taxa de ganho</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">✅ Timeline realista</p>
                <p className="text-sm text-gray-600">Propor prazos atingíveis (máx 30% acima estimado)</p>
                <p className="text-xs text-green-600 mt-1">+15% de taxa de ganho</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">✅ Chamada à ação clara</p>
                <p className="text-sm text-gray-600">Terminar com próximos passos (chat, call, etc)</p>
                <p className="text-xs text-green-600 mt-1">+12% de taxa de ganho</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
