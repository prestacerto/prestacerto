"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const MONETIZATION_PLANS: Plan[] = [
  {
    id: "featured-7",
    name: "Destaque 7 dias",
    price: 99,
    period: "único",
    description: "Destaque seu projeto/serviço no topo por 7 dias",
    features: [
      "Posição privilegiada nas buscas",
      "Badge de destaque",
      "2x mais visualizações estimadas",
      "Analytics do destaque",
    ],
  },
  {
    id: "featured-30",
    name: "Destaque 30 dias",
    price: 249,
    period: "único",
    description: "Destaque prolongado com máxima visibilidade",
    features: [
      "Posição #1 por 30 dias",
      "Badge exclusivo",
      "5x mais visualizações estimadas",
      "Analytics avançado",
      "Email ao cliente quando vence",
    ],
    popular: true,
  },
  {
    id: "alerts-premium",
    name: "Job Alerts Premium",
    price: 29,
    period: "mês",
    description: "Alertas customizados de novos projetos",
    features: [
      "Alertas em tempo real",
      "Filtros avançados",
      "Até 5 alertas simultâneos",
      "Prioridade em candidaturas",
      "Sem limite de histórico",
    ],
  },
  {
    id: "analytics-pro",
    name: "Analytics Pro",
    price: 49,
    period: "mês",
    description: "Dados detalhados de performance",
    features: [
      "Dashboard analytics completo",
      "Taxa de resposta x conversão",
      "ROI por projeto",
      "Competitividade vs mercado",
      "Exportar relatórios (PDF/CSV)",
    ],
  },
  {
    id: "priority-support",
    name: "Suporte Prioritário",
    price: 79,
    period: "mês",
    description: "Atendimento 24/7 com prioridade",
    features: [
      "Chat com suporte 24/7",
      "Resposta em <1 hora",
      "Dedicated account manager",
      "Consultoria estratégica",
      "Desconto em featured listings",
    ],
  },
];

export default function MonetizationStorePage() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = (planId: string) => {
    setCart([...cart, { id: planId, quantity: 1 }]);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cart.map((item) => {
        const plan = MONETIZATION_PLANS.find((p) => p.id === item.id)!;
        return {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          quantity: item.quantity,
        };
      });

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro ao processar checkout");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const plan = MONETIZATION_PLANS.find((p) => p.id === item.id);
    return sum + (plan?.price || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monetize Seu Perfil</h1>
        <p className="text-muted-foreground">
          Aumente sua visibilidade e ganhe mais com recursos premium
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MONETIZATION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={plan.popular ? "border-green-500 border-2 relative" : ""}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-500">Mais Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">R$ {plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => addToCart(plan.id)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                Adicionar ao carrinho
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {cart.length > 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle>Resumo do Carrinho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cart.map((item, idx) => {
                const plan = MONETIZATION_PLANS.find((p) => p.id === item.id);
                return (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{plan?.name}</span>
                    <span className="font-semibold">R$ {plan?.price}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold">R$ {cartTotal}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Processando..." : "Pagar com Mercado Pago"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
