import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PlansSection } from "@/components/plans-section";
import { isAssinyCheckoutReady } from "@/lib/payments/assiny-readiness";
import { getPageMetadata } from "@/lib/seo/metadata";
import { PlanCta } from "@/components/plan-cta";
import { PLANS } from "@/lib/plans-data";
import { StructuredData, getFAQSchema, getBreadcrumbSchema } from "@/components/structured-data";

export const metadata = getPageMetadata("Planos: Grátis, Pro e Business", "Compare os planos do PrestaCerto: grátis, Pro por R$ 59,90/mês e Business por R$ 139,90/mês. Escolha os recursos para seu trabalho e comece hoje.", "/plans");

const faqs = [
  { q: "Preciso pagar para usar o PrestaCerto?", a: "Não. O plano Grátis permite criar perfil, acessar projetos abertos e enviar até 3 propostas por mês. Os planos pagos são opcionais." },
  { q: "Posso cancelar quando quiser?", a: "Consulte as condições de cancelamento e de acesso no checkout e no comprovante da assinatura. Se precisar de ajuda com sua assinatura, fale com nosso suporte pela página de contato." },
  { q: "Como funciona a cobrança?", a: "O pagamento é processado no checkout do Assiny, com preço e condições exibidos antes da confirmação. A assinatura é mensal e renovada automaticamente até você cancelar." },
  { q: "O pagamento entre cliente e profissional acontece na plataforma?", a: "Não. Cliente e profissional combinam o pagamento diretamente entre si. A assinatura cobre apenas os recursos da plataforma." },
];

// Página pública de propósito: o link "Planos" está no menu para visitantes, e
// exigir login aqui esconderia o preço de quem ainda vai decidir assinar.
export default async function PlansPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const checkoutEnabled = isAssinyCheckoutReady();
  const { plan } = await searchParams;
  const selectedPlan = PLANS.find(item => item.id !== 'free' && item.id === plan);
  return <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <StructuredData type="FAQPage" data={getFAQSchema(faqs.map(faq => ({ question: faq.q, answer: faq.a })))} />
    <StructuredData type="BreadcrumbList" data={getBreadcrumbSchema([{ name: 'Início', url: 'https://prestacerto.com.br' }, { name: 'Planos', url: 'https://prestacerto.com.br/plans' }])} />
    <nav aria-label="Você está em" className="mb-5 text-sm text-slate-600"><Link href="/" className="underline underline-offset-4">Início</Link><span aria-hidden="true"> / </span><span>Planos</span></nav>
    <section className="rounded-[2rem] border border-blue-100 bg-[#f4f7ff] px-6 py-10 text-center sm:px-10 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Planos</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Comece grátis. Assine quando fizer sentido.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Crie seu perfil e envie propostas sem pagar nada. Os planos Pro e Business são para quem quer mais visibilidade e propostas ilimitadas.</p>
      <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left text-sm leading-6 text-blue-900"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><p>{checkoutEnabled ? "Preço e condições aparecem no checkout antes da confirmação." : "Novas assinaturas Pro e Business estão temporariamente indisponíveis. Você pode continuar com o cadastro gratuito."}</p></div>
    </section>
    {selectedPlan && <section id="continuar-assinatura" aria-labelledby="selected-plan-title" className="mt-8 flex scroll-mt-28 flex-col gap-5 rounded-2xl border-2 border-blue-600 bg-blue-50 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Sua escolha está salva</p><h2 id="selected-plan-title" className="mt-1 text-xl font-bold text-slate-950">{selectedPlan.name} · {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.priceMonthly)}/mês</h2><p className="mt-2 text-sm text-slate-600">Continue para escolher como pagar e confirmar sua assinatura no Assiny.</p></div>
      <PlanCta plan={{ ...selectedPlan, popular: false }} checkoutEnabled={checkoutEnabled} wrapperClassName="sm:min-w-44" />
    </section>}
    <div className="mt-12"><PlansSection /></div>
    <section className="mt-12 rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-8"><h2 className="text-2xl font-black">Quer testar o Certo AI?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Conheça o apoio de escrita disponível no fluxo de propostas. Você revisa o texto antes de enviar.</p><Link href="/certo-ai" className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-500">Conhecer o Certo AI <ArrowRight className="ml-2 size-4" /></Link></section>
    <section className="mx-auto mt-16 max-w-2xl"><h2 className="text-center text-2xl font-bold">Perguntas frequentes</h2><div className="mt-8 space-y-6">{faqs.map((faq) => <div key={faq.q}><h3 className="font-semibold">{faq.q}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{faq.a}</p></div>)}</div></section>
  </div>;
}
