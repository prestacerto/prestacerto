// Sistema de engagement que traz usuário de volta TODOS OS DIAS

export type HookType = 'project_of_day' | 'weekly_visits' | 'opportunity_alert' | 'benchmark_alert' | 'streak_reminder';

export interface EngagementHook {
  type: HookType;
  title: string;
  message: string;
  cta: { text: string; href: string };
  priority: number; // 1-5, mais alto = mais importante
  trigger: string; // quando mostrar (daily, weekly, quando mudança ocorre)
}

export const ENGAGEMENT_HOOKS: Record<HookType, EngagementHook> = {
  project_of_day: {
    type: 'project_of_day',
    title: '🎯 Seu Projeto Perfeito de Hoje',
    message: 'Um projeto que bate 100% com suas skills apareceu agora em São Paulo',
    cta: { text: 'Ver projeto', href: '/projects' },
    priority: 5,
    trigger: 'daily_09am',
  },
  weekly_visits: {
    type: 'weekly_visits',
    title: '📈 Sua Semana em Números',
    message: 'Você teve 12 visitas no perfil, +40% vs semana passada! Você está crescendo.',
    cta: { text: 'Ver perfil', href: '/profile' },
    priority: 4,
    trigger: 'weekly_monday',
  },
  opportunity_alert: {
    type: 'opportunity_alert',
    title: '⚡ 3 Novos Projetos em 2 Horas',
    message: 'Desenvolvedor Web em São Paulo - aparecerem agora, seus concorrentes já estão respondendo',
    cta: { text: 'Ver agora', href: '/projects' },
    priority: 5,
    trigger: 'on_new_project',
  },
  benchmark_alert: {
    type: 'benchmark_alert',
    title: '💰 Seu Benchmark Mudou',
    message: 'Desenvolvedores Web em SP estão cobrando +18% esse mês. Aumentar seu preço?',
    cta: { text: 'Ver benchmark', href: '/ferramentas/benchmark' },
    priority: 3,
    trigger: 'weekly_benchmark',
  },
  streak_reminder: {
    type: 'streak_reminder',
    title: '🔥 Sua Sequência: 29 Dias',
    message: 'Só falta 1 dia pra desbloquear a badge de 30 Dias Ativo! Não quebra a sequência.',
    cta: { text: 'Ir ao dashboard', href: '/dashboard' },
    priority: 4,
    trigger: 'daily_oncePerDay',
  },
};

// Sistema de notificações em cascata (traz de volta múltiplas vezes por dia)
export const ENGAGEMENT_SEQUENCE = [
  // Manhã (9am) - Projeto do dia
  { time: '09:00', hook: 'project_of_day', delay: 0 },
  // Meio de tarde (2pm) - Quando tem novo projeto
  { time: '14:00', hook: 'opportunity_alert', delay: 0 },
  // Final de dia (5pm) - Streak reminder
  { time: '17:00', hook: 'streak_reminder', delay: 0 },
  // Noite (8pm) - Se não respondeu nada, benchmark alert
  { time: '20:00', hook: 'benchmark_alert', delay: 0 },
];
