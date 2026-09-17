'use client';

import Link from 'next/link';
import type { Product } from '@/lib/products/product-config';

interface ProductCardProps {
  product: Product;
  planKey?: keyof Product['plans'];
  showDashboardLink?: boolean;
}

const colorClasses = {
  blue: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    button: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-blue-600',
  },
  emerald: {
    border: 'border-emerald-300',
    bg: 'bg-emerald-50',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    text: 'text-emerald-600',
  },
  orange: {
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    button: 'bg-orange-600 hover:bg-orange-700',
    text: 'text-orange-600',
  },
};

export function ProductCard({
  product,
  planKey,
  showDashboardLink = true,
}: ProductCardProps) {
  const colors = colorClasses[product.color as keyof typeof colorClasses];
  const plan = planKey ? product.plans[planKey] : Object.values(product.plans)[0];

  if (!plan) return null;

  const priceInReais = plan.price / 100;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        </div>
        <span className="text-2xl">{product.icon}</span>
      </div>

      <div className="mb-6 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-600 mb-1">{plan.label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900">
            R$ {priceInReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {plan.type === 'monthly' && (
            <span className="text-sm text-slate-600">/mês</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <a
          href={plan.assinifyLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center ${colors.button} text-white font-semibold py-2 rounded-lg transition`}
        >
          {plan.type === 'monthly' ? 'Assinar Agora' : 'Comprar Agora'}
        </a>

        {showDashboardLink && (
          <Link
            href={`/dashboard/products/${product.id}`}
            className="block w-full text-center border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-100 transition"
          >
            Ver Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
