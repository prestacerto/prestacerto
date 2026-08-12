'use client';

import { useState } from 'react';
import { Check, X, Zap } from 'lucide-react';
import { PLANS, YEARLY_PLANS, ADD_ONS, BUNDLES, formatPrice } from '@/lib/plans/pricing';

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const plans = billingPeriod === 'monthly'
    ? Object.values(PLANS).filter(p => p.billingPeriod === 'monthly' || !p.billingPeriod)
    : Object.values(YEARLY_PLANS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">💰 Planos e Preços</h1>
          <p className="text-slate-400 text-lg mb-8">Escolha o plano perfeito para seu negócio</p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              Anual <span className="text-green-400 ml-2">-20% 💚</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg p-6 transition transform hover:scale-105 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-400 shadow-2xl'
                  : 'bg-slate-800/50 border border-slate-700/50'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                  ⭐ MAIS POPULAR
                </div>
              )}

              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.highlighted ? 'text-blue-100' : 'text-slate-400'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <div className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-white'}`}>
                  {formatPrice(plan.price)}
                  {plan.price > 0 && <span className="text-lg text-slate-300">/mês</span>}
                </div>
                {plan.discount && (
                  <p className="text-green-400 text-sm mt-2">Economize {plan.discount}% anual</p>
                )}
              </div>

              <button
                className={`w-full py-2 rounded-lg font-semibold mb-6 transition ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>

              {/* Features */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>
                    {plan.features.projects === -1 ? '∞ Projetos' : `${plan.features.projects} Projetos`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>
                    {plan.features.proposals === -1 ? '∞ Propostas' : `${plan.features.proposals} Propostas/mês`}
                  </span>
                </div>

                {plan.features.jobMatching ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>Job Matching</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">Job Matching</span>
                  </div>
                )}

                {plan.features.analytics ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>Analytics</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">Analytics</span>
                  </div>
                )}

                {plan.features.featured ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>Destaque Premium</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">Destaque Premium</span>
                  </div>
                )}

                {plan.features.priority ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className={plan.highlighted ? 'text-white' : 'text-slate-300'}>Suporte Prioritário</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">Suporte Prioritário</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Add-ons & Extras
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(ADD_ONS).map((addon) => (
              <div key={addon.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{addon.name}</h3>
                  <span className="text-emerald-400 font-bold">{formatPrice(addon.price)}</span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{addon.description}</p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-sm transition">
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bundles */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-8">🎁 Pacotes Especiais (Economize!)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(BUNDLES).map(([key, bundle]) => (
              <div key={key} className="bg-slate-700/50 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">{bundle.name}</h3>
                <p className="text-slate-300 text-sm mb-4">{bundle.description}</p>

                <div className="mb-4">
                  <p className="text-slate-400 line-through text-sm">Preço normal: {formatPrice(bundle.basePrice)}</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatPrice(bundle.bundlePrice)}</p>
                  <p className="text-emerald-400 text-sm">Economize {formatPrice(bundle.savings)}</p>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition">
                  Escolher Pacote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">❓ Dúvidas Frequentes</h2>
          <p className="text-slate-400 mb-6">Pode trocar de plano a qualquer momento. Seu próximo faturamento refletirá a mudança.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Falar com Suporte
          </button>
        </div>
      </div>
    </div>
  );
}
