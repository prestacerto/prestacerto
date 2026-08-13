"use client";

import { useEffect, useState } from "react";
import { Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnectsQuota } from "@/hooks/useConnectsQuota";
import { toast } from "sonner";

interface Package {
  id: string;
  name: string;
  connects_amount: number;
  price: number;
}

export default function ConnectsPage() {
  const { quota, refetch } = useConnectsQuota();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Aqui você buscaria os pacotes disponíveis
        // Por enquanto, usando valores hardcoded
        setPackages([
          { id: "1", name: "10 Conectares", connects_amount: 10, price: 19.90 },
          { id: "2", name: "25 Conectares", connects_amount: 25, price: 39.90 },
          { id: "3", name: "50 Conectares", connects_amount: 50, price: 69.90 },
          { id: "4", name: "100 Conectares", connects_amount: 100, price: 129.90 },
          { id: "5", name: "Ilimitado (30d)", connects_amount: 9999, price: 199.90 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (packageId: string) => {
    toast.error("Integração com Mercado Pago em desenvolvimento");
    // TODO: Implementar checkout do Mercado Pago
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Conectares</h1>
        <p className="text-muted-foreground">Cada proposta que você enviar usa 1 conectar</p>
      </div>

      {quota && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-4" />
              Sua Cota Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
                <p className="text-2xl font-bold">{quota.connects_available}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usados</p>
                <p className="text-2xl font-bold">{quota.connects_used}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Restantes</p>
                <p className="text-2xl font-bold text-blue-600">{quota.connects_remaining}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="text-2xl font-bold capitalize">{quota.tier}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">Comprar Conectares</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.connects_amount} conectares</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">R$ {pkg.price.toFixed(2)}</div>
                <Button onClick={() => handlePurchase(pkg.id)} className="w-full">
                  Comprar Agora
                </Button>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-600" />
                    Uso imediato
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-green-600" />
                    Sem expiração
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-dashed p-6 bg-muted/50">
        <h3 className="font-bold">📋 Planos Automáticos</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Free</span>
            <span className="font-bold">5 conectares/mês</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pro (R$ 49/mês)</span>
            <span className="font-bold">50 conectares/mês</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Business (R$ 149/mês)</span>
            <span className="font-bold">Ilimitado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
