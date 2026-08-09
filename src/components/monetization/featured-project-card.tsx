"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface FeaturedProjectCardProps {
  projectId: string;
  isFeatured?: boolean;
  onSuccess?: () => void;
}

export function FeaturedProjectCard({ projectId, isFeatured, onSuccess }: FeaturedProjectCardProps) {
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago checkout
      // Por enquanto, chamar o endpoint direto pra teste
      const res = await fetch("/api/monetization/featured-projects/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      });

      if (!res.ok) throw new Error("Failed to activate");

      const data = await res.json();
      toast.success(`Projeto em destaque até ${new Date(data.featured_until).toLocaleDateString("pt-BR")}`);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao ativar destaque");
    } finally {
      setLoading(false);
    }
  };

  if (isFeatured) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Star className="size-4 fill-green-600" />
            Projeto em Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600">Este projeto aparece no topo das buscas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="size-4" />
          Destaque do Projeto
        </CardTitle>
        <CardDescription>Apareça no topo por 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">R$ 50</p>
            <p className="text-xs text-muted-foreground">por 7 dias</p>
          </div>
          <Button onClick={handleActivate} disabled={loading} size="sm">
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Ativar Agora
          </Button>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Aparece no topo das buscas</li>
          <li>✓ Badge destacado</li>
          <li>✓ +30-40% mais propostas</li>
        </ul>
      </CardContent>
    </Card>
  );
}
