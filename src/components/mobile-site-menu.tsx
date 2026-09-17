"use client";
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
export function MobileSiteMenu({ items, signedIn, children }: { items: Array<{ href: string; label: string }>; signedIn: boolean; children?: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (details.current?.open && event.target instanceof Node && !details.current.contains(event.target)) {
        details.current.open = false;
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
    };
  }, []);
  return <details ref={details} className="relative lg:hidden" onKeyDown={event => { if (event.key === 'Escape' && details.current) { details.current.open = false; details.current.querySelector('summary')?.focus(); } }} onClick={event => { if (event.target instanceof Element && event.target.closest('a') && details.current) details.current.open = false; }}>
    <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden"><Menu className="size-5" /><span className="sr-only">Abrir menu de navegação</span></summary>
    <nav aria-label="Navegação no celular" className="absolute right-0 top-12 z-50 max-h-[75vh] w-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
      <Link href="/publicar-projeto" className="mb-1 block rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white">Publicar projeto grátis</Link>
      {items.map(item => <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50">{item.label}</Link>)}
      <Link href={signedIn ? '/dashboard' : '/login'} className="block rounded-lg px-3 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">{signedIn ? 'Meu painel' : 'Entrar na minha conta'}</Link>
      {signedIn && children}
      <Link href="/contratar" className="block rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-blue-50">Categorias e cidades</Link><Link href="/ajuda" className="block rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-blue-50">Ajuda</Link>
    </nav>
  </details>;
}
