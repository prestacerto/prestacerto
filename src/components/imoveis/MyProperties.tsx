'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Eye } from 'lucide-react';

// Mock data
const mockProperties = [
  {
    id: '1',
    title: 'Apartamento Luxuoso - Itaim Bibi',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1570129477492-45ac003d2e0b?w=400&h=300&fit=crop',
    views: 450,
    messages: 12,
    status: 'ativo',
  },
  {
    id: '2',
    title: 'Casa com Piscina - Morumbi',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    views: 520,
    messages: 8,
    status: 'ativo',
  },
  {
    id: '3',
    title: 'Apartamento Moderno - Vila Mariana',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    views: 890,
    messages: 23,
    status: 'ativo',
  },
];

export default function MyProperties() {
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
      console.log('Deletar:', id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Imóvel</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Preço</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Visualizações</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Mensagens</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockProperties.map((property) => (
              <tr key={property.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 font-semibold">
                  {formatPrice(property.price)}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Eye size={16} />
                    {property.views}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-600 text-sm">
                  {property.messages}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {property.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/dashboard/imoveis/${property.id}/editar`}
                      className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mockProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Você ainda não tem anúncios. Crie um novo!</p>
        </div>
      )}
    </div>
  );
}
