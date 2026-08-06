"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Zap } from "lucide-react";

interface EarlyPaymentButtonProps {
  proposalId: string;
  amount: number; // Valor original capturado
  daysUntilRelease: number;
  onSuccess?: () => void;
}

export function EarlyPaymentButton({
  proposalId,
  amount,
  daysUntilRelease,
  onSuccess,
}: EarlyPaymentButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const FEE_PERCENTAGE = 0.0299; // 2.99%
  const fee = amount * FEE_PERCENTAGE;
  const netAmount = amount - fee;

  const handleEarlyPayment = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com Mercado Pago Brick
      // 1. Chamar API pra criar preference (fee value)
      // 2. Renderizar Card Brick
      // 3. Após sucesso, chamar createEarlyPaymentRequest() + capturar no MP

      toast.success("Pagamento antecipado processado!");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erro ao processar antecipação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Zap className="w-4 h-4" />
        Receber Agora
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Receber Pagamento Agora
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Antecipação de Pagamento</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Receba agora em vez de esperar {daysUntilRelease} dias. Uma pequena taxa se aplica.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-b py-3">
              <div className="flex justify-between text-sm">
                <span>Valor original</span>
                <span>R$ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Taxa de antecipação (2.99%)</span>
                <span>-R$ {fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Você recebe</span>
                <span className="text-green-600">R$ {netAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              O pagamento será depositado na sua conta em até 30 minutos após a confirmação.
            </p>

            <Button
              onClick={handleEarlyPayment}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              size="lg"
            >
              {loading ? "Processando..." : "Confirmar Antecipação"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full"
            >
              Esperar {daysUntilRelease} dias (grátis)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
