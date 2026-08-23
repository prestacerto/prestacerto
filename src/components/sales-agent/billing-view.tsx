'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Users, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface BillingViewProps {
  userId: string;
}

interface Subscription {
  id: number;
  stripe_subscription_id: string;
  seats_purchased: number;
  current_period_start: string;
  current_period_end: string;
  status: string;
  stripe_plans?: {
    name: string;
    base_price: number;
    currency: string;
    billing_interval: string;
  };
}

export function BillingView({ userId }: BillingViewProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [userId]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch(`/api/billing/subscription?userId=${userId}`);
      const data = await res.json();
      if (data.subscription) {
        setSubscription(data.subscription);
        setSeats(data.subscription.seats_purchased);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeats = async () => {
    if (!subscription) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'update-seats',
          seats,
        }),
      });

      if (!res.ok) throw new Error('Failed to update seats');
      await fetchSubscription();
      alert('✅ Assentos atualizados com sucesso!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erro ao atualizar assentos');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !confirm('Tem certeza que deseja cancelar a assinatura?')) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/billing/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: 'cancel',
        }),
      });

      if (!res.ok) throw new Error('Failed to cancel subscription');
      await fetchSubscription();
      alert('✅ Assinatura cancelada!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erro ao cancelar assinatura');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Carregando informações de cobrança...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Nenhuma Assinatura Ativa</h3>
          <p className="text-slate-600 mb-4">
            Você não tem uma assinatura ativa no momento. Escolha um plano para começar.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Ver Planos
          </Button>
        </div>
      </Card>
    );
  }

  const plan = subscription.stripe_plans;
  const monthlyPrice = plan ? (plan.base_price / 100).toFixed(2) : '0.00';
  const totalPrice = (Number(monthlyPrice) * subscription.seats_purchased).toFixed(2);
  const periodStart = new Date(subscription.current_period_start).toLocaleDateString('pt-BR');
  const periodEnd = new Date(subscription.current_period_end).toLocaleDateString('pt-BR');

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6 border-emerald-200 bg-emerald-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="text-lg font-bold text-emerald-900">{plan?.name}</h3>
              <p className="text-sm text-emerald-700">Plano ativo</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-medium rounded-full capitalize">
            {subscription.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-200">
          <div>
            <p className="text-xs text-emerald-700 uppercase tracking-wide font-semibold">Preço Mensal</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{plan?.currency} {monthlyPrice}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-700 uppercase tracking-wide font-semibold">Assentos</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{subscription.seats_purchased}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-700 uppercase tracking-wide font-semibold">Total Mensal</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{plan?.currency} {totalPrice}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-emerald-200">
          <p className="text-sm text-emerald-700">
            <Calendar className="h-4 w-4 inline mr-2" />
            Período de faturamento: {periodStart} até {periodEnd}
          </p>
        </div>
      </Card>

      {/* Manage Seats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gerenciar Assentos
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Adicione ou remova assentos conforme necessário. A cobrança será ajustada proporcionalmente.
        </p>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Número de Assentos</label>
            <input
              type="number"
              min="1"
              max="100"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
          <Button
            onClick={handleUpdateSeats}
            disabled={updating || seats === subscription.seats_purchased}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {updating ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Método de Pagamento
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Gerencie suas informações de pagamento e histórico de faturas no Stripe.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Acessar Portal do Cliente Stripe
        </Button>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-bold mb-4 text-red-900">Zona de Perigo</h3>
        <p className="text-sm text-red-700 mb-4">
          Cancelar sua assinatura removerá o acesso ao agente de vendas para toda sua equipe.
        </p>
        <Button
          onClick={handleCancelSubscription}
          disabled={updating}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {updating ? 'Cancelando...' : 'Cancelar Assinatura'}
        </Button>
      </Card>
    </div>
  );
}
