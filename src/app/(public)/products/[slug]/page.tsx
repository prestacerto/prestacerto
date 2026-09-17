import { getProductById, COMMUNITY_PRODUCTS, getCheckoutUrl } from '@/lib/community-products-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Users, Zap } from 'lucide-react';

export async function generateStaticParams() {
  return COMMUNITY_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductById(slug as any);
  
  if (!product) return { title: 'Produto não encontrado' };
  
  return {
    title: `${product.name} - PrestaCerto`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductById(slug as any);
  
  if (!product) notFound();

  const checkoutUrl = getCheckoutUrl(product);

  const colorClasses: Record<string, string> = {
    purple: 'from-purple-600 to-purple-700 text-white',
    blue: 'from-blue-600 to-blue-700 text-white',
    green: 'from-green-600 to-green-700 text-white',
    yellow: 'from-yellow-600 to-yellow-700 text-white',
    red: 'from-red-600 to-red-700 text-white',
    indigo: 'from-indigo-600 to-indigo-700 text-white',
    slate: 'from-slate-600 to-slate-700 text-white',
    pink: 'from-pink-600 to-pink-700 text-white',
  };

  const colorBg: Record<string, string> = {
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    indigo: 'bg-indigo-50 border-indigo-200',
    slate: 'bg-slate-50 border-slate-200',
    pink: 'bg-pink-50 border-pink-200',
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Você está em" className="mb-8 text-sm text-slate-600">
        <Link href="/" className="underline underline-offset-4">Início</Link>
        <span aria-hidden="true"> / </span>
        <Link href="/products" className="underline underline-offset-4">Produtos</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <section className={`rounded-3xl bg-gradient-to-r ${colorClasses[product.color]} p-8 sm:p-12 mb-12`}>
        <div className="text-6xl mb-6">{product.icon}</div>
        <h1 className="text-4xl font-black mb-4">{product.name}</h1>
        <p className="text-lg opacity-90 mb-8 max-w-2xl">{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            {product.price > 0 ? (
              <div>
                <p className="text-sm opacity-90">A partir de</p>
                <p className="text-4xl font-black">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {product.priceType === 'monthly' ? 'por mês' : 'acesso vitalício'}
                </p>
              </div>
            ) : (
              <p className="text-3xl font-black">Grátis</p>
            )}
          </div>
          {checkoutUrl && product.priceType !== 'free' ? (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white text-slate-900 px-8 py-4 font-bold hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Assinar agora
              <Zap className="size-5" />
            </a>
          ) : product.hasDashboard && product.dashboardPath ? (
            <Link
              href={product.dashboardPath}
              className="rounded-xl bg-white text-slate-900 px-8 py-4 font-bold hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Acessar
              <Zap className="size-5" />
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8">O que você ganha</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {product.features.map((feature, idx) => (
            <div key={idx} className={`rounded-xl border-2 p-6 ${colorBg[product.color]}`}>
              <div className="flex gap-3">
                <CheckCircle className="size-6 shrink-0 text-slate-900 font-bold" />
                <p className="text-slate-900">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl border-2 border-slate-200 bg-white p-8">
        <div className="flex gap-4">
          <Users className="size-8 shrink-0 text-slate-900" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ideal para</h3>
            <p className="text-slate-700">{product.targetAudience}</p>
          </div>
        </div>
      </section>

      <section className={`rounded-2xl bg-gradient-to-r ${colorClasses[product.color]} p-8 sm:p-12 text-center mb-12`}>
        <h2 className="text-3xl font-black mb-4">Comece agora</h2>
        <p className="mb-8 text-lg opacity-90">Acesso imediato ao {product.name}</p>
        {checkoutUrl && product.priceType !== 'free' ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors"
          >
            Assinar por R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            {product.priceType === 'monthly' ? '/mês' : ''}
          </a>
        ) : product.hasDashboard && product.dashboardPath ? (
          <Link
            href={product.dashboardPath}
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors"
          >
            Acessar {product.name}
          </Link>
        ) : (
          <button disabled className="px-8 py-4 rounded-xl font-bold bg-white/30 text-slate-200 cursor-not-allowed">
            Em breve
          </button>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Perguntas frequentes</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-bold text-slate-900 mb-2">Como funciona o acesso?</h3>
            <p className="text-slate-700">Após confirmar o pagamento no Assiny, você terá acesso imediato. Você receberá um email de confirmação com as instruções.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-bold text-slate-900 mb-2">Posso cancelar quando quiser?</h3>
            <p className="text-slate-700">Sim. Você pode cancelar sua assinatura a qualquer momento acessando sua conta ou entrando em contato com o suporte.</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
            <h3 className="font-bold text-slate-900 mb-2">Há suporte técnico disponível?</h3>
            <p className="text-slate-700">Sim. Oferecemos suporte por email e para assinantes Premium, suporte prioritário por chat.</p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="size-4" />
          Voltar aos produtos
        </Link>
      </div>
    </div>
  );
}
