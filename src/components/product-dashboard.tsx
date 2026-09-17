'use client';

import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { CommunityProduct } from '@/lib/community-products-data';

interface ProductDashboardProps {
  product: CommunityProduct;
  children?: React.ReactNode;
}

export function ProductDashboard({ product, children }: ProductDashboardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const colorText: Record<string, string> = {
    purple: 'text-purple-900',
    blue: 'text-blue-900',
    green: 'text-green-900',
    yellow: 'text-yellow-900',
    red: 'text-red-900',
    indigo: 'text-indigo-900',
    slate: 'text-slate-900',
    pink: 'text-pink-900',
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Voltar aos produtos
        </Link>

        <div className={`rounded-2xl border-2 p-8 ${colorBg[product.color]}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-5xl mb-4">{product.icon}</div>
              <h1 className={`text-3xl font-black ${colorText[product.color]}`}>
                {product.name}
              </h1>
              <p className="mt-2 text-slate-700">{product.description}</p>
            </div>
            {product.status === 'beta' && (
              <span className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                Beta
              </span>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              {product.price > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-600">
                    {product.priceType === 'monthly' ? '/mês' : 'único'}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-slate-900">Grátis</span>
              )}
            </div>

            {product.priceType !== 'free' && (
              <button
                onClick={() => copyToClipboard(`Produto ${product.name} - ${product.price > 0 ? `R$ ${product.price.toLocaleString('pt-BR')}${product.priceType === 'monthly' ? '/mês' : ''}` : 'Grátis'}`)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copiado!' : 'Copiar info'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">O que está incluído</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex gap-3 p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
              <span className="text-xl shrink-0">✓</span>
              <span className="text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Content */}
      {children && (
        <section className="mb-12">
          {children}
        </section>
      )}

      {/* Support */}
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-bold text-slate-900 mb-2">Precisa de ajuda?</h3>
        <p className="text-slate-700 text-sm mb-4">
          Dúvidas sobre {product.name}? Entre em contato com nosso suporte.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Contate o suporte
        </Link>
      </section>
    </div>
  );
}
