import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin, Check } from 'lucide-react';
import { CATEGORIAS, CIDADES, getLandingCategory } from '@/lib/data/landing-data';
import { HIRING_GUIDES } from '@/lib/data/hiring-guides';
import { getPageMetadata } from '@/lib/seo/metadata';
import { StructuredData, getBreadcrumbSchema } from '@/components/structured-data';

type Props = { params: Promise<{ categoria: string }> };
export function generateStaticParams() { return Object.keys(CATEGORIAS).map(categoria => ({ categoria })); }
export async function generateMetadata({ params }: Props) {
  const { categoria } = await params; const cat = getLandingCategory(categoria);
  if (!cat) notFound();
  return getPageMetadata(`Contratar ${cat.label}: serviços e cidades`, `Saiba como contratar ${cat.labelPlural.toLowerCase()}. Veja o que incluir no projeto, explore cidades e compare perfis disponíveis no PrestaCerto.`, `/contratar/${categoria}`);
}
export default async function HiringCategory({ params }: Props) {
  const { categoria } = await params; const cat = getLandingCategory(categoria); const guide = HIRING_GUIDES[categoria];
  if (!cat || !guide) notFound();
  return <div className="bg-white text-slate-900"><div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <StructuredData type="BreadcrumbList" data={getBreadcrumbSchema([{ name: 'Início', url: 'https://prestacerto.com.br/' }, { name: 'Contratar', url: 'https://prestacerto.com.br/contratar' }, { name: cat.labelPlural, url: `https://prestacerto.com.br/contratar/${categoria}` }])} />
    <nav aria-label="Caminho da página" className="flex flex-wrap gap-2 text-sm text-slate-500"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/contratar">Contratar</Link><span aria-hidden="true">/</span><span>{cat.labelPlural}</span></nav>
    <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-blue-700">ENCONTRE SUA ESPECIALIDADE</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Contrate {cat.labelPlural.toLowerCase()} para o seu projeto.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{guide.intro}</p><div className="mt-7 flex flex-wrap gap-4"><Link href="/publicar-projeto" className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">Publicar projeto grátis<ArrowRight className="size-4" /></Link><Link href={`/services?categoria=${categoria}`} className="inline-flex min-h-12 items-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ver serviços disponíveis</Link></div>
    <section className="mt-14"><h2 className="text-2xl font-semibold tracking-tight">Escolha sua cidade</h2><p className="mt-3 text-slate-600">Consulte os perfis disponíveis por região e confirme se o atendimento é presencial ou remoto.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(CIDADES).map(([slug, city]) => <Link key={slug} href={`/contratar/${categoria}/${slug}`} className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm transition hover:border-blue-400 hover:bg-blue-50/30"><MapPin className="size-4 text-blue-600" /><span>{city.name}</span><span className="ml-auto text-xs text-slate-500">{city.state}</span></Link>)}</div></section>
    <section className="mt-14 grid gap-10 border-t border-slate-200 pt-10 md:grid-cols-2"><div><h2 className="text-2xl font-semibold tracking-tight">O que incluir no seu pedido</h2><ul className="mt-5 space-y-4">{guide.checklist.map(item => <li key={item} className="flex gap-3 leading-7 text-slate-600"><Check className="mt-1 size-4 shrink-0 text-blue-600" />{item}</li>)}</ul></div><div><h2 className="text-2xl font-semibold tracking-tight">Como comparar profissionais</h2><p className="mt-5 leading-8 text-slate-600">{guide.comparison}</p><Link href="/como-funciona" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700">Entenda a contratação<ArrowRight className="size-4" /></Link></div></section>
  </div></div>;
}
