'use client';

import { Heart, Star, Zap } from 'lucide-react';
import Image from 'next/image';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  type: string;
  image: string;
  isFavorite: boolean;
  status: 'available' | 'sold';
  isHighlighted?: boolean;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-video">
        {vehicle.isHighlighted && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </div>
        )}

        {vehicle.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="text-white text-3xl font-bold text-center">
              VENDIDO
            </div>
          </div>
        )}

        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-500">Imagem do veículo</span>
        </div>

        <button className="absolute top-2 left-2 bg-white/90 hover:bg-white p-2 rounded-full transition">
          <Heart
            className={`w-5 h-5 ${vehicle.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand & Model */}
        <div className="mb-2">
          <h3 className="font-bold text-gray-900">
            {vehicle.brand} <span className="text-red-500">{vehicle.model}</span>
          </h3>
          <p className="text-xs text-gray-500">
            {vehicle.year}/{vehicle.year + 1} · {vehicle.mileage.toLocaleString()} km
          </p>
        </div>

        {/* Price */}
        <div className="mb-3 py-2 border-t border-b border-gray-200">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏷️</span>
            <span>{vehicle.type}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold text-sm transition">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
