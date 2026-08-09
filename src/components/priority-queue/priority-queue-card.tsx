"use client";

import { Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

interface PriorityQueueCardProps {
  tier: "gold" | "platinum" | "diamond";
  days: number;
  price: number;
  features: string[];
  isActive?: boolean;
  expiresAt?: string;
}

const TIER_COLORS = {
  gold: "bg-amber-50 border-amber-200",
  platinum: "bg-slate-50 border-slate-200",
  diamond: "bg-blue-50 border-blue-200",
};

const TIER_LABELS = {
  gold: "Ouro",
  platinum: "Platina",
  diamond: "Diamante",
};

export function PriorityQueueCard({
  tier,
  days,
  price,
  features,
  isActive,
  expiresAt,
}: PriorityQueueCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago checkout
      toast.error("Integração com Mercado Pago em desenvolvimento");
    } finally {
      setLoading(false);
    }
  };

  if (isActive) {
    return (
      <Card className={TIER_COLORS[tier]}>
        <CardHeader>
          <CardTitle className="text-lg">✅ {TIER_LABELS[tier]} Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Expira em {new Date(expiresAt || "").toLocaleDateString("pt-BR")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={TIER_COLORS[tier]}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-4" />
          {TIER_LABELS[tier]}
        </CardTitle>
        <CardDescription>{days} dias de visibilidade premium</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold">R$ {price.toFixed(2)}</div>

        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-green-600" />
              {feature}
            </li>
          ))}
        </ul>

        <Button onClick={handlePurchase} disabled={loading} className="w-full">
          {loading ? "Processando..." : `Ativar por ${days} dias`}
        </Button>
      </CardContent>
    </Card>
  );
}
