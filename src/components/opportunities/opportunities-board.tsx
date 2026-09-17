'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, CheckCircle2, Clock3, SlidersHorizontal, Sparkles } from 'lucide-react';
import { normalizeSkill, skillCompatibility } from '@/lib/matching/skills';
import type { ProjectListItem } from '@/lib/supabase/queries';

const SAVED_KEY = 'prestacerto:saved-opportunities:v1';
const VISIT_KEY = 'prestacerto:opportunities:last-visit:v1';

function money(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); }
function budget(project: ProjectListItem) {
  if (project.budget_min && project.budget_max) return project.budget_min === project.budget_max ? money(project.budget_min) : `${money(project.budget_min)} – ${money(project.budget_max)}`;
  if (project.budget_min) return `A partir de ${money(project.budget_min)}`;
  if (project.budget_max) return `Até ${money(project.budget_max)}`;
  return 'Valor a combinar';
}

export function OpportunitiesBoard({ projects, skills, excludedIds }: { projects: ProjectListItem[]; skills: string[]; excludedIds: string[] }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const parsed: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
        setSaved(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string').slice(0, 100) : []);
        setLastVisit(localStorage.getItem(VISIT_KEY));
        localStorage.setItem(VISIT_KEY, new Date().toISOString());
      } catch { /* Saving is optional; browsing still works. */ }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const matches = useMemo(() => {
    const excluded = new Set(excludedIds);
    const needle = normalizeSkill(query);
    const floor = Number(minBudget) || 0;
    return projects.filter(project => !excluded.has(project.id)).map(project => ({ project, ...skillCompatibility(project.skills || [], skills) }))
      .filter(item => !savedOnly || saved.includes(item.project.id))
      .filter(item => !needle || normalizeSkill(`${item.project.title} ${item.project.description} ${(item.project.skills || []).join(' ')}`).includes(needle))
      .filter(item => !floor || Math.max(item.project.budget_min || 0, item.project.budget_max || 0) >= floor)
      .sort((a, b) => Number(saved.includes(b.project.id)) - Number(saved.includes(a.project.id)) || (b.score || 0) - (a.score || 0) || b.project.created_at.localeCompare(a.project.created_at));
  }, [projects, skills, excludedIds, query, minBudget, savedOnly, saved]);
  const newCount = lastVisit ? projects.filter(project => new Date(project.created_at) > new Date(lastVisit)).length : 0;
  const toggleSaved = (id: string) => {
    const next = saved.includes(id) ? saved.filter(value => value !== id) : [id, ...saved].slice(0, 100);
    setSaved(next);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* Browsing remains available. */ }
  };

  return <div>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm font-semibold text-blue-700">Novos desde sua última visita</p><p className="mt-2 text-3xl font-black text-blue-950">{ready ? newCount : '—'}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">Oportunidades abertas</p><p className="mt-2 text-3xl font-black text-slate-950">{projects.length}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-semibold text-slate-500">Salvas para revisar</p><p className="mt-2 text-3xl font-black text-slate-950">{ready ? saved.length : '—'}</p></div>
    </div>

    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-800"><SlidersHorizontal className="size-4 text-blue-600"/>Encontre o que combina com você</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
        <label className="text-sm font-medium text-slate-700">Buscar por palavra ou habilidade<input value={query} onChange={e => setQuery(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Ex.: React, design, fotografia"/></label>
        <label className="text-sm font-medium text-slate-700">Orçamento mínimo<input value={minBudget} onChange={e => setMinBudget(e.target.value)} type="number" min="0" step="100" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="R$ 0"/></label>
        <label className="flex min-h-11 items-center gap-2 self-end rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700"><input type="checkbox" checked={savedOnly} onChange={e => setSavedOnly(e.target.checked)} className="size-4 accent-blue-600"/>Só salvas</label>
      </div>
      {skills.length > 0 && <p className="mt-4 text-sm leading-6 text-slate-500">Comparando com: <span className="font-semibold text-slate-700">{[...new Set(skills)].slice(0, 8).join(', ')}</span></p>}
    </div>

    <div className="mt-6 space-y-3">
      {matches.length ? matches.map(({ project, matched, score, total }) => {
        const isNew = Boolean(lastVisit && new Date(project.created_at) > new Date(lastVisit));
        const isSaved = saved.includes(project.id);
        return <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md sm:p-6">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2">{isNew && <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">Novo para você</span>}{score != null && matched.length > 0 && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{score}% compatível</span>}</div><h2 className="mt-3 text-lg font-bold text-slate-950">{project.title}</h2></div><button type="button" onClick={() => toggleSaved(project.id)} aria-pressed={isSaved} aria-label={isSaved ? `Remover ${project.title} dos salvos` : `Salvar ${project.title}`} className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${isSaved ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:text-blue-700'}`}><Bookmark className={`size-5 ${isSaved ? 'fill-current' : ''}`}/></button></div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{matched.slice(0, 5).map(skill => <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800"><CheckCircle2 className="size-3"/>{skill}</span>)}</div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4"><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm"><strong className="text-slate-800">{budget(project)}</strong>{project.deadline_days && <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="size-4"/>{project.deadline_days} dias</span>}</div><Link href={`/projects/${project.id}`} className="inline-flex min-h-11 items-center gap-2 font-bold text-blue-700">Ver projeto <ArrowRight className="size-4"/></Link></div>
          {total === 0 && <p className="mt-3 text-xs text-slate-500">Este projeto ainda não informou habilidades. Confira o escopo antes de enviar uma proposta.</p>}
        </article>;
      }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Sparkles className="mx-auto size-8 text-blue-600"/><h2 className="mt-4 text-lg font-bold text-slate-900">Nenhuma oportunidade com esses filtros.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Limpe a busca ou ajuste o orçamento. Novos projetos aparecerão aqui assim que forem publicados.</p><button type="button" onClick={() => { setQuery(''); setMinBudget(''); setSavedOnly(false); }} className="mt-5 min-h-11 font-bold text-blue-700">Limpar filtros</button></div>}
    </div>
  </div>;
}
