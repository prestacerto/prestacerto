import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const navItems = [
  { href: "/services", label: "Buscar prestadores" },
  { href: "/projects", label: "Projetos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/certo-ai", label: "Certo AI" },
  { href: "/plans", label: "Planos" },
];

export async function SiteHeader() {
  const user = await getAuthenticatedUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Voltar para a página inicial do PrestaCerto"
          className="shrink-0 rounded-xl transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          <Logo inverse />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {user ? (
            <LinkButton
              href="/dashboard"
              variant="ghost"
              size="sm"
              className="text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Dashboard
            </LinkButton>
          ) : (
            <LinkButton
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:inline-flex"
            >
              Entrar
            </LinkButton>
          )}
          <LinkButton
            href={user ? "/dashboard/projects/new" : "/register"}
            size="sm"
            className="bg-blue-600 font-bold text-white shadow-sm shadow-blue-600/15 hover:bg-blue-700"
          >
            <span className="hidden sm:inline">{user ? "Publicar projeto" : "Cadastre-se grátis"}</span>
            <span className="sm:hidden">Cadastrar</span>
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
