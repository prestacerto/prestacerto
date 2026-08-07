"use client";

import { useState } from "react";
import { Check, Loader } from "lucide-react";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "mês",
    description: "Para freelancers que querem crescer",
    features: [
      "Propostas ilimitadas",
      "Badge verificado",
      "Prioridade em buscas",
      "Time Tracking básico",
      "Analytics simples",
      "Suporte prioritário",
    ],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: 129,
    period: "mês",
    description: "Para agências e times",
    features: [
      "Tudo do Pro +",
      "Equipe (até 5 membros)",
      "Projetos privados",
      "Premium Analytics",
      "Integração API",
      "Gerente de conta",
    ],
    popular: true,
  },
];

export function CheckoutForm() {
  const [selected, setSelected] = useState("business");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const plan = PLANS.find((p) => p.id === selected)!;

  const handleCheckout = async () => {
    if (!email) {
      alert("Por favor, preencha seu e-mail");
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrar com Mercado Pago
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selected,
          email,
          amount: plan.price,
        }),
      });

      if (!response.ok) throw new Error("Falha no checkout");

      const { preferenceUrl } = await response.json();
      window.location.href = preferenceUrl;
    } catch (error) {
      alert("Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Plan Cards */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {PLANS.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`relative rounded-lg border-2 p-8 cursor-pointer transition-all ${
              selected === p.id
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950 shadow-lg"
                : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-4 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MAIS POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {p.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {p.description}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                R$ {p.price}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                /{p.period}
              </span>
            </div>

            <ul className="space-y-3">
              {p.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-slate-700 dark:text-slate-300">
                  <Check className="size-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {selected === p.id && (
              <div className="mt-6 p-3 bg-green-100 dark:bg-green-950 rounded-lg text-sm text-green-700 dark:text-green-300 text-center font-semibold">
                ✓ Plano selecionado
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Email & Checkout */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Confirmar Pagamento
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Summary */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-600 dark:text-slate-400">
              {plan.name} - R$ {plan.price}/mês
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              R$ {plan.price}
            </span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              R$ {plan.price}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || !email}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader className="size-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Ir para Pagamento"
          )}
        </button>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
          💳 Pagamento seguro via Mercado Pago
          Pode cancelar a qualquer momento
        </p>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3 text-center">
        <div>
          <p className="text-2xl mb-2">🔒</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            100% Seguro
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Criptografia SSL
          </p>
        </div>
        <div>
          <p className="text-2xl mb-2">💰</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Sem Surpresas
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cancele quando quiser
          </p>
        </div>
        <div>
          <p className="text-2xl mb-2">⚡</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Acesso Imediato
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ativa na hora
          </p>
        </div>
      </div>
    </div>
  );
}
