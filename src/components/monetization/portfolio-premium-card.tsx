"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PortfolioPremiumCardProps {
  isPremium?: boolean;
  expiresAt?: string;
  onSuccess?: () => void;
}

export function PortfolioPremiumCard({ isPremium, expiresAt, onSuccess }: PortfolioPremiumCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago checkout
      const res = await fetch("/api/monetization/portfolio-premium/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      toast.success("Portfólio Premium ativado!");
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao ativar portfólio premium");
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles className="size-4 fill-purple-600" />
            Portfólio Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-600">
            Seu portfólio é premium. Expira em {new Date(expiresAt || "").toLocaleDateString("pt-BR")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-4" />
          Portfólio Premium
        </CardTitle>
        <CardDescription>Destaque seu melhor trabalho</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">R$ 10</p>
            <p className="text-xs text-muted-foreground">por mês</p>
          </div>
          <Button onClick={handleSubscribe} disabled={loading} size="sm">
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Inscrever
          </Button>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Destaque nas buscas</li>
          <li>✓ Analytics avançados</li>
          <li>✓ Seção de destaques</li>
        </ul>
      </CardContent>
    </Card>
  );
}
