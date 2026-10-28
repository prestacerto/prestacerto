'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, MessageSquare } from 'lucide-react';

interface ProspectsViewProps {
  userId: string;
}

export function ProspectsView({ userId }: ProspectsViewProps) {
  // Mock data - será substituído com data real da API
  const prospects = [
    {
      id: 1,
      name: 'João Silva',
      company: 'TechCorp Brasil',
      position: 'CEO',
      score: 85,
      status: 'contacted',
      lastMessage: 'Há 2h',
    },
    {
      id: 2,
      name: 'Maria Santos',
      company: 'Digital Agency XYZ',
      position: 'Gerente de Marketing',
      score: 72,
      status: 'qualified',
      lastMessage: 'Há 1 dia',
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      company: 'StartUp Innovation',
      position: 'CTO',
      score: 60,
      status: 'pending',
      lastMessage: 'Não contactado',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-emerald-100 text-emerald-800';
      case 'qualified':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Prospect</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Empresa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{prospect.name}</p>
                      <p className="text-sm text-slate-600">{prospect.position}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{prospect.company}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                        {prospect.score}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`text-xs ${getStatusColor(prospect.status)}`}>
                      {prospect.status === 'contacted'
                        ? 'Contactado'
                        : prospect.status === 'qualified'
                          ? 'Qualificado'
                          : 'Pendente'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition">
                        <Eye className="h-4 w-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition">
                        <Mail className="h-4 w-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition">
                        <MessageSquare className="h-4 w-4 text-slate-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
