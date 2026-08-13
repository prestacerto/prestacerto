// AUTH DISABLED - DASHBOARD OPEN TO ALL - v2
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";

const navItems = [
  { href: "/dashboard", label: "Visão geral", icon: "LayoutDashboard" },
  { href: "/dashboard/certo-ai", label: "Certo AI", icon: "Sparkles" },
  { href: "/dashboard/profile", label: "Meu perfil", icon: "UserCircle" },
  { href: "/dashboard/para-voce", label: "Pra você", icon: "Sparkles" },
  { href: "/dashboard/revenue", label: "Receita", icon: "CreditCard" },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: "TrendingUp" },
  { href: "/dashboard/job-matching", label: "Job Matching", icon: "Sparkles" },
  { href: "/dashboard/mercado", label: "Mercado", icon: "TrendingUp" },
  { href: "/dashboard/services", label: "Meus serviços", icon: "Wrench" },
  { href: "/dashboard/projects", label: "Meus projetos", icon: "Briefcase" },
  { href: "/dashboard/proposals", label: "Minhas propostas", icon: "Send" },
  { href: "/dashboard/integrations", label: "Integrações", icon: "Plug" },
  { href: "/dashboard/connects", label: "Conectares", icon: "Zap" },
  { href: "/dashboard/priority-queue", label: "Priority Queue", icon: "Zap" },
  { href: "/dashboard/monetization", label: "Planos", icon: "CreditCard" },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col sm:flex-row">
      {/* Sidebar - collapsible on mobile */}
      <aside className="w-full border-b sm:w-56 sm:border-b-0 sm:border-r">
        <nav className="sticky top-0 px-4 py-6">
          <DashboardSidebarNav items={navItems as any} />
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
