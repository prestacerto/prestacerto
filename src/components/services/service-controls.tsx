'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteServiceAction, toggleServiceActiveAction } from '@/app/(protected)/dashboard/services/actions';

export function ServiceControls({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const pending = useRef(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  async function change(remove: boolean) {
    if (pending.current) return;
    pending.current = true; setLoading(true); setError('');
    try {
      const result = remove ? await deleteServiceAction(id) : await toggleServiceActiveAction(id, !active);
      if (!result.success) { setError(result.error); return; }
      setConfirmDelete(false); router.refresh();
    } catch { setError('Não foi possível confirmar a alteração. Atualize a página e tente novamente.'); }
    finally { pending.current = false; setLoading(false); }
  }
  const buttonClass = 'min-h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60';
  return <div className="space-y-2">
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={loading} onClick={() => change(false)} className={buttonClass}>{active ? 'Pausar' : 'Ativar'}</button>
      <button type="button" disabled={loading} onClick={() => setConfirmDelete(true)} className={buttonClass}>Excluir</button>
    </div>
    {confirmDelete && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900"><p>Excluir este serviço? Esta ação não pode ser desfeita.</p><div className="mt-2 flex flex-wrap gap-2"><button type="button" disabled={loading} onClick={() => change(true)} className={buttonClass}>Confirmar exclusão</button><button type="button" disabled={loading} onClick={() => setConfirmDelete(false)} className={buttonClass}>Cancelar</button></div></div>}
    {loading && <p role="status" className="text-sm text-slate-600">Atualizando…</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}
