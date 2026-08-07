export type BadgeType = 'projects_100' | 'fast_response' | 'five_stars' | 'verified_senior' | 'consistency_30';

export const BADGES: Record<BadgeType, { label: string; icon: string; description: string; color: string }> = {
  projects_100: {
    label: '100 Projetos',
    icon: '🏆',
    description: 'Completou 100 projetos',
    color: 'from-yellow-400 to-orange-500',
  },
  fast_response: {
    label: 'Responde Rápido',
    icon: '⚡',
    description: 'Responde propostas em menos de 4 horas',
    color: 'from-blue-400 to-cyan-500',
  },
  five_stars: {
    label: '5 Estrelas',
    icon: '⭐',
    description: 'Mantém rating 5.0',
    color: 'from-pink-400 to-rose-500',
  },
  verified_senior: {
    label: 'Sênior Verificado',
    icon: '✅',
    description: 'Verificado como profissional sênior',
    color: 'from-purple-400 to-indigo-500',
  },
  consistency_30: {
    label: '30 Dias Ativo',
    icon: '🔥',
    description: 'Ativo por 30 dias consecutivos',
    color: 'from-red-400 to-orange-500',
  },
};

export interface UserBadges {
  badges: BadgeType[];
  lastUpdated: Date;
}

// Calcula badges baseado em dados do usuário
export function calculateUserBadges(userData: {
  completedProjects: number;
  avgResponseTime: number; // em horas
  rating: number;
  ratingCount: number;
  isVerifiedSenior: boolean;
  consecutiveDaysActive: number;
}): BadgeType[] {
  const badges: BadgeType[] = [];

  if (userData.completedProjects >= 100) badges.push('projects_100');
  if (userData.avgResponseTime <= 4) badges.push('fast_response');
  if (userData.rating === 5 && userData.ratingCount >= 10) badges.push('five_stars');
  if (userData.isVerifiedSenior) badges.push('verified_senior');
  if (userData.consecutiveDaysActive >= 30) badges.push('consistency_30');

  return badges;
}
