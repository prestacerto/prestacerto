import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const navItems = [
  { href: "/services", label: "Serviços" },
  { href: "/projects", label: "Projetos" },
  { href: "/vagas", label: "Vagas", badge: "NOVO" },
  { href: "/plans", label: "Planos" },
];

export async function SiteHeader() {
  const user = await getAuthenticatedUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#3f4451]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
              {item.badge && (
                <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <LinkButton href="/dashboard" variant="secondary" size="sm">
              Dashboard
            </LinkButton>
          ) : (
            <LinkButton
              href="/login"
              variant="ghost"
              size="sm"
              className="text-slate-200 hover:text-white"
            >
              Entrar
            </LinkButton>
          )}
          <LinkButton
            href={user ? "/dashboard/projects/new" : "/register"}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500"
          >
            Publicar projeto
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
