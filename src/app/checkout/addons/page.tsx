'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Package, Zap, Award, Barcode, TrendingUp, Code } from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'one-time';
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

interface Bundle {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  savings: number;
  addOns: string[];
  recommended?: boolean;
}

export default function AddOnsPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const addOns: AddOn[] = [
    {
      id: 'extra-projects',
      name: 'Extra Projetos',
      price: 4.90,
      billingCycle: 'monthly',
      description: '+5 projetos por mês',
      benefits: ['+5 projetos', 'Sem limite de propostas', 'Prioridade'],
      icon: <Barcode className="w-6 h-6" />,
    },
    {
      id: 'featured-boost',
      name: 'Featured Boost',
      price: 29.90,
      billingCycle: 'one-time',
      description: 'Destaque por 30 dias',
      benefits: ['#1 posição', '30 dias de destaque', '+300% visibilidade'],
      icon: <Award className="w-6 h-6" />,
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      price: 19.90,
      billingCycle: 'monthly',
      description: 'Resposta em 1 hora',
      benefits: ['Suporte 24/7', 'Chat prioritário', 'Ticket rápido'],
      icon: <Zap className="w-6 h-6" />,
      popular: true,
    },
    {
      id: 'portfolio-premium',
      name: 'Portfolio Premium',
      price: 49.90,
      billingCycle: 'monthly',
      description: 'Domínio + design customizado',
      benefits: ['Domínio próprio', 'Design profissional', 'Analytics avançado'],
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 'cv-maker',
      name: 'CV Maker',
      price: 14.90,
      billingCycle: 'one-time',
      description: 'Gerador de CV com IA',
      benefits: ['IA gera CV', 'Modelos profissionais', 'Lifetime access'],
      icon: <Package className="w-6 h-6" />,
    },
    {
      id: 'analytics-advanced',
      name: 'Analytics Advanced',
      price: 39.90,
      billingCycle: 'monthly',
      description: 'Relatórios com IA',
      benefits: ['Relatórios automáticos', 'Previsões de receita', 'ROI tracking'],
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 'api-premium',
      name: 'API Premium',
      price: 49.90,
      billingCycle: 'monthly',
      description: '100k requisições/mês',
      benefits: ['100k API calls', 'Webhooks ilimitados', 'Suporte técnico'],
      icon: <Code className="w-6 h-6" />,
    },
  ];

  const bundles: Bundle[] = [
    {
      id: 'pro-support',
      name: 'Pro + Suporte',
      price: 44.90,
      monthlyPrice: 44.90,
      savings: 7.90,
      addOns: ['pro-plan', 'priority-support'],
    },
    {
      id: 'pro-portfolio',
      name: 'Pro + Portfólio',
      price: 74.90,
      monthlyPrice: 74.90,
      savings: 19.90,
      addOns: ['pro-plan', 'portfolio-premium'],
      recommended: true,
    },
    {
      id: 'premium-total',
      name: 'Premium Total',
      price: 169.90,
      monthlyPrice: 169.90,
      savings: 28.80,
      addOns: ['premium-plan', 'portfolio-premium', 'analytics-advanced', 'api-premium'],
    },
  ];

  const calculateTotal = () => {
    const monthlyTotal = addOns
      .filter((a) => selectedAddOns.includes(a.id) && a.billingCycle === 'monthly')
      .reduce((sum, a) => sum + a.price, 0);

    const oneTimeTotal = addOns
      .filter((a) => selectedAddOns.includes(a.id) && a.billingCycle === 'one-time')
      .reduce((sum, a) => sum + a.price, 0);

    return { monthly: monthlyTotal, oneTime: oneTimeTotal };
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2">🎁 Add-ons Premium</h1>
          <p className="text-slate-400">Potencialize sua conta com recursos exclusivos</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Anual (20% off)
          </button>
        </div>

        {/* Bundles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">📦 Pacotes com Desconto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <Card
                key={bundle.id}
                className={`border-2 transition ${
                  bundle.recommended
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-slate-700 bg-slate-800/50'
                }`}
              >
                <CardHeader>
                  {bundle.recommended && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
                      ⭐ Recomendado
                    </div>
                  )}
                  <CardTitle>{bundle.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-blue-400">
                      R$ {bundle.price.toFixed(2)}
                    </div>
                    <p className="text-sm text-slate-400">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</p>
                    <p className="text-green-400 font-bold mt-2">💚 Economiza R$ {bundle.savings.toFixed(2)}</p>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
                    Comprar Pacote
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Individual Add-ons */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">✨ Add-ons Individuais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon) => (
              <Card
                key={addon.id}
                className={`border-2 cursor-pointer transition ${
                  selectedAddOns.includes(addon.id)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() =>
                  setSelectedAddOns((prev) =>
                    prev.includes(addon.id)
                      ? prev.filter((id) => id !== addon.id)
                      : [...prev, addon.id]
                  )
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-blue-400">{addon.icon}</div>
                    {addon.popular && <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Popular</span>}
                  </div>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-400">R$ {addon.price.toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-1">{addon.billingCycle === 'monthly' ? '/mês' : 'único'}</p>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{addon.description}</p>
                  <ul className="space-y-2 mb-4">
                    {addon.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  {selectedAddOns.includes(addon.id) && (
                    <div className="text-center text-sm font-bold text-blue-400">✓ Selecionado</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        {selectedAddOns.length > 0 && (
          <div className="fixed bottom-8 right-8 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm text-blue-100 mb-2">Seu total:</p>
            <div className="text-3xl font-bold">
              R$ {(totals.monthly + totals.oneTime).toFixed(2)}
            </div>
            <p className="text-xs text-blue-200 mt-1">{selectedAddOns.length} add-ons selecionados</p>
            <button className="w-full mt-4 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-slate-100 transition">
              Comprar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
