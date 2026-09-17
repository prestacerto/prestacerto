'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export default function MatchProductPage() {
  const [isCalculating, setIsCalculating] = useState(false);

  const assinifyLinks = {
    oneTime: 'https://assinify.com.br/certo-match?price=2900&type=one-time',
    monthly: 'https://assinify.com.br/certo-match?price=1490&type=monthly',
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
          Produto Premium
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Certo Match
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          IA que compara suas habilidades com projetos disponíveis e encontra as melhores
          oportunidades. Compatibilidade automática em tempo real.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* One-Time Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Acesso Único</h3>
            <p className="mt-2 text-sm text-slate-600">
              Uma vez pago, acesso ilimitado para sempre.
            </p>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-slate-900">
              R$ 29<span className="text-sm text-slate-600">,00</span>
            </span>
            <p className="mt-1 text-xs text-slate-500">Pagamento único</p>
          </div>

          <ul className="mb-6 space-y-3 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Compatibilidade com projetos
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Análise de skills
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Insights da IA
            </li>
          </ul>

          <a
            href={assinifyLinks.oneTime}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Comprar Agora
          </a>
        </div>

        {/* Monthly Card */}
        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6 shadow-sm hover:shadow-md transition relative">
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Mais Popular
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Assinatura Mensal</h3>
            <p className="mt-2 text-sm text-slate-600">
              Acesso contínuo com atualizações mensais e novos recursos.
            </p>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-slate-900">
              R$ 14<span className="text-sm text-slate-600">,90</span>
            </span>
            <p className="mt-1 text-xs text-slate-500">/mês</p>
          </div>

          <ul className="mb-6 space-y-3 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Tudo do plano único
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Atualização contínua de projetos
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">✓</span>
              Prioridade no suporte
            </li>
          </ul>

          <a
            href={assinifyLinks.monthly}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Assinar Agora
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">O que você ganha:</h2>
        <ul className="grid gap-3 text-sm text-slate-700">
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">•</span>
            Algoritmo de matching que compara suas habilidades com projetos publicados
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">•</span>
            Score de compatibilidade (0-100) para cada oportunidade
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">•</span>
            Insights de IA sobre por que você é compatível
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">•</span>
            Filtros avançados por tipo de projeto, orçamento e deadline
          </li>
        </ul>
      </div>
    </div>
  );
}
