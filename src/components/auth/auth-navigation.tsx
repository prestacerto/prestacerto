'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type NavigationState = {
  signedIn: boolean;
  role: 'client' | 'freelancer' | 'both' | null;
  status: 'loading' | 'ready' | 'error';
};
const publicNavigation: NavigationState = { signedIn: false, role: null, status: 'loading' };
const NavigationContext = createContext<NavigationState>(publicNavigation);

export function AuthNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [resolved, setResolved] = useState<{ pathname: string; value: NavigationState } | null>(null);
  const isLanding = pathname === '/para-clientes' || pathname === '/para-prestadores';

  useEffect(() => {
    // Campaign pages intentionally use a public header/footer and need no session lookup.
    if (isLanding) return;
    let active = true;
    let controller: AbortController | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const refresh = async () => {
      controller?.abort();
      clearTimeout(timeout);
      const request = new AbortController();
      controller = request;
      timeout = setTimeout(() => request.abort(), 8000);
      try {
        const response = await fetch('/api/auth/navigation', {
          credentials: 'same-origin', cache: 'no-store', signal: request.signal,
        });
        if (!response.ok) throw new Error('navigation_unavailable');
        const data: unknown = await response.json();
        if (!data || typeof data !== 'object' || !('signedIn' in data) || typeof data.signedIn !== 'boolean') {
          throw new Error('invalid_navigation');
        }
        const role = 'role' in data && (data.role === 'client' || data.role === 'freelancer' || data.role === 'both') ? data.role : null;
        if (active && controller === request && !request.signal.aborted) {
          setResolved({ pathname, value: { signedIn: data.signedIn, role: data.signedIn ? role : null, status: 'ready' } });
        }
      } catch {
        if (active && controller === request) {
          setResolved({ pathname, value: { signedIn: false, role: null, status: 'error' } });
        }
      } finally {
        if (controller === request) clearTimeout(timeout);
      }
    };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) void refresh(); };
    void refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', restore);
    return () => {
      active = false;
      controller?.abort();
      clearTimeout(timeout);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', restore);
    };
  }, [pathname, isLanding]);

  // Never render a previous route/account's state while its new request is pending.
  const value = !isLanding && resolved?.pathname === pathname ? resolved.value : publicNavigation;
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useAuthNavigation() {
  return useContext(NavigationContext);
}
