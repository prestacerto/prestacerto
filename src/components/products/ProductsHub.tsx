'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRODUCTS = [
  { id: 1, name: 'CERTO Tax', slug: 'tax', price: 49.90, emoji: '💰', revenue: '150k', description: 'Fiscal management' },
  { id: 2, name: 'CERTO Portfolio', slug: 'portfolio', price: 29.90, emoji: '🎨', revenue: '149.5k', description: 'Auto-portfolio gerado' },
  { id: 3, name: 'CERTO Scale', slug: 'scale', price: 199, emoji: '📈', revenue: '100k', description: 'Build your agency' },
  { id: 4, name: 'CERTO Loan', slug: 'loan', price: 'Dynamic', emoji: '💸', revenue: '15k', description: 'Cash advance 24h' },
  { id: 5, name: 'CERTO Academy', slug: 'academy', price: 97, emoji: '🎓', revenue: '16.6k', description: 'Cursos online' },
  { id: 6, name: 'CERTO Escrow', slug: 'escrow', price: '5%', emoji: '🔒', revenue: '25k', description: 'Protection system' },
  { id: 7, name: 'CERTO Agency Kit', slug: 'agency-kit', price: '299', emoji: '📋', revenue: '100k+', description: 'Template pack' },
  { id: 8, name: 'CERTO Brand', slug: 'brand', price: 497, emoji: '🎯', revenue: '80k+', description: 'AI Branding' },
  { id: 9, name: 'CERTO Compliance', slug: 'compliance', price: 199, emoji: '✅', revenue: '50k+', description: 'LGPD Checklist' },
  { id: 10, name: 'CERTO Hype', slug: 'hype', price: 49.90, emoji: '📱', revenue: '40k+', description: 'Social auto-post' },
  { id: 11, name: 'CERTO Crisis', slug: 'crisis', price: 299, emoji: '🆘', revenue: '30k+', description: 'Conflict resolution' },
  { id: 12, name: 'CERTO Salary', slug: 'salary', price: 29.90, emoji: '💵', revenue: '35k+', description: 'Benchmark salary' },
  { id: 13, name: 'CERTO Ghostwriter', slug: 'ghostwriter', price: 999, emoji: '✍️', revenue: '60k+', description: 'Premium proposals' },
  { id: 14, name: 'CERTO Personal Brand', slug: 'personal-brand', price: 397, emoji: '⭐', revenue: '45k+', description: 'LinkedIn growth' },
  { id: 15, name: 'CERTO Data API', slug: 'data-api', price: 299, emoji: '📊', revenue: '40k+', description: 'Salary/price data' },
  { id: 16, name: 'CERTO Book', slug: 'ebook', price: 29.90, emoji: '📚', revenue: '20k+', description: 'eBook guia' },
  { id: 17, name: 'CERTO Plugin Figma', slug: 'figma-plugin', price: 9.90, emoji: '🎨', revenue: '15k+', description: 'Design tools' },
  { id: 18, name: 'CERTO Rate Card', slug: 'rate-card', price: 99, emoji: '💳', revenue: '25k+', description: 'Pro rate sheet' },
  { id: 19, name: 'CERTO Legal', slug: 'legal', price: 149, emoji: '⚖️', revenue: '35k+', description: 'Lawyer online' },
  { id: 20, name: 'CERTO Wellness', slug: 'wellness', price: 49.90, emoji: '🏃', revenue: '30k+', description: 'Health benefits' },
  { id: 21, name: 'CERTO Marketplace', slug: 'marketplace', price: '15-20%', emoji: '🏪', revenue: '200k+', description: 'Verticais spec.' },
  { id: 22, name: 'CERTO Immigration', slug: 'immigration', price: 1997, emoji: '🌍', revenue: '80k+', description: 'Work abroad' },
  { id: 23, name: 'CERTO Affiliate', slug: 'affiliate', price: '20%', emoji: '🔗', revenue: '50k+', description: 'Affiliate manage' },
  { id: 24, name: 'CERTO Fortune', slug: 'fortune', price: '8%', emoji: '🎰', revenue: '100k+', description: 'Raffle 100k' },
  { id: 25, name: 'CERTO B2B', slug: 'b2b', price: 999, emoji: '🏢', revenue: '60k+', description: 'Platform corpo' },
  { id: 26, name: 'CERTO Content Studio', slug: 'content-studio', price: 499, emoji: '🎬', revenue: '70k+', description: 'AI content suite' },
  { id: 27, name: 'CERTO Podcast Network', slug: 'podcast', price: 199, emoji: '🎙️', revenue: '40k+', description: 'Podcast collab' },
  { id: 28, name: 'CERTO Visa Premium', slug: 'visa', price: 99, emoji: '💳', revenue: '120k+', description: 'Premium card' },
  { id: 29, name: 'CERTO Concierge', slug: 'concierge', price: 499, emoji: '🎩', revenue: '80k+', description: 'VA full-time' },
  { id: 30, name: 'CERTO Equity Split', slug: 'equity', price: '2%', emoji: '📈', revenue: '90k+', description: 'Equity projects' },
  { id: 31, name: 'CERTO Performance', slug: 'performance', price: 79.90, emoji: '🚀', revenue: '50k+', description: 'Coaching' },
  { id: 32, name: 'CERTO Retreat Luxury', slug: 'retreat', price: 7997, emoji: '✈️', revenue: '240k+', description: 'Luxury retreat' },
  { id: 33, name: 'CERTO Incubator', slug: 'incubator', price: 'Equity', emoji: '🚀', revenue: '120k+', description: 'Startup fund' },
  { id: 34, name: 'CERTO Internship', slug: 'internship', price: 299, emoji: '👨‍🎓', revenue: '60k+', description: 'Junior program' },
  { id: 35, name: 'CERTO Debt Collector', slug: 'debt', price: '15%', emoji: '💰', revenue: '50k+', description: 'Collection' },
  { id: 36, name: 'CERTO Insurance', slug: 'insurance', price: 399, emoji: '🛡️', revenue: '100k+', description: 'Insurance bundle' },
  { id: 37, name: 'CERTO Languages', slug: 'languages', price: 49.90, emoji: '🗣️', revenue: '40k+', description: 'Learn languages' },
  { id: 38, name: 'CERTO Finance', slug: 'finance', price: 99, emoji: '💹', revenue: '70k+', description: 'Investing course' },
  { id: 39, name: 'CERTO Awards', slug: 'awards', price: 2997, emoji: '🏆', revenue: '150k+', description: 'Annual awards' },
  { id: 40, name: 'CERTO Unicorn Club', slug: 'unicorn', price: 9997, emoji: '🦄', revenue: '300k+', description: 'Elite mastermind' },
];

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
