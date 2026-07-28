"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PayButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const res = await fetch("/api/mercadopago/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (!res.ok) {
      setLoading(false);
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível iniciar o pagamento", { description: body?.error });
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <Button type="button" nativeButton disabled={loading} onClick={handlePay}>
      {loading ? "Preparando pagamento..." : "Pagar com Mercado Pago"}
    </Button>
  );
}
