import { redirect } from "next/navigation";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav";

const navItems = [
  { href: "/dashboard", label: "Visão geral", icon: "layout-dashboard" },
  { href: "/dashboard/profile", label: "Meu perfil", icon: "user-circle" },
  { href: "/dashboard/para-voce", label: "Pra você", icon: "sparkles" },
  { href: "/dashboard/mercado", label: "Mercado", icon: "trending-up" },
  { href: "/dashboard/services", label: "Meus serviços", icon: "wrench" },
  { href: "/dashboard/projects", label: "Meus projetos", icon: "briefcase" },
  { href: "/dashboard/proposals", label: "Minhas propostas", icon: "send" },
  { href: "/dashboard/integrations", label: "Integrações", icon: "plug" },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const profile = await getProfile();
  const items =
    profile?.plan === "business"
      ? [...navItems, { href: "/dashboard/team", label: "Minha equipe", icon: "users" }]
      : navItems;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <DashboardSidebarNav items={items} />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
