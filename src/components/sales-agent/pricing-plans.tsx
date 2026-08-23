'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  type: 'seat' | 'performance';
  billingInterval: string;
  highlighted?: boolean;
}

interface PricingPlansProps {
  userId: string;
  plans: PricingPlan[];
}

export function PricingPlans({ userId, plans }: PricingPlansProps) {
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planId,
          successUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/sales-agent?tab=billing&success=true`,
          cancelUrl: `${process.env.NEXT_PUBLIC_URL}/pricing`,
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');

      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erro ao processar checkout');
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900">Planos de Preço</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Escolha o plano ideal para sua equipe de vendas. Pague por assento e maximize o retorno com performance-based pricing.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all ${
              plan.highlighted
                ? 'border-2 border-emerald-500 shadow-xl scale-105'
                : 'border-slate-200'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-sm font-bold py-1 text-center">
                MAIS POPULAR
              </div>
            )}

            <div className={`p-8 ${plan.highlighted ? 'pt-16' : ''}`}>
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    {(plan.price / 100).toFixed(2)}
                  </span>
                  <span className="text-slate-600">
                    {plan.currency} / {plan.billingInterval === 'month' ? 'mês' : 'ano'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {plan.type === 'seat' ? 'Por assento' : 'Com bônus de performance'}
                </p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full mb-6 py-6 text-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                Selecionar Plano
              </Button>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Incluído:
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h3>
        <div className="space-y-6">
          {[
            {
              q: 'Posso mudar de plano a qualquer momento?',
              a: 'Sim, você pode fazer upgrade ou downgrade de seu plano a qualquer momento. A cobrança será ajustada proporcionalmente.',
            },
            {
              q: 'Como funciona o performance-based pricing?',
              a: 'Além da taxa base por assento, você ganha até 20% de cashback em leads qualificados e conversões. Sem limite de retorno!',
            },
            {
              q: 'Vocês oferecem período de teste?',
              a: 'Sim, oferecemos 14 dias de teste grátis com todas as features. Sem exigência de cartão de crédito.',
            },
            {
              q: 'Como faço para cancelar minha assinatura?',
              a: 'Você pode cancelar a qualquer momento no painel de cobrança. Sem penalidades ou taxas de cancelamento.',
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
