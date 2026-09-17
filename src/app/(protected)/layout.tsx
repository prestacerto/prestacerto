import Link from "next/link";
export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { DashboardSidebarNav, type NavItem } from "@/components/dashboard/sidebar-nav";
import { getProfile } from "@/lib/auth/getUser";
import { getNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = getNoIndexMetadata(
  "Área privada",
  "Painel privado de clientes e freelancers do PrestaCerto.",
);

const freelancerNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/projects", label: "Projetos", icon: "Briefcase" },
  { href: "/dashboard/services", label: "Meus serviços", icon: "Briefcase" },
  { href: "/publicar-projeto", label: "Publicar projeto", icon: "Send" },
  { href: "/dashboard/match", label: "Oportunidades", icon: "Sparkles" },
  { href: "/dashboard/pricing", label: "Certo Preço", icon: "TrendingUp" },
  { href: "/dashboard/timing", label: "Certo Timing", icon: "Zap" },
  { href: "/dashboard/portfolio", label: "Portfólio", icon: "UserCircle" },
  { href: "/dashboard/profile", label: "Meu perfil", icon: "UserCircle" },
  { href: "/dashboard/messages", label: "Mensagens", icon: "MessageCircle" },
  { href: "/dashboard/referral", label: "Indicações", icon: "TrendingUp" },
  { href: "/dashboard/integrations", label: "Integrações", icon: "Plug" },
  { href: "/dashboard/certo-curriculo", label: "Certo Currículo", icon: "UserCircle" },
];

const clientNavItems: NavItem[] = [
  { href: "/dashboard", label: "Minha contratação", icon: "LayoutDashboard" },
  { href: "/services", label: "Buscar prestadores", icon: "Briefcase" },
  { href: "/publicar-projeto", label: "Publicar projeto", icon: "Send" },
  { href: "/dashboard/messages", label: "Mensagens", icon: "MessageCircle" },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const canPublishProjects = profile?.role === "client" || profile?.role === "both";
  const navItems = profile?.role === "both" ? [...clientNavItems, ...freelancerNavItems.filter(item => !clientNavItems.some(client => client.href === item.href))] : canPublishProjects ? clientNavItems : freelancerNavItems;
  const mobileItems = profile?.role === 'client' ? clientNavItems : ['/dashboard', '/dashboard/services', '/projects', '/dashboard/messages', '/dashboard/profile'].map(path => navItems.find(item => item.href === path)).filter((item): item is NavItem => Boolean(item));

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="hidden shrink-0 border-r bg-white md:block">
          <div className="sticky top-0 p-6"><DashboardSidebarNav items={navItems} /></div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full px-3 py-6 sm:px-6 sm:py-10">
            <details className="mb-6 rounded-xl border border-slate-200 bg-white md:hidden"><summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">Menu do painel</summary><nav aria-label="Todas as opções do painel" className="grid grid-cols-2 gap-1 border-t border-slate-100 p-2">{navItems.map(item => <Link key={item.href} href={item.href} className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50">{item.label}</Link>)}</nav></details>
            {children}
          </div>
        </div>
      </div>

      {/* Bottom navigation - mobile only, sticky */}
      <nav aria-label="Atalhos do painel" className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white md:hidden">
        <div className="flex justify-around gap-1 overflow-x-auto">
          {mobileItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 flex-1 items-center justify-center px-2 py-3 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Add bottom padding to prevent content overlap with nav */}
      <div className="h-20 md:hidden" />

    </div>
  );
}
