"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getCheckoutUrl, type PlanDefinition } from "@/lib/plans-data";
import { authDestination, planDestination } from "@/lib/auth/destination";
import { trackAnalyticsEvent } from "@/components/analytics";
import { rememberAssinyCheckout } from "@/lib/payments/assiny-checkout-state";

export function PlanCta({
  plan,
  wrapperClassName,
  checkoutEnabled = false,
}: {
  plan: PlanDefinition;
  wrapperClassName?: string;
  checkoutEnabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const solidButtonClass = plan.popular
    ? "bg-white text-blue-700 hover:bg-blue-50"
    : "bg-slate-900 text-white hover:bg-slate-800";

  if (plan.id === "free") {
    return (
      <LinkButton href="/register" className={cn(wrapperClassName, "min-h-11 w-full", solidButtonClass)}>
        Começar grátis
      </LinkButton>
    );
  }

  if (!checkoutEnabled) {
    return <div className={wrapperClassName}>
      <Button disabled className={cn("h-auto min-h-11 w-full whitespace-normal py-3", solidButtonClass)}>Assinar {plan.name}</Button>
      <p className={cn("mt-3 text-center text-sm leading-5", plan.popular ? "text-blue-100" : "text-slate-500")}>Pagamento do {plan.name} em preparação. A assinatura estará disponível após a conclusão da integração.</p>
    </div>;
  }

  // A referência é criada no servidor para a conta autenticada. Um link
  // público sem vínculo não comprova quem deve receber a assinatura.
  const checkoutUrl = getCheckoutUrl(plan);
  if (checkoutUrl) {
    return (
      <Button disabled={loading} className={cn(wrapperClassName, "min-h-11 w-full", solidButtonClass)}
        onClick={async () => {
          setLoading(true);
          try { trackAnalyticsEvent('select_plan', { plan: plan.id, currency: 'BRL', value: plan.priceMonthly }); } catch { /* Tracking must never block checkout. */ }
          try {
            const response = await fetch('/api/payments/assiny-checkout', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: plan.id }),
            });
            if (response.status === 401) { window.location.assign(authDestination('login', planDestination(plan.id))); return; }
            const result = await response.json();
            if (!response.ok || !result.url) throw new Error(result.error || 'Não foi possível abrir a assinatura.');
            rememberAssinyCheckout(plan.id as 'pro' | 'business');
            try { trackAnalyticsEvent('begin_checkout', { plan: plan.id, currency: 'BRL', value: plan.priceMonthly }); } catch { /* Tracking must never block checkout. */ }
            window.location.assign(result.url);
          } catch (error) { toast.error(error instanceof Error ? error.message : 'Tente novamente em instantes.'); }
          finally { setLoading(false); }
        }}>
        {loading ? 'Abrindo assinatura...' : `Assinar ${plan.name}`}
      </Button>
    );
  }

  if (done) {
    return (
      <p
        className={cn(
          wrapperClassName,
          "flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-center text-sm",
          plan.popular ? "text-blue-100" : "text-slate-500"
        )}
      >
        Interesse registrado. Avisaremos quando a assinatura estiver disponível.
      </p>
    );
  }

  if (open) {
    return (
      <form
        className={cn(wrapperClassName, "flex gap-2")}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await fetch("/api/plan-interest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, plan: plan.id }),
          });
          setLoading(false);
          if (res.ok) {
            setDone(true);
          } else {
            toast.error("Não foi possível registrar seu interesse. Tente de novo.");
          }
        }}
      >
        <Input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn("min-w-0 flex-1", !plan.popular && "bg-white")}
        />
        <Button
          type="submit"
          nativeButton
          disabled={loading}
          className={cn("shrink-0", solidButtonClass)}
        >
          {loading ? "..." : "OK"}
        </Button>
      </form>
    );
  }

  return (
    <Button
      type="button"
      nativeButton
      className={cn(wrapperClassName, "w-full", solidButtonClass)}
      onClick={() => setOpen(true)}
    >
      Quero receber informações sobre o {plan.name}
    </Button>
  );
}
