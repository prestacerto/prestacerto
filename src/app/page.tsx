import { ArrowRight, CreditCard, Shield, Zap } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { PlansSection } from "@/components/plans-section";

const steps = [
  {
    step: "PASSO 1",
    title: "Crie seu perfil",
    description: "Cadastre seus serviços, habilidades e portfólio em minutos.",
  },
  {
    step: "PASSO 2",
    title: "Encontre oportunidades",
    description: "Navegue por projetos abertos ou seja encontrado por clientes.",
  },
  {
    step: "PASSO 3",
    title: "Feche o negócio",
    description: "Envie propostas, negocie diretamente e comece a trabalhar.",
  },
  {
    step: "PASSO 4",
    title: "Receba 100%",
    description: "Sem comissões. O pagamento é direto entre você e o cliente.",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-[#101828] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <Zap className="size-4" />
            Modelo por assinatura — sem taxas por projeto
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Contrate talentos.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sem comissões.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            A plataforma que conecta freelancers e clientes com um modelo
            justo: assinatura fixa, pagamento direto, sem surpresas.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton
              href="/projects"
              size="lg"
              className="bg-blue-600 hover:bg-blue-500"
            >
              Encontrar projetos
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton
              href="/services"
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Contratar freelancers
            </LinkButton>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CreditCard className="size-4 text-blue-400" />
              Sem comissão por projeto
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="size-4 text-blue-400" />
              Pagamento direto ao freelancer
            </span>
            <span className="inline-flex items-center gap-2">
              <Shield className="size-4 text-blue-400" />
              Assinatura simples e transparente
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">Como funciona</h2>
          <p className="mt-2 text-slate-500">
            Simples, direto e sem burocracia.
          </p>

          <div className="mt-12 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step}>
                <p className="text-xs font-semibold tracking-wide text-blue-600">
                  {item.step}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Planos simples, sem comissão
          </h2>
          <p className="mt-2 text-slate-500">
            Pague uma assinatura fixa e receba 100% do valor dos seus
            projetos.
          </p>

          <div className="mt-12">
            <PlansSection />
          </div>
        </div>
      </section>
    </>
  );
}
