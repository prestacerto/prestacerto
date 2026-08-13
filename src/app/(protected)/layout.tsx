'use client';

import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/products", label: "Produtos", icon: "Sparkles" },
  { href: "/dashboard/certo-ai", label: "Certo AI", icon: "Sparkles" },
  { href: "/dashboard/profile", label: "Perfil", icon: "UserCircle" },
  { href: "/dashboard/revenue", label: "Receita", icon: "CreditCard" },
  { href: "/dashboard/leaderboard", label: "Ranking", icon: "TrendingUp" },
  { href: "/dashboard/services", label: "Serviços", icon: "Wrench" },
  { href: "/dashboard/projects", label: "Projetos", icon: "Briefcase" },
  { href: "/dashboard/proposals", label: "Propostas", icon: "Send" },
  { href: "/dashboard/mercado", label: "Mercado", icon: "TrendingUp" },
  { href: "/dashboard/gamification", label: "Gamificação", icon: "Zap" },
  { href: "/dashboard/escrow", label: "Escrow", icon: "Lock" },
  { href: "/dashboard/tax", label: "Fiscal", icon: "FileText" },
  { href: "/dashboard/messages", label: "Mensagens", icon: "MessageCircle" },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main content - full width on mobile, with sidebar on desktop */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full px-3 py-6 sm:max-w-6xl sm:px-6 sm:py-10">
          {children}
        </div>
      </main>

      {/* Bottom navigation - mobile only, sticky */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white sm:hidden">
        <div className="flex justify-around gap-1 overflow-x-auto">
          {navItems.slice(0, 5).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex-1 px-2 py-3 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Add bottom padding to prevent content overlap with nav */}
      <div className="h-20 sm:hidden" />

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden w-56 border-l bg-white sm:block">
        <nav className="sticky top-0 overflow-y-auto p-6">
          <DashboardSidebarNav items={navItems as any} />
        </nav>
      </aside>
    </div>
  );
}
