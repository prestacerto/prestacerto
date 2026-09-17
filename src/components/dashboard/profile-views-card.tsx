import Link from 'next/link';
import { ArrowRight, Eye, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

function startOfDay(daysAgo: number) {
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
  return date.toISOString();
}

export async function ProfileViewsCard({ userId, paid }: { userId: string; paid: boolean }) {
  const db = await createClient();
  const { data, error } = await db.from('profile_views').select('viewed_at').eq('freelancer_id', userId).gte('viewed_at', startOfDay(13)).order('viewed_at');
  if (error) return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Eye className="size-5 text-blue-600"/><h2 className="font-bold text-slate-950">Visualizações do perfil</h2></div><p className="mt-3 text-sm leading-6 text-slate-500">O contador será exibido quando a atualização de métricas estiver disponível no banco.</p><Link href={`/perfil/${userId}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700">Ver meu perfil público <ArrowRight className="size-4"/></Link></section>;
  const current = (data || []).filter(row => new Date(row.viewed_at) >= new Date(startOfDay(6))).length;
  const previous = (data || []).length - current;
  const change = previous ? Math.round((current - previous) / previous * 100) : null;
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfDay(6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' }).format(date).replace('.', ''), count: (data || []).filter(row => row.viewed_at.slice(0, 10) === key).length };
  });
  const max = Math.max(...daily.map(day => day.count), 1);
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Eye className="size-5 text-blue-600"/><h2 className="font-bold text-slate-950">Visualizações do perfil</h2></div><p className="mt-3 text-3xl font-black text-slate-950">{current}</p><p className="mt-1 text-sm text-slate-500">nos últimos 7 dias</p></div>{change != null && <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${change >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}><TrendingUp className="size-3"/>{change >= 0 ? '+' : ''}{change}%</span>}</div>
    {paid ? <div className="mt-6 flex h-24 items-end gap-2" aria-label="Visualizações por dia">{daily.map(day => <div key={day.key} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-xs font-semibold text-slate-600">{day.count}</span><span className="w-full rounded-t bg-blue-500" style={{ height: `${Math.max(4, day.count / max * 54)}px` }}/><span className="text-xs text-slate-400">{day.label}</span></div>)}</div> : <div className="mt-5 rounded-xl bg-blue-50 p-4"><p className="text-sm leading-6 text-blue-950">No Pro, você acompanha a evolução diária e compara com a semana anterior.</p><Link href="/plans" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-blue-700">Conhecer o Pro <ArrowRight className="size-4"/></Link></div>}
    <Link href={`/perfil/${userId}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700">Ver meu perfil público <ArrowRight className="size-4"/></Link></section>;
}
