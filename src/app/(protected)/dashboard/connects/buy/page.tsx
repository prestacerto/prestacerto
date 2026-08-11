'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth/useSession';

export default function BuyConnectsPage() {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

  const packages = [
    {
      name: 'Starter',
      connects: 10,
      price: 49,
      bestFor: 'Teste a plataforma',
    },
    {
      name: 'Professional',
      connects: 50,
      price: 199,
      bestFor: 'Maior volume',
      popular: true,
    },
    {
      name: 'Business',
      connects: 200,
      price: 599,
      bestFor: 'Máximo alcance',
    },
  ];

  const handleCheckout = async (price: number, connects: number) => {
    if (!session?.access_token) {
      alert('Você precisa estar logado');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_type: 'connects',
          amount: price,
          description: `${connects} propostas`,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao iniciar compra');
      }
    } catch (error) {
      alert('Erro ao processar pagamento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Compre Propostas</h1>
        <p className="text-gray-600 mt-2">
          Esgotou suas propostas? Compre mais connects para enviar propostas ilimitadamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.name} className={pkg.popular ? 'border-blue-500 border-2' : ''}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              {pkg.popular && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded w-fit">
                  Mais Popular
                </span>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">{pkg.bestFor}</p>
                <p className="text-4xl font-bold mt-2">{pkg.connects}</p>
                <p className="text-xs text-gray-500">propostas</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-green-600">R$ {pkg.price}</p>
                <p className="text-xs text-gray-500">pagamento único</p>
              </div>

              <Button
                onClick={() => handleCheckout(pkg.price, pkg.connects)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processando...' : 'Comprar Agora'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Planos Mensais (Melhor Custo-Benefício)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Pro - 50 propostas/mês</p>
              <p className="text-sm text-gray-600">Ideal para freelancers ativos</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R$ 49<span className="text-sm">/mês</span></p>
              <Button size="sm" onClick={() => alert('Recurso em breve - Mercado Pago')}>
                Assinar
              </Button>
            </div>
          </div>

          <hr />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Business - Ilimitado</p>
              <p className="text-sm text-gray-600">Sem limite de propostas</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R$ 149<span className="text-sm">/mês</span></p>
              <Button size="sm" onClick={() => alert('Recurso em breve - Mercado Pago')}>
                Assinar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
