'use client';

import { useState } from 'react';
import { Search, ChevronLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'cars' | 'motos'>('cars');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = [
    'CHEVROLET',
    'CITROËN',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'MITSUBISHI',
    'NISSAN',
    'PEUGEOT',
    'RENAULT',
    'TOYOTA',
    'VOLKSWAGEN',
    'VOLVO',
  ];

  const priceRanges = [
    { label: 'até R$ 30 mil', value: '30' },
    { label: 'de R$ 30 a R$ 60 mil', value: '30-60' },
    { label: 'de R$ 60 a R$ 100 mil', value: '60-100' },
    { label: 'acima de R$ 100 mil', value: '100+' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Encontre o seu veículo aqui"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cars')}
            className={`flex-1 py-3 font-semibold text-center border-b-2 transition ${
              activeTab === 'cars'
                ? 'text-red-500 border-red-500'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Carros
          </button>
          <button
            onClick={() => setActiveTab('motos')}
            className={`flex-1 py-3 font-semibold text-center border-b-2 transition ${
              activeTab === 'motos'
                ? 'text-red-500 border-red-500'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Motos
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Digite marca ou modelo"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Main Brands Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">Principais marcas</h3>
          <div className="grid grid-cols-2 gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                className="border border-gray-300 rounded-lg py-3 px-2 font-semibold text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">Pesquise por preço</h3>
          <div className="grid grid-cols-1 gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition text-sm"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mb-4">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition">
            Ver anúncios (333.465)
          </button>
        </div>

        <button className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
          <Filter className="w-5 h-5" />
          Filtrar
        </button>
      </main>
    </div>
  );
}
