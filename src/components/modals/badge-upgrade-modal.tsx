"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Award, Crown, Sparkles } from "lucide-react";

interface BadgeTier {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
  description: string;
  pricePerMonth: string;
  popular: boolean;
}

const BADGE_TIERS: BadgeTier[] = [
  {
    id: "verified",
    name: "Verificado",
    price: 9.90,
    period: "ano",
    icon: Check,
    color: "blue",
    description: "Básico — Mostra que você é verificado",
    pricePerMonth: "R$ 0.83/mês",
    features: [
      "Selo de verificação na sua foto",
      "Válido por 1 ano",
      "Renovação automática",
    ],
    popular: false,
  },
  {
    id: "top-rated",
    name: "Top Rated",
    price: 29.90,
    period: "ano",
    icon: Star,
    color: "yellow",
    description: "Intermediário — Destaque profissional",
    pricePerMonth: "R$ 2.49/mês",
    features: [
      "Selo de Top Rated (⭐)",
      "Perfil destacado na busca",
      "Acesso a analytics premium",
      "Selo de verificação incluído",
      "Válido por 1 ano",
    ],
    popular: true,
  },
  {
    id: "expert",
    name: "Expert",
    price: 59.90,
    period: "ano",
    icon: Award,
    color: "purple",
    description: "Profissional — Máxima visibilidade",
    pricePerMonth: "R$ 4.99/mês",
    features: [
      "Selo de Expert (🏆)",
      "Perfil em destaque SEMPRE",
      "Prioridade em busca",
      "Relatório mensal de performance",
      "Suporte prioritário",
      "Todos os benefícios anteriores",
    ],
    popular: false,
  },
  {
    id: "vip",
    name: "VIP",
    price: 99.90,
    period: "ano",
    icon: Crown,
    color: "rose",
    description: "Premium — Exclusivo",
    pricePerMonth: "R$ 8.33/mês",
    features: [
      "Selo de VIP (👑)",
      "Perfil exclusivo com destaque máximo",
      "Prioridade absoluta em busca",
      "Relatório semanal detalhado",
      "Suporte dedicado 24/7",
      "Convite para eventos exclusivos",
      "Certificado de excelência",
      "Todos os benefícios anteriores",
    ],
    popular: false,
  },
];

interface BadgeUpgradeModalProps {
  currentBadge?: string;
}

export function BadgeUpgradeModal({ currentBadge }: BadgeUpgradeModalProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeTier>(BADGE_TIERS[1]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/monetization/badges/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badgeId: selectedBadge.id,
          price: selectedBadge.price,
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

  const getBadgeIcon = (tier: BadgeTier) => {
    const Icon = tier.icon;
    const iconColors: Record<string, string> = {
      blue: "text-blue-600",
      yellow: "text-yellow-600",
      purple: "text-purple-600",
      rose: "text-rose-600",
    };
    return <Icon className={`h-6 w-6 ${iconColors[tier.color]}`} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Selos de Verificação
        </h2>
        <p className="text-slate-500 mt-1">
          Aumente sua credibilidade com selos de verificação profissional
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6 flex gap-3">
          <Award className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-purple-900">
              Destaque seu perfil e ganhe mais projetos
            </p>
            <p className="text-purple-800 text-xs mt-1">
              Freelancers com selos recebem 40-60% mais convites de cliente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Badge Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGE_TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={`cursor-pointer transition ${
              selectedBadge.id === tier.id
                ? "ring-2 ring-blue-600 bg-blue-50"
                : "hover:border-slate-400"
            } ${tier.popular ? "md:col-span-2 md:scale-105 shadow-lg" : ""}`}
            onClick={() => setSelectedBadge(tier)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getBadgeIcon(tier)}
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">
                      {tier.description}
                    </p>
                  </div>
                </div>
                {tier.popular && (
                  <Badge className="bg-green-600">Recomendado</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  R$ {tier.price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-500">
                  por {tier.period} ({tier.pricePerMonth})
                </p>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentBadge === tier.id && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
                  ✓ Seu selo ativo agora
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Comparação de Benefícios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium">Benefício</th>
                  {BADGE_TIERS.map((tier) => (
                    <th key={tier.id} className="text-center py-2 px-2 font-medium">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2">Selo de Verificação</td>
                  {BADGE_TIERS.map((tier) => (
                    <td key={tier.id} className="text-center py-2 px-2">
                      {tier.id === "verified" ||
                      tier.id === "top-rated" ||
                      tier.id === "expert" ||
                      tier.id === "vip" ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Destaque em Busca</td>
                  {BADGE_TIERS.map((tier) => (
                    <td key={tier.id} className="text-center py-2 px-2">
                      {tier.id === "top-rated" ||
                      tier.id === "expert" ||
                      tier.id === "vip" ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2">Analytics Premium</td>
                  {BADGE_TIERS.map((tier) => (
                    <td key={tier.id} className="text-center py-2 px-2">
                      {tier.id === "top-rated" ||
                      tier.id === "expert" ||
                      tier.id === "vip" ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-2">Suporte Dedicado</td>
                  {BADGE_TIERS.map((tier) => (
                    <td key={tier.id} className="text-center py-2 px-2">
                      {tier.id === "vip" ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary & CTA */}
      <Card className="border-2 border-blue-600 bg-blue-50">
        <CardContent className="pt-6">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Selo:</span>
              <div className="flex items-center gap-2">
                {getBadgeIcon(selectedBadge)}
                <span className="font-bold">{selectedBadge.name}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Válido por:</span>
              <span className="font-bold">1 {selectedBadge.period}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-slate-600">Total:</span>
              <span className="text-2xl font-bold">
                R$ {selectedBadge.price.toFixed(2)}
              </span>
            </div>
          </div>
          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? "Processando..." : `Obter Selo ${selectedBadge.name}`}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-3">
            Renovação automática após 1 ano. Cancele quando quiser.
          </p>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">
            Posso ter vários selos ao mesmo tempo?
          </p>
          <p className="text-slate-500 mt-1">
            Você pode ter apenas 1 selo ativo. Ao atualizar, o anterior é substituído.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Quanto tempo o selo leva para aparecer?</p>
          <p className="text-slate-500 mt-1">
            Imediatamente após o pagamento ser confirmado.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Posso downgrade o meu selo?</p>
          <p className="text-slate-500 mt-1">
            Sim! Você pode downgrade para um selo mais barato a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
