'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { trackLandingEvent } from '@/lib/landing-tracking';

export function SiteHeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname !== '/para-clientes' && pathname !== '/para-prestadores') return children;
  const client = pathname === '/para-clientes';
  const journey = client ? 'client' : 'provider';
  return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
      <Link href="/" aria-label="Voltar para a página inicial do PrestaCerto" className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"><Logo inverse /></Link>
      <nav aria-label="Começar no PrestaCerto" className="flex items-center gap-5">
        <Link href={client ? '/para-prestadores' : '/para-clientes'} onClick={() => trackLandingEvent('presta_certo_journey_switch', journey)} className="hidden min-h-11 items-center text-sm font-medium text-slate-600 hover:text-blue-700 sm:inline-flex">{client ? 'Sou prestador' : 'Quero contratar'}</Link>
        <a href="#seu-proximo-passo" onClick={() => trackLandingEvent('presta_certo_cta_click', journey)} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"><span className="hidden sm:inline">{client ? 'Quero publicar um projeto' : 'Quero oferecer meu serviço'}</span><span className="sm:hidden">Começar</span></a>
      </nav>
    </div>
  </header>;
}
