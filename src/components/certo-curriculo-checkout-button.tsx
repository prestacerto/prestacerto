"use client";

import { useState } from "react";
import { toast } from "sonner";

export function CertoCurriculoCheckoutButton({ configured }: { configured: boolean }) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/certo-curriculo/checkout", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        toast.error("Checkout indisponível", { description: data.error || "Tente novamente mais tarde." });
        return;
      }
      window.location.assign(data.checkoutUrl);
    } catch {
      toast.error("Checkout indisponível", { description: "Tente novamente mais tarde." });
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">Checkout em configuração segura. Nenhuma cobrança está disponível agora.</p>;
  }

  return <button type="button" onClick={startCheckout} disabled={loading} className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading ? "Abrindo checkout..." : "Continuar para pagamento seguro"}</button>;
}
