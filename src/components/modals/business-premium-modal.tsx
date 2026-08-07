"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Users, BarChart3, Code2 } from "lucide-react";

interface BusinessPlan {
  name: string;
  price: number;
  billing: "monthly" | "annual";
  users: number;
  features: string[];
  highlight?: boolean;
}

const BUSINESS_PLANS: BusinessPlan[] = [
  {
    name: "Starter",
    price: 299,
    billing: "monthly",
    users: 3,
    features: [
      "Dashboard dedicado",
      "Até 3 usuários",
      "Integração básica",
      "Suporte por email",
      "Relatórios mensais",
    ],
  },
  {
    name: "Professional",
    price: 599,
    billing: "monthly",
    users: 10,
    features: [
      "Tudo do Starter +",
      "Até 10 usuários",
      "API access",
      "Webhooks customizados",
      "Suporte prioritário",
      "Relatórios avançados",
      "SSO (opcional)",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 999,
    billing: "monthly",
    users: 50,
    features: [
      "Tudo do Professional +",
      "Até 50 usuários",
      "White label (opcional)",
      "SLA garantido",
      "Account manager dedicado",
      "Integrações customizadas",
      "Análise de dados custom",
    ],
  },
];

export function BusinessPremiumModal() {
  const [selectedPlan, setSelectedPlan] = useState<BusinessPlan>(BUSINESS_PLANS[1]);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monetization/business-premium/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan.name.toLowerCase(),
          price: selectedPlan.price,
        }),
      });

      if (!response.ok) throw new Error("Erro na compra");

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
        <h2 className="text-2xl font-bold">🏢 Business Premium</h2>
        <p className="text-slate-500 mt-1">
          Solução completa para agências e empresas
        </p>
      </div>

      {/* Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="pt-6 space-y-3">
          <div className="flex gap-3">
            <Building2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-purple-900">Para Empresas & Agências</p>
              <p className="text-purple-800 text-xs mt-1">
                Gerencie múltiplos projetos, usuários e integração com ferramentas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="space-y-3">
        {BUSINESS_PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`cursor-pointer transition relative ${
              selectedPlan.name === plan.name
                ? "ring-2 ring-purple-600 bg-purple-50"
                : "hover:border-slate-400"
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-green-600">Mais Popular</Badge>
              </div>
            )}
            <CardContent className="pt-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-sm text-slate-500">
                    Até {plan.users} usuários
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">R$ {plan.price}</p>
                  <p className="text-xs text-slate-500">/mês</p>
                </div>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Highlight */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Recursos Principais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Múltiplos Usuários</p>
              <p className="text-xs text-slate-500 mt-1">
                Adicione sua equipe com diferentes permissões
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Code2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">API Completa</p>
              <p className="text-xs text-slate-500 mt-1">
                Integre com suas ferramentas existentes
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Analytics Avançados</p>
              <p className="text-xs text-slate-500 mt-1">
                Relatórios detalhados e insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary & CTA */}
      <Card className="border-2 border-purple-600 bg-purple-50">
        <CardContent className="pt-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Plano:</span>
              <span className="font-bold">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Usuários:</span>
              <span className="font-bold">Até {selectedPlan.users}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-slate-600">Subtotal:</span>
              <span className="text-2xl font-bold">R$ {selectedPlan.price}</span>
            </div>
            <p className="text-xs text-slate-500">+ Impostos (se aplicável)</p>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {loading ? "Processando..." : "Assinar Plano"}
          </Button>
        </CardContent>
      </Card>

      {/* CTA Email */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="pt-6 text-sm text-indigo-900">
          <p className="font-medium">Precisa de um plano customizado?</p>
          <p className="mt-1">
            Entre em contato: <span className="font-mono">business@prestacerto.com</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
