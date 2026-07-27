import Link from "next/link";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const navItems = [
  { href: "/services", label: "Serviços" },
  { href: "/projects", label: "Projetos" },
  { href: "/plans", label: "Planos" },
];

export async function SiteHeader() {
  const user = await getAuthenticatedUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101828]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-white">
          PrestaCerto
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
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
