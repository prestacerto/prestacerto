'use client';

import PropertyCard from './PropertyCard';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

// Mock data - Replace with actual API call
const mockProperties = [
  {
    id: '1',
    title: 'Apartamento Luxuoso - Bairro Nobre',
    price: 850000,
    type: 'apartamento',
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: 'https://images.unsplash.com/photo-1570129477492-45ac003d2e0b?w=500&h=400&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Casa com Piscina - Morumbi',
    price: 1200000,
    type: 'casa',
    city: 'São Paulo',
    neighborhood: 'Morumbi',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    featured: true,
  },
  {
    id: '3',
    title: 'Apartamento Moderno - Vila Mariana',
    price: 650000,
    type: 'apartamento',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    featured: false,
  },
  {
    id: '4',
    title: 'Cobertura Duplex - Pinheiros',
    price: 1500000,
    type: 'cobertura',
    city: 'São Paulo',
    neighborhood: 'Pinheiros',
    bedrooms: 4,
    bathrooms: 4,
    area: 300,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop',
    featured: true,
  },
  {
    id: '5',
    title: 'Terreno Comercial - Consolação',
    price: 450000,
    type: 'terreno',
    city: 'São Paulo',
    neighborhood: 'Consolação',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    image: 'https://images.unsplash.com/photo-1552072092-74b88589dc25?w=500&h=400&fit=crop',
    featured: false,
  },
  {
    id: '6',
    title: 'Kitinete - Centro',
    price: 250000,
    type: 'kitinete',
    city: 'São Paulo',
    neighborhood: 'Centro',
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    image: 'https://images.unsplash.com/photo-1507672692412-a1dd925c0a5d?w=500&h=400&fit=crop',
    featured: false,
  },
];

export default function PropertyGrid() {
  const [properties, setProperties] = useState(mockProperties);
  const [loading, setLoading] = useState(false);
  const [filteredType, setFilteredType] = useState<string>('todos');

  const propertyTypes = [
    { id: 'todos', label: 'Todos' },
    { id: 'apartamento', label: 'Apartamento' },
    { id: 'casa', label: 'Casa' },
    { id: 'cobertura', label: 'Cobertura' },
    { id: 'terreno', label: 'Terreno' },
  ];

  const filteredProperties =
    filteredType === 'todos'
      ? properties
      : properties.filter((p) => p.type === filteredType);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilteredType(type.id)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                filteredType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results counter */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProperties.length} imóvel{filteredProperties.length !== 1 ? 's' : ''} encontrado
          {filteredProperties.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum imóvel encontrado</p>
        </div>
      )}
    </div>
  );
}
