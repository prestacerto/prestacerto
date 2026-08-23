'use client';

import { MapPin, Building2, Calendar } from 'lucide-react';

interface PropertyInfoProps {
  propertyId: string;
}

export default function PropertyInfo({ propertyId }: PropertyInfoProps) {
  const property = {
    zipCode: '04537-133',
    address: 'Avenida Presidente Juscelino Kubitschek, 1500',
    district: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    listedAt: '15 dias atrás',
    parking: 1,
    maintenanceFee: 1200,
    propertyTax: 450,
    hoa: true,
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Localização e Informações</h2>

      {/* Address */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex gap-3 mb-3">
          <MapPin className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <p className="text-gray-600 text-sm">Endereço</p>
            <p className="text-gray-900 font-semibold">{property.address}</p>
            <p className="text-gray-600 text-sm">
              {property.district}, {property.city} - {property.state}
            </p>
            <p className="text-gray-600 text-sm">CEP: {property.zipCode}</p>
          </div>
        </div>
      </div>

      {/* Building Info */}
      <div className="mb-6 pb-6 border-b">
        <div className="flex gap-3 mb-3">
          <Building2 className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <p className="text-gray-600 text-sm mb-2">Informações do Condomínio</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vagas de garagem:</span>
                <span className="font-semibold">{property.parking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condomínio:</span>
                <span className="font-semibold">R$ {property.maintenanceFee}/mês</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IPTU:</span>
                <span className="font-semibold">R$ {property.propertyTax}/mês</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listed info */}
      <div className="flex gap-3">
        <Calendar className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <p className="text-gray-600 text-sm">Anúncio publicado</p>
          <p className="text-gray-900 font-semibold">{property.listedAt}</p>
        </div>
      </div>
    </div>
  );
}
