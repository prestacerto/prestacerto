"use client";

import { CheckCircle2 } from "lucide-react";

interface PaymentProgressProps {
  status: "processing" | "confirming" | "completed" | "error";
  message?: string;
}

const PROGRESS_BY_STATUS: Record<PaymentProgressProps["status"], number> = {
  processing: 35,
  confirming: 85,
  completed: 100,
  error: 0,
};

export function PaymentProgress({ status, message }: PaymentProgressProps) {
  const progress = PROGRESS_BY_STATUS[status];

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Processando seu pagamento...";
      case "confirming":
        return "Confirmando com o banco...";
      case "completed":
        return "Pagamento confirmado! ✅";
      case "error":
        return "Erro ao processar pagamento";
      default:
        return message || "";
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              status === "error"
                ? "bg-red-500"
                : status === "completed"
                  ? "bg-green-500"
                  : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{progress}%</span>
          <span>Protegido por Mercado Pago</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center py-4">
        {status === "completed" ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
            <p className="font-semibold text-green-900">{getStatusMessage()}</p>
            <p className="text-sm text-green-700">
              Você receberá um e-mail de confirmação em breve.
            </p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">✕</span>
            </div>
            <p className="font-semibold text-red-900">{getStatusMessage()}</p>
            <p className="text-sm text-red-700">Tente novamente ou use outro método.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin">
              <div className="h-10 w-10 rounded-full border-4 border-blue-200 border-t-blue-500" />
            </div>
            <p className="font-semibold text-blue-900">{getStatusMessage()}</p>
            <p className="text-sm text-slate-500">Não feche esta página...</p>
          </div>
        )}
      </div>
    </div>
  );
}
