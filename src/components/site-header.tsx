<<<<<<< HEAD
'use client';

import Link from "next/link";
import dynamic from 'next/dynamic';
import { MobileSiteMenu } from "@/components/mobile-site-menu";
import { Logo } from "@/components/logo";
import { useAuthNavigation } from '@/components/auth/auth-navigation';

const LogoutButton = dynamic(() => import('@/components/auth/logout-button').then(module => module.LogoutButton));

const navItems = [
  { href: "/services", label: "Encontrar profissionais" },
  { href: "/ferramentas/propostas", label: "Certo Propostas" },
  { href: "/#para-profissionais", label: "Sou profissional" },
  { href: "/plans", label: "Planos" },
];

export function SiteHeader() {
  const { signedIn: user, status } = useAuthNavigation();
  const visibleNavItems = user
    ? [...navItems.slice(0, 2), { href: "/projects", label: "Projetos abertos" }, navItems[3]]
    : navItems;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.75rem] max-w-[1240px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label="Voltar para a página inicial do PrestaCerto"
          className="shrink-0 rounded-2xl transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 "
=======
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";

const navItems = [
  { href: "/services", label: "Buscar prestadores" },
  { href: "/projects", label: "Projetos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/certo-ai", label: "Certo AI" },
  { href: "/community", label: "Comunidade" },
  { href: "/plans", label: "Planos" },
];

export async function SiteHeader() {
  const user = await getAuthenticatedUser();
  const profile = user ? await getProfile() : null;
  const canPublishProjects = profile?.role === "client" || profile?.role === "both";
  const visibleNavItems = canPublishProjects
    ? navItems.filter((item) => item.href !== "/certo-ai" && item.href !== "/plans")
    : navItems;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Voltar para a página inicial do PrestaCerto"
          className="shrink-0 rounded-2xl transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
        >
          <Logo inverse />
        </Link>

<<<<<<< HEAD
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
=======
        <nav className="hidden items-center gap-8 lg:flex">
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
<<<<<<< HEAD
              className="py-3 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
=======
              className="text-[15px] font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
<<<<<<< HEAD
          <MobileSiteMenu items={visibleNavItems} signedIn={user || status === 'error'}>{user && <LogoutButton className="w-full justify-start hover:bg-blue-50" />}</MobileSiteMenu>
          <Link
            href={user || status === 'error' ? '/dashboard' : '/login'}
            className="hidden min-h-11 items-center rounded-lg px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
          >
            {user ? 'Meu painel' : status === 'error' ? 'Minha conta' : 'Entrar'}
          </Link>
          {user && <LogoutButton className="hidden lg:inline-flex" />}
          <Link
            href="/para-clientes"
            className="inline-flex min-h-11 items-center justify-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg bg-[#2454e8] px-4 font-semibold text-white hover:bg-blue-700 max-[359px]:hidden"
          >
            <span className="hidden sm:inline">Publicar projeto grátis</span>
            <span className="sm:hidden">Publicar</span>
          </Link>
=======
          <details className="relative lg:hidden">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-white/10 [&::-webkit-details-marker]:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu de navegação</span>
            </summary>
            <nav className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/15 dark:border-white/10 dark:bg-slate-950">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
          <div>
            <ThemeToggle />
          </div>
          {user ? (
            <LinkButton
              href="/dashboard"
              variant="ghost"
              size="sm"
              className="text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Dashboard
            </LinkButton>
          ) : (
            <LinkButton
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:inline-flex"
            >
              Entrar
            </LinkButton>
          )}
          <LinkButton
            href={user ? (canPublishProjects ? "/dashboard/projects/new" : "/dashboard") : "/register"}
            size="sm"
            className="rounded-xl bg-blue-600 px-5 font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)] hover:bg-blue-700"
          >
            <span className="hidden sm:inline">{user ? (canPublishProjects ? "Publicar projeto" : "Meu trabalho") : "Cadastre-se grátis"}</span>
            <span className="sm:hidden">Cadastrar</span>
          </LinkButton>
>>>>>>> a8ed36014a7494559268129c32c01bca01578764
        </div>
      </div>
    </header>
  );
}
