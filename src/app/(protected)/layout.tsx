import { redirect } from "next/navigation";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";
import { type LucideIcon, LayoutDashboard, UserCircle, Sparkles, TrendingUp, Wrench, Briefcase, Send, Plug, Users } from "lucide-react";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard as LucideIcon },
  { href: "/dashboard/profile", label: "Meu perfil", icon: UserCircle as LucideIcon },
  { href: "/dashboard/para-voce", label: "Pra você", icon: Sparkles as LucideIcon },
  { href: "/dashboard/mercado", label: "Mercado", icon: TrendingUp as LucideIcon },
  { href: "/dashboard/services", label: "Meus serviços", icon: Wrench as LucideIcon },
  { href: "/dashboard/projects", label: "Meus projetos", icon: Briefcase as LucideIcon },
  { href: "/dashboard/proposals", label: "Minhas propostas", icon: Send as LucideIcon },
  { href: "/dashboard/integrations", label: "Integrações", icon: Plug as LucideIcon },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/dashboard");

  // Try to get profile, but don't block if it fails — user is authenticated
  const profile = await getProfile();
  console.log("[ProtectedLayout] User authenticated:", user.id, "Profile:", profile?.id);

  const items =
    profile?.plan === "business"
      ? [...navItems, { href: "/dashboard/team", label: "Minha equipe", icon: Users as LucideIcon }]
      : navItems;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <DashboardSidebarNav items={items} />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
