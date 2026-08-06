'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeaturedListingModalProps {
  freelancerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeaturedListingModal({ freelancerId, open, onOpenChange }: FeaturedListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Destaque Básico',
      price: 'R$ 39,90',
      period: 'por mês',
      slots: '1 projeto destacado',
      features: [
        '✓ Seu perfil no topo da busca',
        '✓ 1 projeto em destaque',
        '✓ Badge de destaque',
        '✓ Válido por 30 dias',
      ],
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Destaque Premium',
      price: 'R$ 79,90',
      period: 'por mês',
      slots: '5 projetos destacados',
      features: [
        '✓ Tudo do básico',
        '✓ 5 projetos em destaque',
        '✓ Prioridade alta em buscas',
        '✓ Certificado de destaque',
      ],
      highlight: true,
    },
  ];

  async function handlePurchase() {
    if (!selectedPlan) {
      toast.error('Selecione um plano');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago Brick
      // 1. Criar preference no MP com valor (39.90 ou 79.90)
      // 2. Renderizar CardPayment Brick
      // 3. Na confirmação, chamar createFeaturedListing()

      const response = await fetch('/api/monetization/featured-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId,
          planType: selectedPlan === 'basic' ? 'featured_basic' : 'featured_pro',
        }),
      });

      if (!response.ok) throw new Error('Erro na compra');

      const data = await response.json();
      toast.success('Perfil destacado! 🎉');
      onOpenChange(false);
      window.location.reload(); // Refresh to show updated listing
    } catch (error) {
      console.error('Featured listing error:', error);
      toast.error('Erro ao processar compra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Destaque seu Perfil</DialogTitle>
          <DialogDescription>
            Apareça no topo da busca e atraia mais clientes. Válido por 30 dias.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as 'basic' | 'pro')}
              className={`relative rounded-lg border-2 p-6 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
                  MAIS POPULAR
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              <div className="mt-2 text-sm font-medium text-gray-600">{plan.slots}</div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </li>
                ))}
              </ul>

              {selectedPlan === plan.id && (
                <div className="mt-4 rounded bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                  SELECIONADO
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">💡 Por que se destacar?</h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ Apareça em destaque nas buscas por 30 dias</li>
            <li>✓ Receba 3-5x mais propostas de clientes</li>
            <li>✓ Aumente sua taxa de contratação</li>
            <li>✓ Construa sua reputação rapidamente</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!selectedPlan || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Processando...' : `Contratar ${selectedPlan === 'pro' ? 'Premium' : 'Básico'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
