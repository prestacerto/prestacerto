import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { RegionalProfessionalLeadForm } from "@/components/regional-professional-lead-form";
import { CIDADES, getLandingCity } from "@/lib/data/landing-data";
import { getPageMetadata } from '@/lib/seo/metadata';
import { indexingRobots } from '@/lib/seo/discovery';

type Params = { cidade: string };

export function generateStaticParams() {
  return Object.keys(CIDADES).map((cidade) => ({ cidade }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cidade: slug } = await params;
  const city = getLandingCity(slug);
  if (!city) notFound();
  const title = `Oportunidades para prestadores em ${city.name}/${city.state}`;
  const description = `Crie seu perfil profissional no PrestaCerto em ${city.name}, conheça oportunidades da região e simule o preço do seu serviço.`;
  // These are regional signup entry points, with no local listing inventory.
  return { ...getPageMetadata(title, description, `/prestadores/${slug}`), robots: indexingRobots(false) };
}

export default async function RegionalProfessionalsPage({ params }: { params: Promise<Params> }) {
  const { cidade: slug } = await params;
  const city = getLandingCity(slug);
  if (!city) notFound();
  return <div className="min-h-screen bg-[#f7fbff] text-slate-950">
    <section className="border-b border-blue-100 bg-[#e8f3ff]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_400px] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-blue-700"><MapPin className="size-3.5" /> {city.name}, {city.state}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-6xl">Seu próximo projeto pode começar com um perfil mais claro.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">O PrestaCerto ajuda prestadores de {city.name} a apresentar seus serviços, acompanhar oportunidades e preparar propostas com mais organização.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/register?role=freelancer" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Criar perfil grátis <ArrowRight className="ml-2 size-4" /></Link><Link href="/ferramentas/calculadora" className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-800 transition hover:border-blue-400"><Calculator className="mr-2 size-4" /> Simular preço e ganho</Link></div>
          <p className="mt-5 text-sm text-slate-500">A calculadora usa os valores que você informar. Não mostramos promessa de faturamento.</p>
        </div>
        <RegionalProfessionalLeadForm city={city.name} state={city.state} />
      </div>
    </section>
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Monte uma apresentação objetiva", "Mostre serviços, habilidades e portfólio com as informações que você controla."],
          ["Conheça oportunidades compatíveis", "Acompanhe projetos publicados e use filtros para encontrar onde faz sentido se apresentar."],
          ["Defina sua proposta com calma", "Simule custos e ganho desejado antes de enviar uma proposta. A decisão e o preço final são seus."],
        ].map(([title, text], index) => <article key={title} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"><span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">0{index + 1}</span><h2 className="mt-5 text-lg font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}
      </section>
      <section className="mt-14 rounded-3xl border border-blue-100 bg-white p-7 sm:p-10"><div className="flex max-w-3xl items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles className="size-5" /></span><div><h2 className="text-2xl font-black">Conteúdo local, sem atalho de marketing</h2><p className="mt-3 leading-7 text-slate-600">Nesta página, você encontra uma porta de entrada para organizar seu trabalho em {city.name}. Dados de demanda, preço ou retorno só aparecem no PrestaCerto quando houver base verificável; enquanto isso, você pode explorar projetos e fazer sua própria simulação.</p></div></div></section>
      <section className="mt-12 rounded-3xl bg-slate-950 px-7 py-10 text-white sm:px-10"><CheckCircle2 className="size-6 text-blue-300" /><h2 className="mt-4 text-2xl font-black">Pronto para ser encontrado em {city.name}?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Crie o perfil, descreva com clareza o que você faz e escolha quando enviar propostas. Sem promessa de resultado automático.</p><Link href="/register?role=freelancer" className="mt-6 inline-flex items-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-400">Criar meu perfil <ArrowRight className="ml-2 size-4" /></Link></section>
    </main>
  </div>;
}
