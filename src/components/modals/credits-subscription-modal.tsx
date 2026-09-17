"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, TrendingUp } from "lucide-react";

interface SubscriptionPlan {
  name: string;
  price: number;
  credits: number;
  perMonth: string;
  features: string[];
  popular: boolean;
  color: string;
  savings: string | null;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: "Starter",
    price: 29.90,
    credits: 10,
    perMonth: "R$ 2.99/crédito",
    features: [
      "10 créditos por mês",
      "Renovação automática",
      "Sem compromisso — cancele quando quiser",
      "Válido por 30 dias",
    ],
    popular: false,
    color: "blue",
    savings: null,
  },
  {
    name: "Pro",
    price: 59.90,
    credits: 50,
    perMonth: "R$ 1.20/crédito",
    features: [
      "50 créditos por mês",
      "Renovação automática",
      "Sem compromisso — cancele quando quiser",
      "Prioridade em suporte",
      "60% de economia vs Starter",
    ],
    popular: true,
    color: "green",
    savings: "Economize 60%",
  },
  {
    name: "Unlimited",
    price: 99.90,
    credits: 999,
    perMonth: "Ilimitado",
    features: [
      "Propostas ilimitadas",
      "Renovação automática",
      "Sem compromisso — cancele quando quiser",
      "Suporte prioritário 24/7",
      "Acesso a recursos premium",
    ],
    popular: false,
    color: "purple",
    savings: "Melhor valor",
  },
];

interface CreditsSubscriptionModalProps {
  currentPlan?: string;
}

export function CreditsSubscriptionModal({ currentPlan }: CreditsSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[1]);
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const getPrice = () => {
    if (billingCycle === "annual") {
      return (selectedPlan.price * 12 * 0.15).toFixed(2); // 15% discount
    }
    return selectedPlan.price.toFixed(2);
  };

  const getPriceLabel = () => {
    if (billingCycle === "annual") {
      return `R$ ${getPrice()}/ano (${(parseFloat(getPrice()) / 12).toFixed(2)}/mês)`;
    }
    return `R$ ${getPrice()}/mês`;
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monetization/credits/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan.name.toLowerCase(),
          price: parseFloat(getPrice()),
          billingCycle,
        }),
      });

      if (!response.ok) throw new Error("Erro na assinatura");

      const { preferenceId } = await response.json();
      // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
      if (window.mp) {
        // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
        window.mp.checkout({ preference: preferenceId });
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">📅 Planos de Assinatura</h2>
        <p className="text-slate-500 mt-1">
          Créditos ilimitados todo mês. Sem compromisso — cancele quando quiser.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded font-medium transition ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded font-medium transition ${
                billingCycle === "annual"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              Anual (15% OFF)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`cursor-pointer transition ${
              selectedPlan.name === plan.name
                ? "ring-2 ring-blue-600 bg-blue-50"
                : "hover:border-slate-400"
            } ${plan.popular ? "md:scale-105 shadow-lg" : ""}`}
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge className="bg-green-600">Mais Popular</Badge>
                )}
              </div>
              {plan.savings && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  ✨ {plan.savings}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {plan.credits === 999 ? "∞" : plan.credits}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {plan.credits === 999 ? "Ilimitado" : "créditos/mês"}
                </p>
                <p className="text-sm font-medium text-blue-600 mt-2">
                  {plan.perMonth}
                </p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Vs. Compra Avulsa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-slate-600">Comprar 10 créditos avulso:</span>
            <span className="font-bold">R$ 24.90</span>
          </div>
          <div className="flex justify-between items-center text-green-600 font-medium">
            <span>Plano Starter (10 créditos/mês):</span>
            <span>R$ 29.90/mês</span>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            💡 Com o Starter, você tem 10 créditos todo mês por apenas 5 reais a mais!
          </p>
        </CardContent>
      </Card>

      {/* Summary & CTA */}
      <Card className="border-2 border-blue-600 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Plano:</span>
              <span className="font-bold">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Créditos:</span>
              <span className="font-bold">
                {selectedPlan.credits === 999 ? "Ilimitados" : selectedPlan.credits + "/mês"}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-slate-600">Total:</span>
              <span className="text-2xl font-bold">{getPriceLabel()}</span>
            </div>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? "Processando..." : `Assinar ${selectedPlan.name}`}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-3">
            Renovação automática. Cancele quando quiser sem penalidades.
          </p>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">Posso cancelar a qualquer momento?</p>
          <p className="text-slate-500 mt-1">Sim! Sem compromisso. Cancele quando quiser.</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">O que acontece se eu cancelar?</p>
          <p className="text-slate-500 mt-1">
            Você manterá seus créditos não utilizados até o final do ciclo.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Posso combinar com créditos avulsos?</p>
          <p className="text-slate-500 mt-1">
            Sim! Assine um plano e compre créditos extras quando necessário.
          </p>
        </div>
      </div>
    </div>
  );
}
