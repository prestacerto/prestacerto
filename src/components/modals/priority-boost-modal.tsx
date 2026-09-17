"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Zap, TrendingUp } from "lucide-react";

interface BoostTier {
  name: string;
  price: number;
  duration: number;
  position: string;
  boost: string;
  color: string;
  impact: string;
}

const BOOST_TIERS: BoostTier[] = [
  {
    name: "Ouro",
    price: 15.90,
    duration: 3,
    position: "Topo (3 dias)",
    boost: "Destaque no topo por 3 dias",
    color: "from-yellow-400 to-orange-500",
    impact: "↑ 25% mais propostas",
  },
  {
    name: "Platina",
    price: 25.90,
    duration: 7,
    position: "Topo (7 dias)",
    boost: "Destaque no topo por 7 dias",
    color: "from-slate-300 to-slate-500",
    impact: "↑ 50% mais propostas",
  },
  {
    name: "Diamante",
    price: 39.90,
    duration: 14,
    position: "Topo (2 semanas)",
    boost: "Destaque no topo por 2 semanas",
    color: "from-cyan-400 to-blue-600",
    impact: "↑ 100% mais propostas",
  },
];

interface PriorityBoostModalProps {
  projectId: string;
  projectTitle: string;
}

export function PriorityBoostModal({ projectId, projectTitle }: PriorityBoostModalProps) {
  const [selectedTier, setSelectedTier] = useState<BoostTier>(BOOST_TIERS[1]);
  const [loading, setLoading] = useState(false);

  const handleBoost = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monetization/priority-boost/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          tier: selectedTier.name.toLowerCase(),
          price: selectedTier.price,
          duration: selectedTier.duration,
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
        <h2 className="text-2xl font-bold">⚡ Destaque Rápido</h2>
        <p className="text-slate-500 mt-1">
          Apareça no topo das buscas por tempo limitado
        </p>
        <p className="text-sm font-medium text-slate-600 mt-2">
          Projeto: <span className="text-blue-600">{projectTitle}</span>
        </p>
      </div>

      {/* Impact Info */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6 flex gap-3">
          <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-900">
              Aumente suas chances de proposta
            </p>
            <p className="text-green-800 text-xs mt-1">
              Projetos no topo recebem 25-100% mais propostas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tiers */}
      <div className="space-y-3">
        {BOOST_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={`cursor-pointer transition ${
              selectedTier.name === tier.name
                ? "ring-2 ring-blue-600 bg-blue-50"
                : "hover:border-slate-400"
            }`}
            onClick={() => setSelectedTier(tier)}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    {tier.name === "Platina" && (
                      <Badge className="bg-slate-600">Recomendado</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{tier.position}</p>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {tier.impact}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">R$ {tier.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">por {tier.duration} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>Seu projeto aparece no topo das buscas</span>
          </div>
          <div className="flex gap-2">
            <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>Mais visibilidade = mais propostas</span>
          </div>
          <div className="flex gap-2">
            <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>Válido por {selectedTier.duration} dias</span>
          </div>
          <div className="flex gap-2">
            <Zap className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>Pode renovar quantas vezes quiser</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary & CTA */}
      <Card className="border-2 border-blue-600 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Tier:</span>
              <span className="font-bold">{selectedTier.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duração:</span>
              <span className="font-bold">{selectedTier.duration} dias</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-slate-600">Total:</span>
              <span className="text-2xl font-bold">R$ {selectedTier.price.toFixed(2)}</span>
            </div>
          </div>
          <Button
            onClick={handleBoost}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? "Processando..." : "Impulsionar Projeto"}
          </Button>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="flex gap-2 text-xs text-slate-600 bg-slate-100 p-3 rounded">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          O destaque é aplicado imediatamente após o pagamento ser confirmado.
        </p>
      </div>
    </div>
  );
}
