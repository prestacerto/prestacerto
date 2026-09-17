import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Presentation only: callers provide the link, avoiding nested interactive elements.
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <span className="inline-flex items-center gap-2">
    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"><Check className="size-6" strokeWidth={3}/></span>
    <span className={cn('text-2xl font-semibold tracking-[-0.06em]', inverse ? 'text-slate-900' : 'text-white')}>presta<span className="font-extrabold text-blue-600">certo</span></span>
  </span>;
}
