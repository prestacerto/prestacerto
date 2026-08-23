'use client';

import { useState } from 'react';
import { ChevronLeft, Eye, Heart, MessageSquare, TrendingUp, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');

  const stats = [
    { label: 'Visualizações', value: '3,249', icon: Eye, trend: '+12%' },
    { label: 'Favoritos', value: '127', icon: Heart, trend: '+8%' },
    { label: 'Mensagens', value: '34', icon: MessageSquare, trend: '+5%' },
    { label: 'Veículos Vendidos', value: '8', icon: TrendingUp, color: 'text-green-600' },
  ];

  const myVehicles = [
    {
      id: '1',
      brand: 'JEEP COMPASS',
      price: 259890,
      views: 1234,
      favorites: 89,
      messages: 12,
      status: 'active',
      highlighted: true,
    },
    {
      id: '2',
      brand: 'VOLKSWAGEN T-CROSS',
      price: 161690,
      views: 2845,
      favorites: 156,
      messages: 23,
      status: 'active',
      highlighted: false,
    },
  ];

  const soldVehicles = [
    {
      id: '3',
      brand: 'HONDA CIVIC',
      price: 122000,
      saleDate: '2024-08-15',
      daysToSell: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Meus Anúncios</h1>
            <p className="text-xs text-gray-500">Dashboard de Vendedor</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color || 'text-red-500'}`} />
                  <span className="text-xs font-bold text-green-600">{stat.trend}</span>
                </div>
                <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 bg-white p-4 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2 font-semibold border-b-2 transition ${
              activeTab === 'active'
                ? 'text-red-500 border-red-500'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Ativos ({myVehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`pb-2 font-semibold border-b-2 transition ${
              activeTab === 'sold'
                ? 'text-red-500 border-red-500'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Vendidos ({soldVehicles.length})
          </button>
        </div>

        {/* Active Vehicles */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {myVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{vehicle.brand}</h3>
                      {vehicle.highlighted && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(vehicle.price)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg">
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded p-3">
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Visualizações</p>
                    <p className="text-lg font-bold text-gray-900">
                      {vehicle.views.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Favoritos</p>
                    <p className="text-lg font-bold text-red-500">
                      {vehicle.favorites}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-xs">Mensagens</p>
                    <p className="text-lg font-bold text-blue-600">
                      {vehicle.messages}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {!vehicle.highlighted && (
                  <button className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition text-sm">
                    ⭐ Destacar por R$ 39,90
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sold Vehicles */}
        {activeTab === 'sold' && (
          <div className="space-y-3">
            {soldVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{vehicle.brand}</h3>
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(vehicle.price)}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                    ✓ Vendido
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Levou {vehicle.daysToSell} dias para vender
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
