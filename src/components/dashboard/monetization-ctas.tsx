"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Dialog import removido - usando modal simples
import {
  Zap,
  Calendar,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Building2,
} from "lucide-react";
import { BuyCreditsModal } from "@/components/modals/buy-credits-modal";
import { CreditsSubscriptionModal } from "@/components/modals/credits-subscription-modal";
import { BadgeUpgradeModal } from "@/components/modals/badge-upgrade-modal";
import { PriorityBoostModal } from "@/components/modals/priority-boost-modal";
import { CompanyVerificationModal } from "@/components/modals/company-verification-modal";

interface CTAItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface CTAGroup {
  title: string;
  subtitle: string;
  items: CTAItem[];
}

// Consolidado de 6 cards soltos pra 3 grupos claros — menos opção pra
// decidir de uma vez, mais fácil de entender o que cada coisa faz.
const CTA_GROUPS: CTAGroup[] = [
  {
    title: "Apareça mais",
    subtitle: "Ganhe visibilidade extra nos resultados de busca",
    items: [
      {
        id: "priority-boost",
        title: "Destaque Rápido",
        description: "Apareça no topo por 3-14 dias",
        icon: Target,
        color: "from-orange-500 to-red-600",
        badge: "25-100% mais propostas",
      },
      {
        id: "credits-buy",
        title: "Comprar Créditos",
        description: "Compra avulsa pra usar em destaque, sob demanda",
        icon: Zap,
        color: "from-blue-500 to-blue-600",
        badge: "Pagar conforme usa",
      },
      {
        id: "credits-sub",
        title: "Assinatura de Créditos",
        description: "Créditos todo mês, com economia",
        icon: Calendar,
        color: "from-green-500 to-emerald-600",
        badge: "Economize 60%",
      },
    ],
  },
  {
    title: "Prove que é bom",
    subtitle: "Selos e verificações que aumentam a confiança de quem contrata",
    items: [
      {
        id: "badges",
        title: "Selos de Verificação",
        description: "4 tiers: Verificado até VIP",
        icon: Trophy,
        color: "from-purple-500 to-pink-600",
        badge: "40-60% mais demanda",
      },
      {
        id: "company-verification",
        title: "Verificação Empresa",
        description: "Valide seu CNPJ — aumente confiança",
        icon: Building2,
        color: "from-indigo-500 to-purple-600",
        badge: "Clientes confiam mais",
      },
    ],
  },
  {
    title: "Vá além do básico",
    subtitle: "Recursos extras pra quem quer se diferenciar de verdade",
    items: [
      {
        id: "portfolio-premium",
        title: "Portfólio Premium",
        description: "Sempre em destaque + analytics",
        icon: Star,
        color: "from-yellow-500 to-orange-600",
      },
    ],
  },
];

const CTA_ITEMS: CTAItem[] = CTA_GROUPS.flatMap((group) => group.items);

export function MonetizationCTAs() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    "default-project"
  );
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>(
    "Seu Projeto"
  );

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      "from-blue-500 to-blue-600": "bg-gradient-to-br from-blue-500 to-blue-600",
      "from-green-500 to-emerald-600":
        "bg-gradient-to-br from-green-500 to-emerald-600",
      "from-purple-500 to-pink-600":
        "bg-gradient-to-br from-purple-500 to-pink-600",
      "from-orange-500 to-red-600":
        "bg-gradient-to-br from-orange-500 to-red-600",
      "from-yellow-500 to-orange-600":
        "bg-gradient-to-br from-yellow-500 to-orange-600",
      "from-rose-500 to-pink-600": "bg-gradient-to-br from-rose-500 to-pink-600",
    };
    return colors[color] || "bg-gradient-to-br from-blue-500 to-blue-600";
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "credits-buy":
        return <BuyCreditsModal />;
      case "credits-sub":
        return <CreditsSubscriptionModal />;
      case "badges":
        return <BadgeUpgradeModal />;
      case "priority-boost":
        return (
          <PriorityBoostModal
            projectId={selectedProjectId}
            projectTitle={selectedProjectTitle}
          />
        );
      case "company-verification":
        return <CompanyVerificationModal />;
      case "portfolio-premium":
        return (
          <div className="space-y-4">
            <p className="text-slate-600">
              Em breve: seu portfólio sempre em destaque
            </p>
            <p className="text-sm text-slate-500">
              Volte em breve para ativar o Portfólio Premium!
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Mais formas de se destacar
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Combine estratégias para ganhar mais sem pagar comissão
        </p>
      </div>

      {/* 3 grupos, em vez de 6 cards soltos */}
      <div className="space-y-8">
        {CTA_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="font-semibold text-slate-900">{group.title}</h3>
            <p className="text-sm text-slate-500">{group.subtitle}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((cta) => {
                const Icon = cta.icon;
                return (
                  <Card
                    key={cta.id}
                    className="group hover:shadow-lg transition overflow-hidden cursor-pointer"
                    onClick={() => setActiveModal(cta.id)}
                  >
                    <CardContent className="p-6">
                      {/* Header with gradient bg */}
                      <div className={`${getColorClasses(cta.color)} p-4 rounded-lg mb-4 flex items-center justify-between`}>
                        <Icon className="h-6 w-6 text-white" />
                        {cta.badge && (
                          <span className="text-xs font-bold text-white bg-black/20 px-2 py-1 rounded">
                            {cta.badge}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="font-bold text-slate-900 mb-1">{cta.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{cta.description}</p>

                      {/* CTA Button */}
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal(cta.id);
                        }}
                      >
                        Saiba Mais
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Combine recursos */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="pt-6 flex gap-4">
          <TrendingUp className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-900">
              Combine créditos, selos e destaque
            </p>
            <p className="text-sm text-emerald-800 mt-1">
              Use os recursos acima juntos pra aumentar sua visibilidade na plataforma.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal Simples */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {CTA_ITEMS.find((c) => c.id === activeModal)?.title}
              </CardTitle>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>{renderModalContent()}</CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
