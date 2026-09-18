import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { CommunityProductsGrid } from '@/components/community-products-grid';
import { getAvailableProducts } from '@/lib/community-products-data';
import { getPageMetadata } from '@/lib/seo/metadata';

export const metadata = getPageMetadata(
  'Produtos - PrestaCerto',
  'Explore nossa suite de produtos: Academy, Templates, Invoice, Cold Email, Tax, Destaque e mais.',
  '/products'
);

export default function ProductsPage() {
  const products = getAvailableProducts();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Você está em" className="mb-6 text-sm text-slate-600">
        <Link href="/" className="underline underline-offset-4">Início</Link>
        <span aria-hidden="true"> / </span>
        <span>Produtos</span>
      </nav>

      {/* Hero */}
      <section className="rounded-[2rem] border border-blue-100 bg-[#f4f7ff] px-6 py-10 text-center sm:px-10 sm:py-12 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
          <Zap className="size-4" />
          Fase 4 - Produtos Community
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Tools, cursos e tudo que você precisa
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Desde notas fiscais até prospecção com IA, potencialize seu negócio com nossa suite completa de produtos.
        </p>
      </section>

      {/* Certo Premium Highlight */}
      <section className="mb-12 rounded-2xl border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-pink-100 p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🚀</span>
          <h2 className="text-2xl font-bold text-slate-900">Certo Premium</h2>
        </div>
        <p className="text-slate-700 mb-4">
          O plano Business por R$ 99,90/mês: propostas ilimitadas, Certo AI com limite ampliado, Job Matching com IA, destaque de serviços e projetos elegíveis e suporte prioritário.
        </p>
        <div className="flex gap-3">
          <a
            href="/plans?plan=business"
            className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-3 text-sm font-bold text-white hover:bg-pink-700 transition-colors"
          >
            Assinar Certo Premium
          </a>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
          >
            Saiba mais
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="mb-8 text-2xl font-bold text-slate-900">Todos os produtos</h2>
        <CommunityProductsGrid products={products} />
      </section>

      {/* FAQ */}
      <section className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas frequentes</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-slate-900">Posso testar antes de assinar?</h3>
            <p className="mt-2 text-sm text-slate-700">
              Produtos específicos têm trial gratuito. Verifique a página de cada um ou converse com nosso suporte.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Posso cancelar quando quiser?</h3>
            <p className="mt-2 text-sm text-slate-700">
              Sim. Cancele sua assinatura a qualquer momento no seu dashboard ou entre em contato com suporte.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Vale a pena Certo Premium?</h3>
            <p className="mt-2 text-sm text-slate-700">
              Se usa 2+ produtos, você economiza vs. assinar separadamente. Compare: Tax (R$ 49,90) + Invoice (R$ 19,90) + Templates (R$ 29,90) já somam R$ 99,70.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Qual produto começo?</h3>
            <p className="mt-2 text-sm text-slate-700">
              Comece com o que seu negócio mais precisa. Tax se paga rapidamente para PJ/MEI. Invoice automiza cobrança.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Back */}
      <section className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="size-4" />
          Voltar ao início
        </Link>
      </section>
    </div>
  );
}
