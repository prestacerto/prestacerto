import { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout - PrestaCerto",
  description: "Escolha seu plano e comece a ganhar mais",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Escolha seu Plano
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Desbloqueie ferramentas premium e ganhe mais
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
// rebuild trigger Fri Aug  7 13:19:35 -03 2026
