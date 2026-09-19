import { Check, Crown } from "lucide-react";
import { PlanCta } from "@/components/plan-cta";
import { PLANS } from "@/lib/plans-data";
import { isAssinyCheckoutReady } from "@/lib/payments/assiny-readiness";
import { cn } from "@/lib/utils";

export function PlansSection({ focusPaidPlans = false }: { focusPaidPlans?: boolean }) {
  const checkoutEnabled = isAssinyCheckoutReady();
  const plans = PLANS;
  return (
    <div className={cn("grid gap-8 lg:gap-6", focusPaidPlans ? "lg:grid-cols-3" : "lg:grid-cols-3")}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          id={`plano-${plan.id}`}
          className={cn(
            "relative flex scroll-mt-28 flex-col rounded-2xl border p-6 text-left",
            plan.popular
              ? "border-blue-600 bg-blue-600 text-white shadow-lg"
              : "border-slate-200 bg-white"
          )}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-yellow-300 bg-yellow-300 px-3 py-1 text-xs font-bold text-slate-950 shadow-sm">
              <Crown className="size-3.5" aria-hidden="true" />
              Mais escolhido
            </span>
          )}

          <p
            className={cn(
              "font-semibold",
              plan.popular ? "text-white" : "text-slate-900"
            )}
          >
            {plan.name}
          </p>

          <p className="mt-3 text-3xl font-extrabold">
            {plan.comingSoon ? (
              "Em breve"
            ) : (
              <>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(plan.priceMonthly)}
                <span
                  className={cn(
                    "text-base font-medium",
                    plan.popular ? "text-white" : "text-slate-500"
                  )}
                >
                  /mês
                </span>
              </>
            )}
          </p>

          <p
            className={cn(
              "mt-2 text-sm",
              plan.popular ? "text-white" : "text-slate-500"
            )}
          >
            {plan.description}
          </p>

          <ul className="mt-6 flex-1 space-y-3">
            {(focusPaidPlans && plan.id === "free"
              ? plan.features.filter((feature) => ["Criar perfil de freelancer", "Até 3 propostas por mês", "Acesso a projetos abertos"].includes(feature))
              : plan.features
            ).map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    plan.popular ? "text-blue-200" : "text-blue-600"
                  )}
                />
                <span className={plan.popular ? "text-white" : "text-slate-700"}>
                  {focusPaidPlans && feature === "Tudo do Grátis" ? "Recursos essenciais incluídos" : feature}
                </span>
              </li>
            ))}
          </ul>

          <PlanCta plan={plan} checkoutEnabled={checkoutEnabled} wrapperClassName="mt-6" />
          <div className={cn("mt-4 space-y-1 text-center text-xs leading-5", plan.popular ? "text-blue-100" : "text-slate-500")}>
            <p>{plan.id === 'free' ? '✓ Sem cartão de crédito' : '✓ Seguro com Assiny'}</p>
            <p>✓ Cancela quando quiser</p>
            {plan.id !== 'free' && <p>✓ Suporte 24h</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
