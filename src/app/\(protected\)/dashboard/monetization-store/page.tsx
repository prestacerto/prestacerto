'use client';

import { useState } from 'react';
import { ShoppingCart, Star, Download, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'course' | 'template' | 'component' | 'asset';
  price: number;
  image: string;
  rating: number;
  sales: number;
  status: 'published' | 'draft' | 'archived';
  revenue: number;
}

export default function MonetizationStorePage() {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'React Masterclass - Iniciante ao Avançado',
      description: 'Curso completo de React com projetos reais',
      category: 'course',
      price: 197,
      image: '📚',
      rating: 4.9,
      sales: 245,
      status: 'published',
      revenue: 48265,
    },
    {
      id: '2',
      name: 'Next.js Dashboard Template',
      description: 'Template pronto para dashboard com Next.js + Tailwind',
      category: 'template',
      price: 79,
      image: '🎨',
      rating: 4.8,
      sales: 156,
      status: 'published',
      revenue: 12324,
    },
    {
      id: '3',
      name: 'React Component Library',
      description: 'Biblioteca com 50+ componentes React reutilizáveis',
      category: 'component',
      price: 49,
      image: '🧩',
      rating: 4.7,
      sales: 89,
      status: 'published',
      revenue: 4361,
    },
    {
      id: '4',
      name: 'E-commerce Backend em Node.js',
      description: 'Curso avançado: construa um e-commerce real do zero',
      category: 'course',
      price: 297,
      image: '💼',
      rating: 4.6,
      sales: 52,
      status: 'published',
      revenue: 15444,
    },
    {
      id: '5',
      name: 'Design System Icons Pack',
      description: '500+ ícones customizáveis em SVG',
      category: 'asset',
      price: 39,
      image: '🎯',
      rating: 4.8,
      sales: 234,
      status: 'published',
      revenue: 9126,
    },
    {
      id: '6',
      name: 'Python para Data Science',
      description: 'Aprenda data science com Python (em produção)',
      category: 'course',
      price: 199,
      image: '🐍',
      rating: 0,
      sales: 0,
      status: 'draft',
      revenue: 0,
    },
  ]);

  const publishedProducts = products.filter(p => p.status === 'published');
  const totalRevenue = publishedProducts.reduce((sum, p) => sum + p.revenue, 0);
  const avgRating = publishedProducts.length > 0
    ? (publishedProducts.reduce((sum, p) => sum + p.rating, 0) / publishedProducts.length).toFixed(1)
    : 0;

  const categoryEmoji: any = {
    course: '📚',
    template: '🎨',
    component: '🧩',
    asset: '🎯',
  };

  const categoryName: any = {
    course: 'Curso',
    template: 'Template',
    component: 'Componente',
    asset: 'Asset',
  };

  const statusConfig: any = {
    published: { color: 'bg-green-100 text-green-800', label: '✓ Publicado' },
    draft: { color: 'bg-gray-100 text-gray-800', label: '✏️ Rascunho' },
    archived: { color: 'bg-red-100 text-red-800', label: '📦 Arquivado' },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShoppingCart className="w-8 h-8 text-blue-500" />
          Loja Digital
        </h1>
        <p className="text-gray-600">Crie e venda seus produtos digitais</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Produtos Publicados</p>
          <p className="text-3xl font-bold">{publishedProducts.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Faturamento</p>
          <p className="text-3xl font-bold">R$ {(totalRevenue / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Total de Vendas</p>
          <p className="text-3xl font-bold">{publishedProducts.reduce((sum, p) => sum + p.sales, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Rating Médio</p>
          <p className="text-3xl font-bold">{avgRating}★</p>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mb-8">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition">
          + Criar Novo Produto
        </button>
      </div>

      {/* Products Grid */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold">Meus Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 text-center">
                <p className="text-6xl">{product.image}</p>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold flex-1">{product.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${statusConfig[product.status].color}`}>
                    {statusConfig[product.status].label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                <div className="mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {categoryName[product.category]}
                  </span>
                </div>

                {/* Stats */}
                <div className="mb-4 p-3 bg-gray-50 rounded grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Preço</p>
                    <p className="font-bold">R$ {product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Vendas</p>
                    <p className="font-bold">{product.sales}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Rating</p>
                    <p className="font-bold">{product.rating > 0 ? `${product.rating}★` : '—'}</p>
                  </div>
                </div>

                {product.status === 'published' && (
                  <div className="mb-4 p-3 bg-green-50 rounded">
                    <p className="text-xs text-green-700 mb-1">Faturamento</p>
                    <p className="font-bold text-green-600">R$ {(product.revenue / 1000).toFixed(1)}k</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 text-sm border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                    <Eye className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition">
                    <Download className="w-4 h-4" />
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">💡 Maximize suas vendas</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Crie um curso sobre sua skill mais demandada (React com 4.9★ de rating)</li>
          <li>✓ Venda templates prontos: marketplace de templates rende R$ 5-10k/mês para criadores ativos</li>
          <li>✓ Finalize seu curso de Python/Data Science (está em rascunho há 3 meses)</li>
          <li>✓ Implemente um email de follow-up: produtos com 1+ email geram 30% mais vendas</li>
        </ul>
      </div>
    </div>
  );
}
