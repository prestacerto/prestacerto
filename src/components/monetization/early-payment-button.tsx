"use client";

import { AlertCircle } from "lucide-react";

interface EarlyPaymentButtonProps {
  proposalId: string;
  amount: number;
  daysUntilRelease: number;
  onSuccess?: () => void;
}

export function EarlyPaymentButton({
  amount,
  daysUntilRelease,
}: EarlyPaymentButtonProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-700" />
        <div>
          <p className="font-semibold">Antecipação em validação</p>
          <p className="mt-1 leading-6">
            Este projeto tem pagamento de R$ {amount.toFixed(2)}, mas a antecipação ainda não está liberada na operação final.
            Por enquanto, o recebimento segue o prazo normal de até {daysUntilRelease} dias após a confirmação.
          </p>
        </div>
      </div>
    </div>
  );
}
