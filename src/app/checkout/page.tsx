'use client';

import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PLANS, ADD_ONS, BUNDLES, formatPrice } from '@/lib/plans/pricing';

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'review' | 'payment'>('select');

  const plan = PLANS[selectedPlan];
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = ADD_ONS[id];
    return sum + (addon?.price || 0);
  }, 0);

  const subtotal = (plan?.price || 0) + addOnsTotal;
  const tax = Math.round(subtotal * 0.15); // 15% ICMS
  const total = subtotal + tax;

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simular chamada ao Stripe (quando configurado)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Por enquanto, apenas redireciona para sucesso
      alert('✅ Pagamento processado com sucesso!\n\nEm breve você receberá um email de confirmação.');
      setStep('payment');
    } catch (error) {
      alert('❌ Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h1>
          <p className="text-slate-400 mb-6">Seu plano foi ativado com sucesso.</p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-slate-300 text-sm mb-2"><strong>Plano:</strong> {plan?.name}</p>
            <p className="text-white font-bold">{formatPrice(total)}</p>
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Um email de confirmação foi enviado para seu endereço de email cadastrado.
          </p>

          <Link href="/dashboard" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition block">
            Ir ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/plans" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Planos
        </Link>

        <h1 className="text-4xl font-bold text-white mb-12">🛒 Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1: Select Plan */}
          {step === 'select' && (
            <>
              <div className="lg:col-span-2">
                {/* Plans */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">1. Escolha seu Plano</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {Object.values(PLANS)
                      .filter(p => p.price > 0)
                      .map(p => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlan(p.id)}
                          className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                            selectedPlan === p.id
                              ? 'border-blue-500 bg-blue-600/20'
                              : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                          }`}
                        >
                          <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
                          <p className="text-2xl font-bold text-blue-400 mb-2">{formatPrice(p.price)}</p>
                          <p className="text-slate-400 text-sm">{p.description}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">2. Adicione Extras</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(ADD_ONS)
                      .filter(a => a.billingPeriod === 'monthly')
                      .map(addon => (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddOn(addon.id)}
                          className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                            selectedAddOns.includes(addon.id)
                              ? 'border-emerald-500 bg-emerald-600/20'
                              : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{addon.name}</h3>
                            <div className="w-5 h-5 rounded border-2 border-current" />
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{addon.description}</p>
                          <p className="text-emerald-400 font-bold">{formatPrice(addon.price)}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep('review')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition"
                >
                  Continuar para Revisão →
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-white mb-4">📋 Resumo</h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plano</span>
                      <span className="text-white font-semibold">{formatPrice(plan?.price || 0)}</span>
                    </div>

                    {selectedAddOns.map(addOnId => {
                      const addon = ADD_ONS[addOnId];
                      return (
                        <div key={addOnId} className="flex justify-between text-sm">
                          <span className="text-slate-400">{addon?.name}</span>
                          <span className="text-white">{formatPrice(addon?.price || 0)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Impostos (15%)</span>
                      <span className="text-white">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-700">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-2xl font-bold text-emerald-400">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Review */}
          {step === 'review' && (
            <>
              <div className="lg:col-span-2">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">✓ Revise seu Pedido</h2>

                  <div className="space-y-4 mb-8">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Plano Selecionado</p>
                      <p className="text-white text-lg font-bold">{plan?.name} - {formatPrice(plan?.price || 0)}/mês</p>
                      <p className="text-slate-400 text-sm mt-2">{plan?.description}</p>
                    </div>

                    {selectedAddOns.length > 0 && (
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-3">Add-ons Selecionados</p>
                        <div className="space-y-2">
                          {selectedAddOns.map(addOnId => {
                            const addon = ADD_ONS[addOnId];
                            return (
                              <div key={addOnId} className="flex justify-between">
                                <span className="text-white">{addon?.name}</span>
                                <span className="text-emerald-400">{formatPrice(addon?.price || 0)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm mb-6">
                    Você receberá um email de confirmação no seu endereço cadastrado. Pode cancelar a qualquer momento.
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Continuar para Pagamento →
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-white mb-6">💰 Total</h3>
                  <div className="text-4xl font-bold text-emerald-400 mb-6">{formatPrice(total)}</div>
                  <p className="text-slate-400 text-sm mb-4">Cobrança Mensal</p>
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
