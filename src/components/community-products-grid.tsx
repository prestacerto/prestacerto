'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { CommunityProduct, getCheckoutUrl } from '@/lib/community-products-data';

const colorClasses: Record<string, string> = {
  purple: 'border-purple-200 bg-purple-50 hover:border-purple-300',
  blue: 'border-blue-200 bg-blue-50 hover:border-blue-300',
  green: 'border-green-200 bg-green-50 hover:border-green-300',
  yellow: 'border-yellow-200 bg-yellow-50 hover:border-yellow-300',
  red: 'border-red-200 bg-red-50 hover:border-red-300',
  indigo: 'border-indigo-200 bg-indigo-50 hover:border-indigo-300',
  slate: 'border-slate-200 bg-slate-50 hover:border-slate-300',
  pink: 'border-pink-200 bg-pink-50 hover:border-pink-300',
};

const badgeColors: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  slate: 'bg-slate-100 text-slate-700',
  pink: 'bg-pink-100 text-pink-700',
};

interface CommunityProductsGridProps {
  products: CommunityProduct[];
}

export function CommunityProductsGrid({ products }: CommunityProductsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const checkoutUrl = getCheckoutUrl(product);
        const colorClass = colorClasses[product.color] || colorClasses.slate;
        const badgeColor = badgeColors[product.color] || badgeColors.slate;

        return (
          <div
            key={product.id}
            className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all ${colorClass}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl mb-3">{product.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{product.shortDescription}</p>
              </div>
              {product.status === 'beta' && (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
                  Beta
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              {product.price > 0 ? (
                <>
                  <span className="text-3xl font-black text-slate-900">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-slate-600">
                    {product.priceType === 'monthly' ? '/mês' : 'único'}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-slate-900">Grátis</span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-6 text-slate-700">{product.description}</p>

            {/* Features */}
            <ul className="mt-6 space-y-2 flex-1">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle className="size-4 shrink-0 text-slate-900 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-6 flex gap-2">
              {product.priceType !== 'free' && checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Assinar agora <ArrowRight className="size-4" />
                </a>
              ) : product.hasDashboard && product.dashboardPath ? (
                <Link
                  href={product.dashboardPath}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Acessar <ArrowRight className="size-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 rounded-lg bg-slate-200 px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                >
                  Em breve
                </button>
              )}
            </div>

            {/* Status badge */}
            {product.status === 'coming-soon' && (
              <div className="absolute inset-0 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <span className="font-bold text-slate-700">Em breve</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
