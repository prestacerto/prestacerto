'use client';

import { useState } from 'react';
import { Plug, Check, AlertCircle, Settings, Trash2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'pending';
  category: 'payment' | 'communication' | 'analytics' | 'marketplace' | 'storage';
  connectedDate?: string;
}

export default function IntegrationsPage() {
  const [integrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Receba pagamentos internacionais com segurança',
      icon: '💳',
      status: 'connected',
      category: 'payment',
      connectedDate: '2024-08-10',
    },
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      description: 'Integração com MercadoPago para pagamentos Brasil',
      icon: '🏦',
      status: 'connected',
      category: 'payment',
      connectedDate: '2024-08-05',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Sincronize sua caixa de entrada Gmail',
      icon: '📧',
      status: 'connected',
      category: 'communication',
      connectedDate: '2024-08-01',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Receba notificações de projetos no Slack',
      icon: '💬',
      status: 'disconnected',
      category: 'communication',
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Rastreie performance do seu portfólio',
      icon: '📊',
      status: 'connected',
      category: 'analytics',
      connectedDate: '2024-08-08',
    },
    {
      id: 'aws-s3',
      name: 'AWS S3',
      description: 'Armazene arquivos em nuvem com segurança',
      icon: '☁️',
      status: 'disconnected',
      category: 'storage',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Integre com +3000 apps diferentes',
      icon: '⚡',
      status: 'pending',
      category: 'marketplace',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Conecte seus repositórios ao portfólio',
      icon: '🐙',
      status: 'disconnected',
      category: 'marketplace',
    },
  ]);

  const categories: any = {
    payment: '💳 Pagamentos',
    communication: '📞 Comunicação',
    analytics: '📊 Analytics',
    marketplace: '🔗 Marketplaces',
    storage: '☁️ Storage',
  };

  const statusConfig: any = {
    connected: { color: 'bg-green-100 text-green-800', icon: '✓', label: 'Conectado' },
    disconnected: { color: 'bg-gray-100 text-gray-800', icon: '○', label: 'Desconectado' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Pendente' },
  };

  const grouped = integrations.reduce((acc: any, int) => {
    if (!acc[int.category]) acc[int.category] = [];
    acc[int.category].push(int);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Plug className="w-8 h-8 text-blue-500" />
          Integrações
        </h1>
        <p className="text-gray-600">Conecte ferramentas para potencializar seu trabalho</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-green-700 mb-1">Conectadas</p>
          <p className="text-3xl font-bold text-green-600">
            {integrations.filter(i => i.status === 'connected').length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-1">Desconectadas</p>
          <p className="text-3xl font-bold text-gray-600">
            {integrations.filter(i => i.status === 'disconnected').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-yellow-700 mb-1">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600">
            {integrations.filter(i => i.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Integrations by Category */}
      {Object.entries(grouped).map(([category, integrals]: any) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{categories[category]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrals.map((integration: Integration) => {
              const config = statusConfig[integration.status];
              return (
                <div key={integration.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{integration.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>

                  {integration.connectedDate && (
                    <p className="text-xs text-gray-600 mb-4">
                      Conectado desde {new Date(integration.connectedDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <button className="flex-1 flex items-center justify-center gap-2 text-sm border text-gray-700 py-2 rounded hover:bg-gray-50 transition">
                          <Settings className="w-4 h-4" />
                          Configurar
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition">
                          <Trash2 className="w-4 h-4" />
                          Desconectar
                        </button>
                      </>
                    ) : integration.status === 'pending' ? (
                      <button className="w-full text-sm border text-gray-700 py-2 rounded hover:bg-gray-50 transition cursor-not-allowed opacity-50">
                        Solicitação Pendente
                      </button>
                    ) : (
                      <button className="w-full flex items-center justify-center gap-2 text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                        <Plug className="w-4 h-4" />
                        Conectar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* API Documentation */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-purple-600" />
          Documentação de API
        </h3>
        <p className="text-gray-700 mb-4">
          Integre com PrestaCerto usando nossa API REST. Acesse a documentação completa e exemplos de código.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition">
            Ver Documentação
          </button>
          <button className="border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-50 transition">
            Gerar API Key
          </button>
        </div>
      </div>
    </div>
  );
}
