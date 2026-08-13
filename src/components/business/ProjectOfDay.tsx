'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  budget_cents: number;
  category: string;
  match_score: number;
  posted_hours: number;
}

export function ProjectOfDay() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/business/daily-project')
      .then(r => r.json())
      .then(d => setProject(d.project))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded" />;
  if (!project) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.title}</h3>
        <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          Match {project.match_score}%
        </Badge>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Orçamento</p>
          <p className="font-bold text-green-700 dark:text-green-400">{formatCurrency(project.budget_cents)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
          <p className="font-bold text-gray-900 dark:text-white">{project.category}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Postado há</p>
          <p className="font-bold text-gray-900 dark:text-white">{project.posted_hours}h</p>
        </div>
      </div>

      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
        Enviar Proposta
      </button>
    </div>
  );
}
