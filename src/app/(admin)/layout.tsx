"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Users, CreditCard, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const menuItems = [
    { href: "/admin", label: "Overview", icon: BarChart3 },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/admin/transacoes", label: "Transações", icon: CreditCard },
    { href: "/admin/propostas", label: "Propostas Fechadas", icon: BarChart3 },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Presta<span className="text-blue-600">Certo</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Painel Administrativo
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => router.push("/api/auth/logout")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition w-full"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
