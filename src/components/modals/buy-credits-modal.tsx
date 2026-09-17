"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Zap } from "lucide-react";

interface CreditPackage {
  credits: number;
  price: number;
  bonus: number;
  popular: boolean;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { credits: 5, price: 14.90, bonus: 0, popular: false },
  { credits: 10, price: 24.90, bonus: 2, popular: true },
  { credits: 25, price: 54.90, bonus: 5, popular: false },
  { credits: 50, price: 99.90, bonus: 10, popular: false },
];

export function BuyCreditsModal() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage>(CREDIT_PACKAGES[1]);
  const [loading, setLoading] = useState(false);

  const totalCredits = selectedPackage.credits + selectedPackage.bonus;
  const pricePerCredit = (selectedPackage.price / totalCredits).toFixed(2);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monetization/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credits: selectedPackage.credits,
          price: selectedPackage.price,
        }),
      });

      if (!response.ok) throw new Error("Erro na compra");

      const { preferenceId } = await response.json();
      // Iniciar checkout Mercado Pago
      // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
      if (window.mp) {
        // @ts-expect-error — window.mp vem do script global do Mercado Pago, sem tipos
        window.mp.checkout({
          preference: preferenceId,
        });
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
        <h2 className="text-2xl font-bold">Compre Créditos</h2>
        <p className="text-slate-500 mt-1">
          Use créditos para enviar propostas ilimitadas. 1 crédito = 1 proposta.
        </p>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Sem limite de propostas!</p>
            <p>Após comprar créditos, envie quantas propostas quiser.</p>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.credits}
            className={`cursor-pointer transition ${
              selectedPackage.credits === pkg.credits
                ? "ring-2 ring-blue-600"
                : "hover:border-slate-400"
            }`}
            onClick={() => setSelectedPackage(pkg)}
          >
            <CardContent className="pt-4 pb-4">
              {pkg.popular && (
                <Badge className="mb-2 bg-green-600">Mais Popular</Badge>
              )}
              <p className="text-2xl font-bold">{totalCredits}</p>
              <p className="text-xs text-slate-500">
                {pkg.credits} créditos{pkg.bonus > 0 && ` + ${pkg.bonus} bônus`}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">R$ {pkg.price.toFixed(2)}</p>
              <p className="text-xs text-slate-500">R$ {pricePerCredit}/crédito</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Benefícios dos Créditos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Sem limite de propostas por projeto</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Créditos nunca expiram</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Use quando quiser</span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Combine com planos assinatura</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-2 border-blue-600 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-600">Créditos:</span>
            <span className="font-bold">{totalCredits}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600">Preço:</span>
            <span className="text-2xl font-bold">R$ {selectedPackage.price.toFixed(2)}</span>
          </div>
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? "Processando..." : "Comprar Créditos"}
          </Button>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">Como funcionam os créditos?</p>
          <p className="text-slate-500 mt-1">
            Cada proposta que você envia custa 1 crédito. Sem limite de propostas — envie quantas quiser!
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Os créditos expiram?</p>
          <p className="text-slate-500 mt-1">
            Não! Seus créditos nunca expiram. Use quando tiver oportunidades.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Posso combinar com planos?</p>
          <p className="text-slate-500 mt-1">
            Sim! Compre créditos e assine Premium ao mesmo tempo.
          </p>
        </div>
      </div>
    </div>
  );
}
