'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsViewProps {
  userId: string;
}

export function AnalyticsView({ userId }: AnalyticsViewProps) {
  // Mock data
  const leadsData = [
    { day: 'Seg', leads: 12 },
    { day: 'Ter', leads: 19 },
    { day: 'Qua', leads: 15 },
    { day: 'Qui', leads: 25 },
    { day: 'Sex', leads: 22 },
    { day: 'Sab', leads: 0 },
    { day: 'Dom', leads: 0 },
  ];

  const conversionData = [
    { name: 'Hot', value: 8 },
    { name: 'Warm', value: 15 },
    { name: 'Cold', value: 27 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#94a3b8'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Leads Totais', value: '50', trend: '+12%' },
          { label: 'Taxa Conversão', value: '16%', trend: '+3%' },
          { label: 'Tempo Médio', value: '2.3d', trend: '-0.5d' },
        ].map((metric) => (
          <Card key={metric.label} className="p-6">
            <p className="text-sm text-slate-600">{metric.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
            <p className="text-sm text-emerald-600 mt-2">{metric.trend}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Leads por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leadsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Lead Quality */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Qualidade dos Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {[
            { action: 'Email enviado', target: 'João Silva (TechCorp)', time: '2h atrás' },
            { action: 'Lead qualificado', target: 'Maria Santos (Digital Agency)', time: '5h atrás' },
            { action: 'Seguimento automático', target: 'Carlos Oliveira (StartUp)', time: '1 dia atrás' },
          ].map((activity, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b last:border-b-0">
              <div>
                <p className="font-medium text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-600">{activity.target}</p>
              </div>
              <p className="text-sm text-slate-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
