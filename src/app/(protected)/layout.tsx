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
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <DashboardSidebarNav items={navItems as any} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
