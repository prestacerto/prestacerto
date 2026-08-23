'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, BarChart3, Users, Zap, CreditCard } from 'lucide-react';
import { AgentConfig } from './agent-config';
import { ProspectsView } from './prospects-view';
import { AnalyticsView } from './analytics-view';
import { BillingView } from './billing-view';

interface SalesAgentDashboardProps {
  userId: string;
}

export function SalesAgentDashboard({ userId }: SalesAgentDashboardProps) {
  const [activeTab, setActiveTab] = useState('config');

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Status', value: 'Ativo', icon: Zap, color: 'emerald' },
          { label: 'Leads Gerados', value: '0', icon: Users, color: 'blue' },
          { label: 'Taxa de Conversão', value: '0%', icon: BarChart3, color: 'purple' },
          { label: 'Próximo Run', value: 'Em 2h', icon: Settings, color: 'slate' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-lg border border-${card.color}-200 bg-${card.color}-50 p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${card.color}-700`}>{card.label}</p>
                  <p className={`text-2xl font-bold text-${card.color}-900 mt-1`}>{card.value}</p>
                </div>
                <Icon className={`h-8 w-8 text-${card.color}-400`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="billing">Cobrança</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <AgentConfig userId={userId} />
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          <ProspectsView userId={userId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView userId={userId} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingView userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
