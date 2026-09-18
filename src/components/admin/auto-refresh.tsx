'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setUpdatedAt(new Date());
    const id = setInterval(() => {
      router.refresh();
      setUpdatedAt(new Date());
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);

  return (
    <p className="text-xs text-slate-500">
      <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500 align-middle" />
      Ao vivo · atualiza a cada {seconds}s{updatedAt && ` · ${updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
    </p>
  );
}
