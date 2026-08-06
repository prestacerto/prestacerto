"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface VerificationBadgeProps {
  freelancerId: string;
  isVerified: boolean;
  onSuccess?: () => void;
}

export function VerificationBadgeButton({ freelancerId, isVerified, onSuccess }: VerificationBadgeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago Brick
      // 1. Chamar API pra criar preference (R$ 9,90)
      // 2. Renderizar Card Brick
      // 3. Após sucesso, chamar addVerificationBadge()

      toast.success("Perfil verificado! Badge adicionado.");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao verificar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        Perfil Verificado
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs"
      >
        ✓ Verificar Perfil — R$ 9,90
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>✓ Verificar seu Perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Adicione um selo de verificação ao seu perfil e ganhe confiança dos clientes!
            </p>

            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <p className="font-medium text-green-900">Benefícios:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Badge "Verificado" no seu perfil</li>
                <li>✓ Aparece destacado na busca</li>
                <li>✓ Aumenta confiança dos clientes</li>
                <li>✓ Válido por 1 ano</li>
              </ul>
            </div>

            <div className="text-2xl font-bold text-center">R$ 9,90</div>

            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading ? "Processando..." : "Verificar Agora"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function VerificationBadgeDisplay() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span className="text-xs font-semibold text-green-700">Verificado</span>
    </div>
  );
}
