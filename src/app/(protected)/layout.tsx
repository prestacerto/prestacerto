import { redirect } from "next/navigation";
import { LayoutDashboard, Briefcase, Send, Users, Wrench, Plug, UserCircle, Sparkles, TrendingUp } from "lucide-react";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";

const navItems = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Meu perfil", icon: UserCircle },
  { href: "/dashboard/para-voce", label: "Pra você", icon: Sparkles },
  { href: "/dashboard/mercado", label: "Mercado", icon: TrendingUp },
  { href: "/dashboard/services", label: "Meus serviços", icon: Wrench },
  { href: "/dashboard/projects", label: "Meus projetos", icon: Briefcase },
  { href: "/dashboard/proposals", label: "Minhas propostas", icon: Send },
  { href: "/dashboard/integrations", label: "Integrações", icon: Plug },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O proxy (src/proxy.ts) já bloqueia /dashboard/* sem sessão — isso aqui é
  // a camada 2 de defesa em profundidade, não a única checagem.
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const profile = await getProfile();
  const items =
    profile?.plan === "business"
      ? [...navItems, { href: "/dashboard/team", label: "Minha equipe", icon: Users }]
      : navItems;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <DashboardSidebarNav items={items} />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
