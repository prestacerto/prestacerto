import { Check } from "lucide-react";
import { PlanCta } from "@/components/plan-cta";
import { PLANS } from "@/lib/plans-data";
import { cn } from "@/lib/utils";

export function PlansSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-2xl border p-6 text-left",
            plan.popular
              ? "border-blue-600 bg-blue-600 text-white shadow-lg"
              : "border-slate-200 bg-white"
          )}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
              MAIS POPULAR
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
                R$ {plan.priceMonthly}
                <span
                  className={cn(
                    "text-base font-medium",
                    plan.popular ? "text-blue-100" : "text-slate-500"
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
              plan.popular ? "text-blue-100" : "text-slate-500"
            )}
          >
            {plan.description}
          </p>

          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    plan.popular ? "text-blue-200" : "text-blue-600"
                  )}
                />
                <span className={plan.popular ? "text-white" : "text-slate-700"}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <PlanCta plan={plan} wrapperClassName="mt-6" />
        </div>
      ))}
    </div>
  );
}
