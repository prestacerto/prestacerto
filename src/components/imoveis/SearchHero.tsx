'use client';

import { useState } from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function SearchHero() {
  const [searchType, setSearchType] = useState<'venda' | 'aluguel'>('venda');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">SeuImóvel</h1>
          <p className="text-xl text-blue-100">Encontre o imóvel perfeito para você</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Type selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('venda')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                searchType === 'venda'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500/50 hover:bg-blue-500/70'
              }`}
            >
              <Home size={20} />
              Para Venda
            </button>
            <button
              onClick={() => setSearchType('aluguel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                searchType === 'aluguel'
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-500/50 hover:bg-blue-500/70'
              }`}
            >
              <Home size={20} />
              Para Aluguel
            </button>
          </div>

          {/* Search box */}
          <div className="bg-white rounded-lg p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                <MapPin size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Cidade, bairro ou CEP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-gray-800"
                />
              </div>

              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                <DollarSign size={20} className="text-gray-400" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full outline-none text-gray-800"
                >
                  <option value="">Qualquer preço</option>
                  <option value="0-500">Até R$ 500 mil</option>
                  <option value="500-1000">R$ 500k - R$ 1M</option>
                  <option value="1000-2000">R$ 1M - R$ 2M</option>
                  <option value="2000+">Acima de R$ 2M</option>
                </select>
              </div>

              <input
                type="number"
                placeholder="Quartos"
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 outline-none"
              />

              <Link
                href={`/imoveis?location=${location}&type=${searchType}&price=${priceRange}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Search size={20} />
                Buscar
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-blue-100">Imóveis</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-blue-100">Virtual</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">Disponível</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-4">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-sm text-blue-100">Comissão</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
