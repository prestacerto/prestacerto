import { ArrowRight, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { PlansSection } from "@/components/plans-section";
import { CategoryGrid } from "@/components/category-grid";
import { ServiceCard } from "@/components/services/service-card";
import { getCategories, listServices } from "@/lib/supabase/queries";

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
    description: "Envie propostas, negocie diretamente e combine o pagamento.",
  },
  {
    step: "PASSO 4",
    title: "Receba 100%",
    description: "O dinheiro vai direto do cliente pra você. Sem desconto.",
  },
];

export default async function Home() {
  const categories = await getCategories();
  const services = (await listServices({})).slice(0, 6);

  return (
    <>
      <section className="bg-[linear-gradient(160deg,#0b1220_0%,#101a33_55%,#16213f_100%)] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
            <Wallet className="size-4" />
            Assinatura fixa — nunca comissão por projeto
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Contrate freelancers sem
            <br />
            <span className="text-blue-400">pagar comissão nenhuma.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-300">
            Enquanto outras plataformas descontam 15% a 20% de cada projeto,
            o PrestaCerto cobra uma assinatura fixa por mês. O valor que você
            combinar com o cliente é o valor que cai na sua conta.
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
              <Wallet className="size-4 text-blue-400" />
              Pagamento direto ao freelancer
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-blue-400" />
              Planos a partir de R$ 0
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Explore por categoria
              </h2>
              <p className="mt-1 text-slate-500">
                Seis áreas, um único lugar pra encontrar quem faz.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Freelancers em destaque
                </h2>
                <p className="mt-1 text-slate-500">
                  Perfis ativos prontos pra começar um projeto agora.
                </p>
              </div>
              <LinkButton href="/services" variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="size-4" />
              </LinkButton>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

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

          <div className="mt-10 text-center">
            <LinkButton href="/como-funciona" variant="ghost" size="sm">
              Ver o passo a passo completo
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-[#101828] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Quanto uma comissão custa de verdade
              </h2>
              <p className="mt-3 text-slate-300">
                Num projeto de R$ 3.000, uma plataforma que cobra 18% de
                comissão fica com R$ 540 — todo mês, em todo projeto. No
                PrestaCerto você paga a mesma assinatura fixa, não importa
                quanto o projeto valha.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-6">
                  <p className="text-sm text-slate-400">Plataforma por comissão</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    − R$ 540
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    18% descontados de um projeto de R$ 3.000
                  </p>
                </div>
                <div className="bg-blue-600/20 p-6">
                  <p className="text-sm text-blue-200">PrestaCerto</p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    R$ 0 a 129
                  </p>
                  <p className="mt-1 text-xs text-blue-200">
                    assinatura mensal, o mesmo projeto de R$ 3.000 é 100% seu
                  </p>
                </div>
              </div>
            </div>
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
