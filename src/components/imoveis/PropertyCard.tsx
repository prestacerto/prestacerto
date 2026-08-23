'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Ruler, Heart } from 'lucide-react';
import { useState } from 'react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    type: string;
    city: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
    featured?: boolean;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <Link href={`/imoveis/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
        {/* Image container */}
        <div className="relative overflow-hidden bg-gray-200 h-48">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Featured badge */}
          {property.featured && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              Destaque
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          >
            <Heart
              size={20}
              className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Price badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
            <div className="text-white text-xl font-bold">{formatPrice(property.price)}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin size={16} />
            <span>
              {property.neighborhood}, {property.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex gap-3 border-t pt-3 text-sm text-gray-700">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed size={16} />
                <span>{property.bedrooms}Q</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath size={16} />
                <span>{property.bathrooms}B</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Ruler size={16} />
              <span>{property.area}m²</span>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
            Ver detalhes
          </button>
        </div>
      </div>
    </Link>
  );
}
