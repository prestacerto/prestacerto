'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PortfolioPremiumModalProps {
  freelancerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortfolioPremiumModal({ freelancerId, open, onOpenChange }: PortfolioPremiumModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | null>(null);

  const plans = [
    {
      id: 'standard',
      name: 'Portfólio Standard',
      price: 'R$ 39,90',
      period: 'por mês',
      slots: '3 projetos em destaque',
      features: [
        '✓ 3 projetos destacados no perfil',
        '✓ Destaque especial para cada projeto',
        '✓ Badge "Portfolio Premium"',
        '✓ Válido por 30 dias',
      ],
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Portfólio Pro',
      price: 'R$ 79,90',
      period: 'por mês',
      slots: '10 projetos em destaque',
      features: [
        '✓ Tudo do Standard',
        '✓ 10 projetos em destaque',
        '✓ Reordenação prioritária',
        '✓ Badge "Top Portfolio"',
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
      // 3. Na confirmação, chamar createPortfolioPremium()

      const response = await fetch('/api/monetization/portfolio-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId,
          planType: selectedPlan === 'standard' ? 'portfolio_standard' : 'portfolio_pro',
        }),
      });

      if (!response.ok) throw new Error('Erro na compra');

      const data = await response.json();
      toast.success('Portfólio premium ativado! 🎨');
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error('Portfolio premium error:', error);
      toast.error('Erro ao processar compra. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Portfólio Premium</DialogTitle>
          <DialogDescription>
            Destaque seus melhores projetos e impressione clientes em potencial. Válido por 30 dias.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as 'standard' | 'pro')}
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

        <div className="mt-6 rounded-lg bg-purple-50 dark:bg-purple-950 p-4">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100">🎨 Diferencial do Portfólio Premium</h4>
          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-200">
            <li>✓ Seus projetos aparecem destacados no seu perfil</li>
            <li>✓ Clientes veem seus melhores trabalhos primeiro</li>
            <li>✓ Aumento de 2-3x em convites de projetos</li>
            <li>✓ Badge exclusivo "Portfolio Premium" no perfil</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!selectedPlan || loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Processando...' : `Ativar ${selectedPlan === 'pro' ? 'Pro' : 'Standard'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
