import { PlansSection } from "@/components/plans-section";
import { CertoGrowthCatalog } from "@/components/monetization/certo-growth-catalog";

export const metadata = { title: "Planos — PrestaCerto" };

const faqs = [
  {
    q: "Por que assinatura em vez de comissão por projeto?",
    a: "Porque assim você sabe exatamente quanto vai pagar todo mês, sem surpresas, e recebe 100% do valor combinado com o cliente — sem descontos por projeto.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. O plano Grátis não tem cobrança nenhuma, e os planos pagos poderão ser cancelados a qualquer momento.",
  },
  {
    q: "Como funciona o pagamento entre cliente e freelancer?",
    a: "Depois que a proposta é aceita, o cliente paga pelo checkout do Mercado Pago e o valor vai direto pra conta do freelancer — a PrestaCerto não recebe nem retém o dinheiro, e não cobra nenhuma taxa sobre o valor.",
  },
  {
    q: "O que muda no plano Business?",
    a: "Além de tudo do Pro, o Business permite criar uma equipe e convidar até 5 pessoas pra trabalhar na mesma conta.",
  },
];

export default function PlansPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Planos simples, sem comissão
        </h1>
        <p className="mt-2 text-slate-500">
          Pague uma assinatura fixa e receba 100% do valor dos seus projetos.
        </p>
      </div>

      <div className="mt-12">
        <PlansSection />
      </div>

      <CertoGrowthCatalog />

      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Perguntas frequentes
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold text-slate-900">{faq.q}</h3>
              <p className="mt-1 text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
