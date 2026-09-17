"use client";

import { useState } from "react";
import { Check, Zap, FileCode, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface GigExtra {
  id: string;
  type: "express_delivery" | "extra_revision" | "source_files" | "priority_support";
  label: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  recommended?: boolean;
}

const EXTRAS: GigExtra[] = [
  {
    id: "express_delivery",
    type: "express_delivery",
    label: "Entrega Express",
    description: "Receba em 48h em vez de 5 dias",
    icon: <Zap className="h-5 w-5" />,
    price: 50,
    recommended: true,
  },
  {
    id: "extra_revision",
    type: "extra_revision",
    label: "Revisão Extra",
    description: "1 revisão adicional além do combinado",
    icon: <RotateCcw className="h-5 w-5" />,
    price: 40,
  },
  {
    id: "source_files",
    type: "source_files",
    label: "Arquivo-Fonte",
    description: "Receba os arquivos editáveis (PSD, Figma, etc)",
    icon: <FileCode className="h-5 w-5" />,
    price: 30,
  },
  {
    id: "priority_support",
    type: "priority_support",
    label: "Suporte Prioritário",
    description: "Resposta em até 2h (em vez de 24h)",
    icon: <Headphones className="h-5 w-5" />,
    price: 60,
  },
];

interface GigExtrasProps {
  basePrice: number;
  onExtrasChange?: (extras: { type: string; price: number }[], totalExtra: number) => void;
  disabled?: boolean;
}

/**
 * Gig Extras: Upsell in transaction
 * Shows on checkout → psychologically linked to purchase already made
 * Conversion: 30-40% users add at least one extra
 */
export function GigExtrasSelector({ basePrice, onExtrasChange, disabled = false }: GigExtrasProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const toggleExtra = (extraId: string) => {
    const newSelected = selectedExtras.includes(extraId)
      ? selectedExtras.filter((id) => id !== extraId)
      : [...selectedExtras, extraId];

    setSelectedExtras(newSelected);

    const selectedExtraObjects = EXTRAS.filter((e) => newSelected.includes(e.id));
    const totalExtra = selectedExtraObjects.reduce((sum, e) => sum + e.price, 0);

    if (onExtrasChange) {
      onExtrasChange(
        selectedExtraObjects.map((e) => ({ type: e.type, price: e.price })),
        totalExtra
      );
    }
  };

  const totalExtra = EXTRAS.reduce(
    (sum, e) => sum + (selectedExtras.includes(e.id) ? e.price : 0),
    0
  );
  const finalPrice = basePrice + totalExtra;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-slate-900 mb-1">
          ✨ Quer deixar o serviço ainda melhor?
        </h3>
        <p className="text-sm text-slate-700">
          Adicione extras e aproveite a entrega — muitos clientes já topam!
        </p>
      </div>

      {/* Extras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXTRAS.map((extra) => (
          <Card
            key={extra.id}
            className={`cursor-pointer transition ${
              selectedExtras.includes(extra.id)
                ? "border-blue-500 bg-blue-50"
                : "hover:border-blue-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !disabled && toggleExtra(extra.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={selectedExtras.includes(extra.id)}
                  disabled={disabled}
                  className="mt-1"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        {extra.icon}
                        {extra.label}
                        {extra.recommended && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                            POPULAR
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">{extra.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        +R$ {extra.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price Breakdown */}
      <Card className={selectedExtras.length > 0 ? "border-blue-500 bg-blue-50" : ""}>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Serviço</span>
              <span>R$ {basePrice.toFixed(2)}</span>
            </div>

            {totalExtra > 0 && (
              <>
                <div className="h-px bg-slate-200" />
                {EXTRAS.filter((e) => selectedExtras.includes(e.id)).map((extra) => (
                  <div key={extra.id} className="flex justify-between text-slate-600 text-xs">
                    <span>+ {extra.label}</span>
                    <span>R$ {extra.price.toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}

            <div className="h-px bg-slate-300 my-2" />

            <div className="flex justify-between font-bold text-lg text-slate-900">
              <span>Total</span>
              <span className="text-blue-600">R$ {finalPrice.toFixed(2)}</span>
            </div>

            {totalExtra > 0 && (
              <div className="text-xs text-green-700 font-semibold mt-2 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Você adicionou R$ {totalExtra.toFixed(2)} em valor
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Savings message */}
      {selectedExtras.length === 0 && (
        <div className="text-xs text-slate-500 text-center">
          💡 Tip: 70% dos clientes adicionam pelo menos um extra — torna o projeto mais valioso!
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for embed in proposal form
 */
export function GigExtrasCompact({ basePrice, onExtrasChange }: GigExtrasProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span>Quer adicionar extras?</span>
        <span className="text-xs opacity-70">+R$ até 180</span>
      </Button>

      {open && <GigExtrasSelector basePrice={basePrice} onExtrasChange={onExtrasChange} />}
    </div>
  );
}

/**
 * Display extras summary (order confirmation)
 */
export function GigExtrasSummary({
  extras,
}: {
  extras: Array<{ type: string; label: string; price: number }>;
}) {
  if (extras.length === 0) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="font-semibold text-green-900 mb-2">Extras incluídos</h4>
      <ul className="space-y-1">
        {extras.map((extra) => (
          <li key={extra.type} className="text-sm text-green-800 flex justify-between">
            <span>✓ {extra.label}</span>
            <span>+R$ {extra.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
