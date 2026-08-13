'use client';

import { useState } from 'react';
import { FileText, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react';

interface Contract {
  id: string;
  title: string;
  client: string;
  value: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'completed' | 'disputed';
  pdfUrl?: string;
  description: string;
  milestones: number;
}

export default function ContractsPage() {
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Desenvolvimento App Mobile',
      client: 'Tech Startup XYZ',
      value: 25000,
      startDate: '2024-08-01',
      endDate: '2024-11-30',
      status: 'active',
      description: 'Desenvolvimento de aplicativo mobile em React Native com 5 telas principais',
      milestones: 3,
    },
    {
      id: '2',
      title: 'Dashboard de Analytics',
      client: 'Empresa Analytics Inc',
      value: 12000,
      startDate: '2024-09-15',
      endDate: '2024-10-15',
      status: 'active',
      description: 'Dashboard com gráficos e relatórios em tempo real',
      milestones: 2,
    },
    {
      id: '3',
      title: 'Consultoria DevOps',
      client: 'Cloud Solutions Ltd',
      value: 15000,
      startDate: '2024-07-01',
      endDate: '2024-08-30',
      status: 'completed',
      description: 'Implementação de pipeline CI/CD e containerização',
      milestones: 4,
    },
    {
      id: '4',
      title: 'Bug Fix & Otimização',
      client: 'SaaS Platform Pro',
      value: 5000,
      startDate: '2024-10-01',
      endDate: '2024-10-30',
      status: 'pending',
      description: 'Correção de bugs críticos e otimização de performance',
      milestones: 1,
    },
    {
      id: '5',
      title: 'Integração API',
      client: 'Marketplace Brasil',
      value: 8000,
      startDate: '2024-08-15',
      endDate: '2024-09-15',
      status: 'disputed',
      description: 'Integração com APIs de terceiros (payment, shipping)',
      milestones: 2,
    },
  ]);

  const statusConfig: any = {
    active: { color: 'bg-blue-50 text-blue-700', icon: '📋', label: 'Ativo' },
    pending: { color: 'bg-yellow-50 text-yellow-700', icon: '⏳', label: 'Pendente' },
    completed: { color: 'bg-green-50 text-green-700', icon: '✅', label: 'Concluído' },
    disputed: { color: 'bg-red-50 text-red-700', icon: '⚠️', label: 'Disputa' },
  };

  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const activeValue = contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-8 h-8 text-purple-500" />
          Contratos
        </h1>
        <p className="text-gray-600">Gerenciar seus contratos e acordos com clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Total de Contratos</p>
          <p className="text-3xl font-bold">{contracts.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Ativos</p>
          <p className="text-3xl font-bold">{contracts.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Valor Total</p>
          <p className="text-3xl font-bold">R$ {(totalValue / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <p className="text-sm opacity-90 mb-1">Valor Ativo</p>
          <p className="text-3xl font-bold">R$ {(activeValue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map(contract => {
          const config = statusConfig[contract.status];
          return (
            <div key={contract.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{contract.title}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Cliente: <strong>{contract.client}</strong></p>
                  <p className="text-sm text-gray-600 mt-1">{contract.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">R$ {(contract.value / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-gray-600 mt-2">Valor do contrato</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Data Início</p>
                    <p className="font-semibold">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Data Fim</p>
                    <p className="font-semibold">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Milestones</p>
                    <p className="font-semibold">{contract.milestones} fases</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button className="flex items-center justify-center gap-2 text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
                {contract.pdfUrl && (
                  <button className="flex items-center justify-center gap-2 text-sm border text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </button>
                )}
                {contract.status === 'disputed' && (
                  <button className="flex items-center justify-center gap-2 text-sm bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition">
                    <AlertCircle className="w-4 h-4" />
                    Resolver Disputa
                  </button>
                )}
                {contract.status === 'active' && (
                  <button className="flex items-center justify-center gap-2 text-sm border text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition ml-auto">
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Concluído
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Precisa de um modelo de contrato?</h2>
        <p className="mb-4 opacity-90">Use nosso gerador automático de contratos adaptado às suas necessidades.</p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition">
          Gerar Novo Contrato →
        </button>
      </div>
    </div>
  );
}
