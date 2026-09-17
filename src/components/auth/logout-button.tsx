'use client';

import { useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);

  async function logout() {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('LOGOUT_FAILED');
      // A full navigation drops the previous account's in-memory router state.
      // Project drafts and browser preferences remain in localStorage.
      window.location.assign('/');
    } catch {
      toast.error('Não foi possível sair agora. Tente novamente.');
      pending.current = false;
      setLoading(false);
    }
  }

  return <button type="button" onClick={logout} disabled={loading} aria-busy={loading} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-wait disabled:opacity-60', className)}><LogOut className="size-4" aria-hidden="true"/>{loading ? 'Saindo…' : 'Sair'}</button>;
}
