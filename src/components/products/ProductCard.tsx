"use client";

import { ProductConfig } from "@/lib/certo-ecosystem/products-config";
import Link from "next/link";

interface ProductCardProps {
  product: ProductConfig;
  onSubscribe?: (productSlug: string) => void;
}

export function ProductCard({ product, onSubscribe }: ProductCardProps) {
  const statusColors = {
    live: "bg-green-100 text-green-800 border-green-300",
    building: "bg-yellow-100 text-yellow-800 border-yellow-300",
    planned: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const pricingTypeLabel: Record<string, string> = {
    monthly: "/mês",
    one_time: "uma vez",
    per_proposal: "por proposta",
    commission: "%",
    free: "grátis",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{product.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[product.status]}`}>
            {product.status.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{product.description}</p>

      <div className="bg-gray-50 rounded p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Preço</p>
        <p className="text-2xl font-bold text-gray-900">
          {product.price === 0 ? "Free" : <>R$ {product.price.toFixed(2)}<span className="text-sm font-normal text-gray-600">{pricingTypeLabel[product.pricingType]}</span></>}
        </p>
        {product.mrr > 0 && <p className="text-xs text-green-600 mt-2">Potencial: R$ {(product.mrr / 1000).toFixed(1)}k/mês</p>}
      </div>

      <div className="flex gap-4 mb-4 text-xs text-gray-600">
        <span>📁 {product.category}</span>
        <span>📅 Fase {product.phase}</span>
      </div>

      <div className="flex gap-2">
        {product.status === "live" && (
          <>
            <button onClick={() => onSubscribe?.(product.slug)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">Assinar</button>
            <Link href={`/dashboard/products/${product.slug}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition text-center">Demo</Link>
          </>
        )}
        {product.status === "building" && <button disabled className="w-full bg-yellow-100 text-yellow-800 font-semibold py-2 rounded-lg cursor-not-allowed">Em Desenvolvimento</button>}
        {product.status === "planned" && <button disabled className="w-full bg-gray-100 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed">Em Breve</button>}
      </div>
    </div>
  );
}
