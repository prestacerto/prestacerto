'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export function PriorityQueueCard() {
  const tiers = [
    { name: 'Ouro', days: 3, price: 15 },
    { name: 'Platina', days: 7, price: 25, popular: true },
    { name: 'Diamante', days: 14, price: 40 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap size={20} /> Apareça no Topo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {tiers.map((tier) => (
            <Button
              key={tier.name}
              variant={tier.popular ? 'default' : 'outline'}
              className="h-24 flex-col"
              onClick={() => alert(`Ativar ${tier.name} por ${tier.days} dias - R$ ${tier.price}`)}
            >
              <p className="font-semibold">{tier.name}</p>
              <p className="text-xs opacity-75">{tier.days} dias</p>
              <p className="font-bold">R$ {tier.price}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
