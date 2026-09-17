import Link from "next/link";
import { ArrowUpRight, Check, ExternalLink, Sparkles } from "lucide-react";
import { getPageMetadata, siteUrl } from "@/lib/seo/metadata";

export const metadata = getPageMetadata(
  "Marcas relacionadas ao PrestaCerto",
  "Conheça soluções relacionadas ao PrestaCerto para contratação de serviços, vendas, marketing, atendimento e organização do trabalho.",
  "/ecossistema",
);

const brands = [
  { name: "Sinal Meet", url: "https://sinalmeet.com.br", description: "Prospecção B2B e organização de contatos comerciais." },
  { name: "Fluxo Tarefas", url: "https://fluxotarefas.com.br", description: "Organização de tarefas e processos de equipe." },
  { name: "Cadu AI", url: "https://caduai.com.br", description: "Inteligência comercial para atendimento e operações imobiliárias." },
  { name: "Assiny", url: "https://assiny.com.br", description: "Checkout e infraestrutura para cobranças digitais." },
  { name: "Sima Creators", url: "https://simacreators.com.br", description: "Creators, UGC e campanhas para marcas." },
  { name: "Lomvique", url: "https://lomvique.com.br", description: "Inteligência de receita para operações B2B." },
  { name: "Moryva", url: "https://moryva.com.br", description: "CRM para relacionamento e gestão de clientes." },
  { name: "Varanda Lar", url: "https://varandalar.com.br", description: "Descoberta digital de imóveis e serviços para o lar." },
  { name: "ChaveZero", url: "https://chavezero.com.br", description: "Soluções para compra, venda e financiamento de veículos." },
  { name: "SIMA.AI", url: "https://simaai.com.br", description: "Assistentes comerciais e de suporte por operação." },
  { name: "Agência Sima", url: "https://agenciasima.com.br", description: "Estratégia, marketing e crescimento para negócios." },
  { name: "Zelquo", url: "https://zelquo.com.br", description: "Soluções digitais para simplificar a próxima decisão." },
] as const;

export default function EcosystemPage() {
  const itemList = brands.map((brand, index) => ({ "@type": "ListItem", position: index + 1, name: brand.name, url: brand.url }));

  return (
    <div className="bg-slate-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Marcas relacionadas ao PrestaCerto",
        url: `${siteUrl}/ecossistema`,
        description: "Soluções relacionadas para contratação, vendas, marketing e organização do trabalho.",
        mainEntity: { "@type": "ItemList", itemListElement: itemList },
      }) }} />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">MARCAS RELACIONADAS</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Soluções que ajudam sua próxima decisão.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">O PrestaCerto conecta você a profissionais para tirar projetos do papel. Quando a sua necessidade pede outra ferramenta ou serviço, reunimos opções relacionadas e mostramos o próximo passo com clareza.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/publicar-projeto" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 font-bold transition hover:bg-blue-400">Publicar um projeto <ArrowUpRight className="size-5" /></Link>
            <Link href="#marcas" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 font-bold transition hover:bg-white/10">Conhecer as marcas</Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">Cada marca tem seu próprio site, atendimento e condições de uso.</p>
        </div>
      </section>

      <section id="marcas" className="bg-white px-5 py-16 text-slate-950 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">ESCOLHA PELO QUE VOCÊ PRECISA</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Uma solução para cada etapa do trabalho.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">Explore as marcas e acesse o site oficial de cada uma. O PrestaCerto não compartilha seus dados automaticamente entre elas.</p></div><Sparkles className="hidden size-8 shrink-0 text-blue-600 sm:block" aria-hidden="true" /></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => <a key={brand.name} href={brand.url} target="_blank" rel="noreferrer" className="group flex min-h-48 flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><div className="flex items-start justify-between gap-4"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">{brand.name.slice(0, 1)}</span><ExternalLink className="size-4 text-slate-400 transition group-hover:text-blue-600" aria-hidden="true" /></div><h3 className="mt-5 text-xl font-bold">{brand.name}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{brand.description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-700">Conhecer site <ArrowUpRight className="size-4" /></span></a>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"><div className="grid gap-4 md:grid-cols-3">{[["Escolha com contexto", "Cada descrição explica o problema que a marca resolve antes de você sair do PrestaCerto."], ["Links oficiais", "Você sempre abre o domínio da própria marca e trata diretamente com a equipe responsável."], ["Transparência", "Condições, preços, descontos e suporte são definidos em cada site e podem variar por campanha."]].map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.06] p-6"><Check className="size-6 text-blue-300" aria-hidden="true" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></div>)}</div></section>

      <section className="bg-blue-600 px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">PRÓXIMO PASSO</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Seu projeto começa com uma boa descrição.</h2><p className="mt-3 max-w-xl text-blue-100">Conte o que você precisa e compare profissionais antes de decidir.</p></div><Link href="/publicar-projeto" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50">Publicar projeto grátis <ArrowUpRight className="size-5" /></Link></div></section>
    </div>
  );
}
