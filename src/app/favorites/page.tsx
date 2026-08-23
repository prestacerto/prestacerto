'use client';

import { useState } from 'react';
import { ChevronLeft, Heart, ChevronDown, MapPin, Store } from 'lucide-react';
import Link from 'next/link';
import { VehicleCard } from '@/components/vehicle-card';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'cars' | 'motos'>('cars');
  const [sortBy, setSortBy] = useState('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const favoriteVehicles = [
    {
      id: '1',
      brand: 'VOLKSWAGEN',
      model: 'T-CROSS',
      price: 161690,
      year: 2026,
      mileage: 51795,
      location: 'São Bernardo do Campo',
      type: 'SUV',
      image: '/vehicles/vw-tcross.jpg',
      isFavorite: true,
      status: 'sold' as const,
      isHighlighted: false,
    },
    {
      id: '2',
      brand: 'HONDA',
      model: 'CIVIC',
      price: 122000,
      year: 2025,
      mileage: 15000,
      location: 'São Paulo',
      type: 'Sedan',
      image: '/vehicles/honda-civic.jpg',
      isFavorite: true,
      status: 'available' as const,
      isHighlighted: false,
    },
    {
      id: '3',
      brand: 'JEEP',
      model: 'COMPASS',
      price: 259890,
      year: 2026,
      mileage: 51795,
      location: 'São Paulo',
      type: 'SUV',
      image: '/vehicles/jeep-compass.jpg',
      isFavorite: true,
      status: 'available' as const,
      isHighlighted: false,
    },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Salvos recentemente' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'mileage-asc', label: 'Menor km' },
    { value: 'mileage-desc', label: 'Maior km' },
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
            <h1 className="text-lg font-bold">Favoritos</h1>
          </div>
          <button className="text-red-500 font-semibold text-sm hover:text-red-600">
            Ordenar
          </button>
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
            Carros ({favoriteVehicles.length})
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
        {/* Sort Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-full flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
          >
            <span className="text-sm text-gray-700">
              {sortOptions.find((opt) => opt.value === sortBy)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showSortMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${
                    sortBy === option.value
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicles Grid */}
        <div className="space-y-4">
          {favoriteVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {favoriteVehicles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Nenhum favorito salvo
            </h3>
            <p className="text-gray-500 mb-4">
              Comece a favoritar veículos para acompanhá-los
            </p>
            <Link
              href="/search"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Buscar Veículos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
