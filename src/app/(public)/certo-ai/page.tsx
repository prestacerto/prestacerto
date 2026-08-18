import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  EyeOff,
  FileText,
  PenLine,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Certo AI — Propostas melhores, mantendo sua voz",
  description:
    "Copiloto de propostas para freelancers: escreva do seu jeito, receba uma sugestão mais clara e revise antes de enviar.",
  alternates: { canonical: "/certo-ai" },
  openGraph: {
    title: "Certo AI — Propostas melhores, mantendo sua voz",
    description:
      "Melhore clareza, estrutura e especificidade das suas propostas sem inventar informações.",
    url: "/certo-ai",
  },
};

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Escreva do seu jeito",
    description: "Comece com qualquer rascunho. Você não precisa encontrar as palavras perfeitas de primeira.",
  },
  {
    number: "02",
    icon: WandSparkles,
    title: "Receba uma sugestão",
    description: "O Certo AI organiza a mensagem, destaca o que é relevante e deixa o texto mais fácil de entender.",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Revise e envie",
    description: "Compare as versões, edite o que quiser e só envie quando a proposta representar você.",
  },
];

const benefits = [
  "Mantém seu tom natural",
  "Não inventa experiência ou resultados",
  "Sugere uma abertura específica para o projeto",
  "Ajuda a explicar sua forma de trabalhar",
  "Organiza prazo, escopo e próximo passo",
  "Funciona antes do envio da proposta",
];

export default function CertoAILanding() {
  return (
    <div className="bg-[#f7f9ff] text-slate-950">
      <section className="border-b border-blue-100 bg-gradient-to-br from-[#eef4ff] via-white to-[#f8fbff]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
              <Sparkles className="size-4" /> Copiloto de propostas para freelancers
            </div>
            <h1 className="mt-7 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Propostas melhores.
              <br />
              <span className="text-blue-600">Sua voz continua.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Escreva livremente e receba uma sugestão mais clara, específica e profissional. Você revisa tudo antes de enviar.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                Começar grátis <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link href="#como-funciona" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50">
                Ver como funciona
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-600" /> Revisão antes do envio</span>
              <span className="inline-flex items-center gap-1.5"><EyeOff className="size-3.5 text-emerald-600" /> Não aparece para o cliente</span>
              <span className="inline-flex items-center gap-1.5"><FileText className="size-3.5 text-emerald-600" /> Texto editável</span>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Simples por design</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Você escreve. O Certo AI organiza.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">Uma ajuda prática no momento em que uma boa proposta pode fazer diferença.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.18em] text-blue-600">{step.number}</span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-5" /></span>
                </div>
                <h3 className="mt-8 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><ShieldCheck className="size-3.5" /> Controle continua com você</div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">A IA ajuda nos bastidores. A proposta é sua.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">O cliente recebe a proposta final que você revisou. O Certo AI não envia nada sozinho, não altera seu perfil e não inventa fatos para parecer mais convincente.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />{benefit}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Comece sem complicação</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Uma ferramenta útil no seu ritmo</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">Teste a experiência e escolha o plano que faz sentido para a sua rotina.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-bold">Comece grátis</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Conheça o fluxo de melhoria e envie propostas com mais clareza.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {["Sugestões de texto", "Revisão antes do envio", "Proposta sempre editável"].map((item) => <li key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />{item}</li>)}
            </ul>
            <Link href="/register" className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100">Criar conta</Link>
          </div>
          <div className="relative rounded-2xl border-2 border-blue-600 bg-slate-950 p-7 text-white shadow-xl shadow-blue-900/10">
            <span className="absolute -top-3 right-5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide">Para quem envia sempre</span>
            <h3 className="text-xl font-bold">Certo AI Pro</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Mais recursos para freelancers que querem criar propostas com consistência.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {["Otimizações ampliadas", "Insights de melhoria", "Recursos premium do marketplace"].map((item) => <li key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-blue-300" />{item}</li>)}
            </ul>
            <Link href="/plans" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500">Ver planos</Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Sua próxima proposta pode começar melhor.</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">Crie sua conta e experimente uma forma mais simples de revisar o que você já sabe fazer.</p>
          <Link href="/register" className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Começar agora <ArrowRight className="ml-2 size-4" /></Link>
        </div>
      </section>
    </div>
  );
}
