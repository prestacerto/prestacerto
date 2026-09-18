'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Zap, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950">
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">CERTO Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Dashboard Épica</p>
        </div>

        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition">
            <BarChart3 size={20} />
            Dashboard
          </Link>
          <Link href="/admin/revenue" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 font-semibold hover:bg-slate-800 transition">
            <TrendingUp size={20} />
            Receita Detalhada
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 font-semibold hover:bg-slate-800 transition">
            <Zap size={20} />
            Produtos
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 font-semibold hover:bg-slate-800 transition">
            <Settings size={20} />
            Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-950">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
