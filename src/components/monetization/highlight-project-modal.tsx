"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HighlightProjectModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const HIGHLIGHT_OPTIONS = [
  { days: 7, price: 29.9, label: "7 dias" },
  { days: 14, price: 49.9, label: "14 dias (melhor valor)" },
  { days: 30, price: 79.9, label: "30 dias" },
];

export function HighlightProjectModal({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: HighlightProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);

  const handleHighlight = async () => {
    setLoading(true);
    try {
      // TODO: hoje isso já marca o projeto como destacado (placeholder), mas
      // ainda não cobra de verdade — falta integrar o Card Brick do Mercado
      // Pago aqui e só chamar a API depois da confirmação do pagamento.
      const res = await fetch("/api/monetization/highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, days: selectedDays }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Falha ao destacar projeto");
      }

      toast.success("Projeto destacado com sucesso!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao destacar projeto";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>⭐ Destacar Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Apareça primeiro na lista e receba propostas mais rápido!
          </p>

          <div className="space-y-2">
            {HIGHLIGHT_OPTIONS.map((option) => (
              <button
                key={option.days}
                onClick={() => setSelectedDays(option.days)}
                className={`w-full p-3 rounded-lg border-2 transition ${
                  selectedDays === option.days
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-lg font-bold">R$ {option.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-slate-700">
              ✓ Destaque até {selectedDays} dias
              <br />✓ Aparece no topo da busca
              <br />✓ Badge especial no seu projeto
            </p>
          </div>

          <Button
            onClick={handleHighlight}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? "Processando..." : "Destacar Agora"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
