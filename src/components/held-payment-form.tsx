"use client";

import { useEffect } from "react";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeldPaymentFormProps {
  projectId: string;
  amount: number;
  payerEmail: string;
}

// Formulário de cartão do próprio Mercado Pago (Card Payment Brick) — o
// número do cartão nunca passa pelo nosso servidor, só o token gerado no
// navegador. Só aceita crédito: débito não suporta retenção/captura manual.
export function HeldPaymentForm({ projectId, amount, payerEmail }: HeldPaymentFormProps) {
  const router = useRouter();
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? null;

  // Efeito puro de sincronização com o SDK externo do Mercado Pago — o
  // próprio Brick aguarda essa instância internamente antes de renderizar
  // o formulário, então não precisamos de um estado "pronto" aqui.
  useEffect(() => {
    if (publicKey) initMercadoPago(publicKey, { locale: "pt-BR" });
  }, [publicKey]);

  if (!publicKey) {
    return (
      <p className="text-sm text-red-600">
        Pagamento indisponível: NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY não configurada.
      </p>
    );
  }

  return (
    <CardPayment
      initialization={{ amount, payer: { email: payerEmail } }}
      customization={{
        paymentMethods: {
          types: { included: ["credit_card"] },
        },
      }}
      onSubmit={async (formData) => {
        const res = await fetch("/api/mercadopago/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            card: {
              token: formData.token,
              payment_method_id: formData.payment_method_id,
              issuer_id: formData.issuer_id,
              installments: formData.installments,
            },
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          toast.error("Não foi possível reter o pagamento", { description: body?.error });
          return;
        }

        toast.success(
          "Pagamento retido! Ele será liberado pro freelancer quando você confirmar a entrega."
        );
        router.refresh();
      }}
      onError={(error) => {
        console.error("Card Payment Brick error:", error);
        toast.error("Erro no formulário de pagamento. Confira os dados do cartão.");
      }}
    />
  );
}
