"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PlanDefinition } from "@/lib/plans-data";

export function PlanCta({
  plan,
  wrapperClassName,
}: {
  plan: PlanDefinition;
  wrapperClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const solidButtonClass = plan.popular
    ? "bg-white text-blue-700 hover:bg-blue-50"
    : "bg-slate-900 hover:bg-slate-800";

  if (plan.id === "free") {
    return (
      <LinkButton href="/register" className={cn(wrapperClassName, solidButtonClass)}>
        Começar grátis
      </LinkButton>
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
        Anotado! Vamos entrar em contato pra ativar seu {plan.name}.
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
      Quero assinar {plan.name}
    </Button>
  );
}
