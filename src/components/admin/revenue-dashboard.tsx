'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, ArrowLeft, CreditCard, Package, Smartphone, Target, TrendingUp, Users } from 'lucide-react';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { PaymentBreakdown } from '@/components/admin/payment-breakdown';
import { ProductPerformance } from '@/components/admin/product-performance';
import { PlanAnalysis } from '@/components/admin/plan-analysis';

type KpiProps = { icon: LucideIcon; label: string; value: string; change?: string };

function Kpi({ icon: Icon, label, value, change }: KpiProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="rounded-lg bg-blue-900/30 p-3">
          <Icon className="text-blue-400" size={24} />
        </div>
      </div>
      {change && <p className="mt-3 text-xs text-green-400">↑ {change} vs semana passada</p>}
    </div>
  );
}

const dailyRows = [
  { date: '18 Set', card: 2850, pix: 1290, transactions: 45 },
  { date: '17 Set', card: 2640, pix: 980, transactions: 38 },
  { date: '16 Set', card: 3120, pix: 1540, transactions: 52 },
  { date: '15 Set', card: 2450, pix: 860, transactions: 34 },
  { date: '14 Set', card: 2980, pix: 1190, transactions: 44 },
];

const brl = (value: number) => value.toLocaleString('pt-BR');

export function RevenueDashboard({ viewer }: { viewer: string }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
              <ArrowLeft size={16} /> Painel do dono
            </Link>
            <h1 className="mt-2 text-4xl font-black">Receita e produtos</h1>
            <p className="mt-1 text-slate-400">Diário, semanal e mensal · cartão vs PIX · por produto · por plano</p>
          </div>
          <p className="text-sm text-slate-500">{viewer}</p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-amber-700/60 bg-amber-900/20 p-4 text-sm text-amber-100">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            <strong>Dados de demonstração.</strong> Os números abaixo são ilustrativos até a integração com os webhooks do Assiny e o Supabase ser ligada.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Kpi icon={TrendingUp} label="MRR Total" value="R$ 45.230" change="12.5%" />
          <Kpi icon={CreditCard} label="Cartão" value="R$ 28.140" change="8.3%" />
          <Kpi icon={Smartphone} label="PIX" value="R$ 17.090" change="18.2%" />
          <Kpi icon={Package} label="Produtos ativos" value="29" change="3" />
          <Kpi icon={Users} label="Assinantes" value="1.250" change="4.7%" />
          <Kpi icon={Target} label="Churn" value="2.3%" change="-0.5%" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2"><RevenueChart /></div>
          <div><PaymentBreakdown /></div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProductPerformance />
          <PlanAnalysis />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-bold">Receita diária (últimos dias)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300">
                  <th className="px-4 py-3 text-left font-semibold">Data</th>
                  <th className="px-4 py-3 text-right font-semibold">Cartão</th>
                  <th className="px-4 py-3 text-right font-semibold">PIX</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-right font-semibold">Transações</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((row) => (
                  <tr key={row.date} className="border-b border-slate-800 text-slate-300 hover:bg-slate-800/50">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3 text-right">R$ {brl(row.card)}</td>
                    <td className="px-4 py-3 text-right">R$ {brl(row.pix)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-400">R$ {brl(row.card + row.pix)}</td>
                    <td className="px-4 py-3 text-right">{row.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
