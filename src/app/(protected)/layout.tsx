import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Send, Users, Wrench } from "lucide-react";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";

const navItems = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Meus serviços", icon: Wrench },
  { href: "/dashboard/projects", label: "Meus projetos", icon: Briefcase },
  { href: "/dashboard/proposals", label: "Minhas propostas", icon: Send },
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
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="sticky top-24 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
