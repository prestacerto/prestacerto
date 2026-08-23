'use client';

import { useState } from 'react';
import { ChevronLeft, Heart, Share2, MessageCircle, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock vehicle data
  const vehicle = {
    id: params.id,
    brand: 'VOLKSWAGEN',
    model: 'T-CROSS',
    price: 161690,
    year: 2026,
    mileage: 51795,
    location: 'São Bernardo do Campo, SP',
    type: 'SUV',
    transmission: 'Automático',
    fuel: 'Flex',
    doors: 5,
    color: 'Preto',
    image: '/vehicles/vw-tcross.jpg',
    description:
      'Volkswagen T-Cross 1.4 250 TSI Total Flex Highline automático. Veículo em ótimo estado, sem bater, com histórico completo de manutenção.',
    features: [
      'Ar condicionado automático',
      'Teto solar',
      'Sensor de chuva',
      'Sensor de luz',
      'Freios ABS',
      'Controle de estabilidade',
      'Airbags',
      'Direção elétrica',
      'Câmera de ré',
      'Vidros e travas elétricas',
      'Espelhos aquecidos',
      'Bluetooth',
    ],
    seller: {
      name: 'João da Silva',
      phone: '(11) 98765-4321',
      location: 'São Bernardo do Campo, SP',
      rating: 4.8,
      reviews: 156,
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <Heart
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </header>

      <main>
        {/* Image */}
        <div className="relative bg-gray-200 aspect-video">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <span className="text-gray-500">Imagem do veículo</span>
          </div>
          <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Details */}
        <div className="px-4 py-4">
          {/* Title and Price */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {vehicle.brand} <span className="text-red-500">{vehicle.model}</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {vehicle.year}/{vehicle.year + 1} • {vehicle.mileage.toLocaleString()} km
            </p>
          </div>

          {/* Price */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
            <p className="text-gray-600 text-sm">Preço</p>
            <p className="text-3xl font-bold text-red-500">{formatPrice(vehicle.price)}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: 'Tipo', value: vehicle.type },
              { label: 'Câmbio', value: vehicle.transmission },
              { label: 'Combustível', value: vehicle.fuel },
              { label: 'Portas', value: vehicle.doors },
            ].map((info) => (
              <div
                key={info.label}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-xs text-gray-600">{info.label}</p>
                <p className="font-semibold text-gray-900 text-sm mt-1">
                  {info.value}
                </p>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900">{vehicle.location}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">Sobre este veículo</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Recursos</h3>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{vehicle.seller.name}</h3>
                <p className="text-sm text-gray-600">
                  ⭐ {vehicle.seller.rating} ({vehicle.seller.reviews} avaliações)
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              📍 {vehicle.seller.location}
            </p>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition">
          Fazer Proposta
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition">
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
          <button className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition">
            <Phone className="w-5 h-5" />
            Ligar
          </button>
        </div>
      </div>
    </div>
  );
}
