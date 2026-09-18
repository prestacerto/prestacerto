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
        >
          <Logo inverse />
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
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
        </div>
      </div>
    </header>
  );
}
