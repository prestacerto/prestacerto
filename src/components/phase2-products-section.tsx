'use client';

import { PHASE2_PRODUCTS, getPhase2CheckoutUrl } from '@/lib/phase2-products';
import Link from 'next/link';

export function Phase2ProductsSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FASE 2 — Inteligência Artificial Avançada
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            8 ferramentas IA que transformam propostas em conversões. Escolha o que sua carreira precisa.
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASE2_PRODUCTS.map((product) => {
            const checkoutUrl = getPhase2CheckoutUrl(product);
            const isActive = !!checkoutUrl;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
                  <div className="text-4xl mb-3">{product.icon}</div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-blue-100 mt-2">{product.description}</p>
                </div>

                {/* Preço */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600">
                      {product.billingType === 'monthly' ? '/mês' : 'única'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 py-6 flex-1">
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 font-bold mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  {isActive && checkoutUrl ? (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center transition-colors"
                    >
                      Ativar Agora
                    </a>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 py-2">Em breve</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-12 bg-white border-2 border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Precisa de mais funcionalidades?
          </h3>
          <p className="text-gray-600 mb-4">
            Combine vários produtos para potencializar seus resultados. Cada um foi projetado
            para trabalhar junto e amplificar seu impacto.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>💡</span>
            <span>Dica: Comece com Dashboard IA para entender melhor seus dados</span>
          </div>
        </div>
      </div>
    </section>
  );
}
