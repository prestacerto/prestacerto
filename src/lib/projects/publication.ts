export type ProjectInput = { title: string; description: string; budget: string; deadline: string; skills: string; category: string };
export const EMPTY_PROJECT: ProjectInput = { title: '', description: '', budget: '', deadline: '', skills: '', category: 'geral' };
export const PROJECT_CATEGORIES: Record<string, string | null> = { geral: null, desenvolvimento: 'desenvolvimento-web', design: 'design-grafico', marketing: 'marketing-digital', conteudo: 'redacao-conteudo', consultoria: null };

export function validatePublication(value: unknown, now = new Date()) {
  if (!value || typeof value !== 'object') return { error: 'Preencha os dados do projeto.' } as const;
  const input = value as Record<string, unknown>;
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const description = typeof input.description === 'string' ? input.description.trim() : '';
  const budget = (typeof input.budget === 'number' || typeof input.budget === 'string') && String(input.budget).trim() ? Number(input.budget) : NaN;
  if (title.length < 5 || title.length > 120) return { error: 'O título precisa ter de 5 a 120 caracteres.' } as const;
  if (description.length < 20 || description.length > 10000) return { error: 'A descrição precisa ter de 20 a 10.000 caracteres.' } as const;
  if (!Number.isFinite(budget) || budget < 1 || budget > 99999999.99) return { error: 'Informe um orçamento válido, a partir de R$ 1.' } as const;
  let deadlineDays: number | null = null;
  if (input.deadline) {
    const day = typeof input.deadline === 'string' ? input.deadline : '';
    const date = new Date(`${day}T12:00:00Z`);
    const today = now.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== day || day < today) return { error: 'Escolha uma data válida a partir de hoje.' } as const;
    deadlineDays = Math.max(1, Math.ceil((date.getTime() - new Date(`${today}T12:00:00Z`).getTime()) / 86400000));
    if (deadlineDays > 730) return { error: 'Escolha um prazo de até dois anos.' } as const;
  }
  const values = typeof input.skills === 'string' ? input.skills.split(',') : Array.isArray(input.skills) ? input.skills : [];
  const skills = Array.from(new Set(values.filter((v): v is string => typeof v === 'string').map(v => v.trim()).filter(Boolean)));
  if (skills.length > 20 || skills.some(v => v.length > 80)) return { error: 'Use até 20 habilidades, com até 80 caracteres cada.' } as const;
  const category = typeof input.category === 'string' && Object.hasOwn(PROJECT_CATEGORIES, input.category) ? input.category : 'geral';
  return { data: { title, description, budget: Math.round(budget * 100) / 100, deadlineDays, skills, category, alsoHire: input.alsoHire === true } } as const;
}

export function projectInsertPayload(clientId: string, categoryId: number | null, data: NonNullable<ReturnType<typeof validatePublication>['data']>) {
  return { client_id: clientId, category_id: categoryId, title: data.title, description: data.description, skills: data.skills, budget_min: data.budget, budget_max: data.budget, deadline_days: data.deadlineDays, status: 'open' };
}
