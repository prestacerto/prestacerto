'use client';

import { ProductCard } from '@/components/products/ProductCard';
import { PRODUCTS } from '@/lib/products/product-config';

export default function ProductsPage() {
  const products = Object.values(PRODUCTS);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
          Produtos Premium
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Ecosistema Certo
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Conheça nossos produtos com IA que potencializam sua presença e rentabilidade
          como freelancer. Escolha os que mais fazem sentido para seu negócio.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showDashboardLink
          />
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Comece Agora</h3>
          <p className="text-sm text-slate-600 mb-4">
            Escolha um ou mais produtos e comece a potencializar seu trabalho. Pague apenas
            pelo que usar, sem compromisso de contrato.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Suporte</h3>
          <p className="text-sm text-slate-600 mb-4">
            Tem dúvidas? Entre em contato com nosso suporte pelo chat ou envie um email
            para support@prestacerto.com
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Posso cancelar minha assinatura a qualquer momento?
            </h3>
            <p className="text-sm text-slate-600">
              Sim! Você pode cancelar sua assinatura mensal a qualquer tempo sem penalidades.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Quais são os métodos de pagamento aceitos?
            </h3>
            <p className="text-sm text-slate-600">
              Aceitamos cartão de crédito, débito e PIX através do Assinify.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Posso usar vários produtos simultaneamente?
            </h3>
            <p className="text-sm text-slate-600">
              Claro! Você pode assinar quantos produtos desejar. Eles funcionam melhor
              quando usados em conjunto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
