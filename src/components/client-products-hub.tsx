'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CLIENT_PRODUCTS, formatProductPrice, calculateClientProductsMRR } from '@/lib/client-products';

export function ClientProductsHub() {
  const [filter, setFilter] = useState<'all' | 'free' | 'monthly' | 'commission'>('all');
  const mrr = calculateClientProductsMRR();

  const filtered = CLIENT_PRODUCTS.filter((product) => {
    if (filter === 'all') return true;
    if (filter === 'free') return product.pricing.model === 'free';
    if (filter === 'monthly') return product.pricing.model === 'monthly';
    if (filter === 'commission') return product.pricing.model === 'commission';
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">🚀 Client Products</h1>
        <p className="text-lg text-gray-600">8 produtos para clientes com APIs, dashboards e checkout</p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-2">
            {(['all', 'free', 'monthly', 'commission'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f === 'all'
                  ? 'Tudo'
                  : f === 'free'
                    ? 'Grátis'
                    : f === 'monthly'
                      ? 'Mensal'
                      : 'Comissão'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={product.dashboardRoute}
            className="group p-6 border rounded-lg hover:shadow-lg hover:border-blue-400 transition-all"
          >
            <div className="text-4xl mb-3">{product.emoji}</div>
            <h3 className="font-bold text-lg group-hover:text-blue-600 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Preço</span>
                <span className="font-bold text-blue-600">{formatProductPrice(product)}</span>
              </div>

              {product.pricing.model !== 'free' && product.assinifyCheckoutUrl && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Abre modal de checkout
                    window.location.href = product.assinifyCheckoutUrl!;
                  }}
                  className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                >
                  Assinar Agora
                </button>
              )}

              {product.pricing.model !== 'free' && !product.assinifyCheckoutUrl && (
                <div className="w-full py-2 bg-gray-100 text-gray-600 rounded text-sm font-semibold text-center">
                  Em breve
                </div>
              )}

              {product.pricing.model === 'free' && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = product.dashboardRoute;
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  Acessar
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 font-semibold mb-2">Recursos</p>
              <ul className="space-y-1">
                {product.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {product.features.length > 3 && (
                  <li className="text-xs text-blue-600">+ {product.features.length - 3} mais</li>
                )}
              </ul>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">FASE 3: Client Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Total Produtos</p>
            <p className="text-2xl font-bold">{CLIENT_PRODUCTS.length}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Produtos Mensais</p>
            <p className="text-2xl font-bold">{mrr.monthlyProducts}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Com Comissão</p>
            <p className="text-2xl font-bold">{mrr.commissionProducts}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">MRR Estimado</p>
            <p className="text-2xl font-bold">R$ {mrr.totalMonthlyMRR.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
