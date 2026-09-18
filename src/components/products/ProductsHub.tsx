'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CERTO_PRODUCTS } from '@/lib/certo-ecosystem/products-config';

const getEmojiForProduct = (slug: string): string => {
  const product = CERTO_PRODUCTS.find(p => p.slug === slug);
  return product?.icon || '🎯';
};

const PRODUCTS = CERTO_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  price: p.price,
  emoji: p.icon,
  revenue: `${Math.round(p.mrr / 1000)}k`,
  description: p.description,
  pricingType: p.pricingType,
}));

export function ProductsHub() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'subscription' | 'onetime'>('all');

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                       p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ||
                       (filter === 'subscription' && typeof p.price === 'number') ||
                       (filter === 'onetime' && typeof p.price === 'string');
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">🚀 CERTO Products Hub</h1>
        <p className="text-lg text-gray-600">R$ 679k/month revenue potential</p>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            {(['all', 'subscription', 'onetime'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'Tudo' : f === 'subscription' ? 'Subscrição' : 'One-time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/dashboard/${product.slug}`}
            className="group p-4 border rounded-lg hover:shadow-lg hover:border-blue-400 transition-all"
          >
            <div className="text-3xl mb-2">{product.emoji}</div>
            <h3 className="font-bold text-lg group-hover:text-blue-600">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Preço</p>
                <p className="font-bold">R$ {product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Potencial</p>
                <p className="font-bold text-green-600">{product.revenue}/mês</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">Total MRR Potential</h2>
        <p className="text-4xl font-bold mb-2">R$ 679.000+/mês</p>
        <p className="opacity-90">Com 5k-10k freelancers ativos usando todos os produtos</p>
      </div>
    </div>
  );
}
