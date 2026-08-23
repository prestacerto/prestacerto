'use client';

import { Bed, Bath, Ruler, MapPin, Home } from 'lucide-react';

interface PropertyDetailsProps {
  propertyId: string;
}

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  // Mock data - Replace with actual API call
  const property = {
    id: propertyId,
    title: 'Apartamento Luxuoso - Bairro Nobre',
    price: 850000,
    priceRent: 5500,
    type: 'Apartamento',
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description:
      'Apartamento luxuoso em condomínio de alto padrão com segurança 24h, academia, piscina e salão de festas. Localizado em uma das regiões mais valorizadas de São Paulo, próximo a shopping, restaurantes e transporte público.',
    features: [
      'Ar condicionado',
      'Piscina no condomínio',
      'Academia',
      'Portaria 24h',
      'Garagem',
      'Varanda',
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>

      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <MapPin size={20} />
        <span className="text-lg">
          {property.neighborhood}, {property.city}
        </span>
      </div>

      {/* Price section */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Venda</p>
            <p className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Aluguel</p>
            <p className="text-3xl font-bold text-blue-600">{formatPrice(property.priceRent)}/mês</p>
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <Bed size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Quartos</p>
            <p className="text-xl font-bold">{property.bedrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <Bath size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Banheiros</p>
            <p className="text-xl font-bold">{property.bathrooms}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <Ruler size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Área</p>
            <p className="text-xl font-bold">{property.area}m²</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Sobre o imóvel</h2>
        <p className="text-gray-700 leading-7">{property.description}</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Características</h2>
        <div className="grid grid-cols-2 gap-3">
          {property.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
