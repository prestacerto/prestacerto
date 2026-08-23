'use client';

import { Eye, Home, MessageSquare, Calendar } from 'lucide-react';

export default function SellerDashboard() {
  const stats = [
    {
      icon: Home,
      label: 'Anúncios Ativos',
      value: 5,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Eye,
      label: 'Visualizações',
      value: 1250,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageSquare,
      label: 'Mensagens',
      value: 23,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Calendar,
      label: 'Agendamentos',
      value: 8,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-md">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <Icon size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </>
  );
}
