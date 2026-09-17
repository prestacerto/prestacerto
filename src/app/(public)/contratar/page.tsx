import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { CATEGORIAS, CIDADES } from '@/lib/data/landing-data';
import { getPageMetadata } from '@/lib/seo/metadata';
import { StructuredData, getBreadcrumbSchema } from '@/components/structured-data';

export const metadata = getPageMetadata('Contratar freelancers por categoria e cidade', 'Explore especialidades e cidades para contratar freelancers. Saiba o que incluir no projeto, compare profissionais e publique gratuitamente no PrestaCerto.', '/contratar');

export default function HiringDirectory() {
  return <div className="bg-white text-slate-900"><div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <StructuredData type="BreadcrumbList" data={getBreadcrumbSchema([{ name: 'Início', url: 'https://prestacerto.com.br/' }, { name: 'Contratar', url: 'https://prestacerto.com.br/contratar' }])} />
    <nav aria-label="Caminho da página" className="text-sm text-slate-500"><Link href="/" className="hover:text-blue-600">Início</Link><span aria-hidden="true"> / </span><span>Contratar</span></nav>
    <p className="mt-10 text-xs font-semibold tracking-widest text-blue-700">ESPECIALIDADES E REGIÕES</p><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Encontre o profissional certo para o seu projeto.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Escolha uma especialidade e depois a cidade. Consulte orientações para contratar, conheça os perfis disponíveis e combine os detalhes do trabalho.</p>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(CATEGORIAS).map(([slug, category]) => <Link key={slug} href={`/contratar/${slug}`} className="group rounded-xl border border-slate-200 p-6 transition hover:border-blue-400 hover:bg-blue-50/30"><ArrowUpRight className="mb-5 size-5 text-blue-600" /><h2 className="text-lg font-semibold">{category.labelPlural}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{category.descricao}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-700"><MapPin className="size-4" />Explorar cidades</span></Link>)}</div>
    <section className="mt-14 grid gap-8 border-t border-slate-200 pt-10 md:grid-cols-2"><div><h2 className="text-2xl font-semibold tracking-tight">Atendimento local ou remoto</h2><p className="mt-4 leading-7 text-slate-600">O diretório reúne {Object.keys(CATEGORIAS).length} especialidades em {Object.keys(CIDADES).length} cidades. A presença de uma página não garante disponibilidade de profissionais. Para entregas digitais, considere também o atendimento remoto e confirme as condições diretamente.</p></div><div><h2 className="text-2xl font-semibold tracking-tight">Comece com um pedido claro</h2><p className="mt-4 leading-7 text-slate-600">Descreva o resultado esperado, o prazo, o orçamento e o que já está pronto. Ao comparar propostas, confira o escopo, as revisões e os critérios de entrega.</p><Link href="/publicar-projeto" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">Publicar projeto grátis<ArrowRight className="size-4" /></Link></div></section>
  </div></div>;
}
