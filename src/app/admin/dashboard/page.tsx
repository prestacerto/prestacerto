'use client';

import { TrendingUp, CreditCard, Smartphone, Package, Users, Target } from 'lucide-react';
import { RevenueChart } from '@/components/admin/revenue-chart';
import { PaymentBreakdown } from '@/components/admin/payment-breakdown';
import { ProductPerformance } from '@/components/admin/product-performance';
import { PlanAnalysis } from '@/components/admin/plan-analysis';

const KPI = ({ icon: Icon, label, value, change }: any) => (
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

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white">Dashboard Operacional</h1>
        <p className="mt-1 text-slate-400">Visão completa de receita, produtos e performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPI icon={TrendingUp} label="MRR Total" value="R$ 45.230" change="12.5%" />
        <KPI icon={CreditCard} label="Cartão" value="R$ 28.140" change="8.3%" />
        <KPI icon={Smartphone} label="PIX" value="R$ 17.090" change="18.2%" />
        <KPI icon={Package} label="Produtos Ativos" value="29" change="3" />
        <KPI icon={Users} label="Subscribers" value="1.250" change="4.7%" />
        <KPI icon={Target} label="Churn Rate" value="2.3%" change="-0.5%" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Payment Methods */}
        <div>
          <PaymentBreakdown />
        </div>
      </div>

      {/* Product & Plan Analysis */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductPerformance />
        <PlanAnalysis />
      </div>

      {/* Revenue Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">Receita Diária (últimos 15 dias)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Data</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Cartão</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">PIX</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Total</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Transações</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '18 Set', card: 2850, pix: 1290, transactions: 45 },
                { date: '17 Set', card: 2640, pix: 980, transactions: 38 },
                { date: '16 Set', card: 3120, pix: 1540, transactions: 52 },
                { date: '15 Set', card: 2450, pix: 860, transactions: 34 },
                { date: '14 Set', card: 2980, pix: 1190, transactions: 44 },
              ].map((row) => (
                <tr key={row.date} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-300">{row.date}</td>
                  <td className="px-4 py-3 text-right text-slate-300">R$ {row.card.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-slate-300">R$ {row.pix.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-400">R$ {(row.card + row.pix).toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{row.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
