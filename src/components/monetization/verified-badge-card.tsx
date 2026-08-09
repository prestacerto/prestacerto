"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface VerifiedBadgeCardProps {
  isVerified?: boolean;
  expiresAt?: string;
  onSuccess?: () => void;
}

export function VerifiedBadgeCard({ isVerified, expiresAt, onSuccess }: VerifiedBadgeCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago checkout
      const res = await fetch("/api/monetization/verified-badge/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("Failed to subscribe");

      toast.success("Badge de verificação ativado!");
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao ativar badge");
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <CheckCircle2 className="size-4 fill-blue-600" />
            Verificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            Seu perfil é verificado. Expira em {new Date(expiresAt || "").toLocaleDateString("pt-BR")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          Badge de Verificação
        </CardTitle>
        <CardDescription>Mostre que você é verificado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">R$ 5</p>
            <p className="text-xs text-muted-foreground">por mês</p>
          </div>
          <Button onClick={handleSubscribe} disabled={loading} size="sm">
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Inscrever
          </Button>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Badge no perfil</li>
          <li>✓ Maior confiança</li>
          <li>✓ Filtro "Verificados"</li>
        </ul>
      </CardContent>
    </Card>
  );
}
