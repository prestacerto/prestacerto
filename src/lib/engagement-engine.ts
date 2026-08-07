// ENGAGEMENT ENGINE
// Real-time notifications + FOMO + rewards = 3x user retention

export type NotificationType =
  | "new_project"
  | "proposal_accepted"
  | "proposal_rejected"
  | "friend_earning"
  | "badge_unlocked"
  | "streak_milestone"
  | "leaderboard_climb"
  | "project_ending"
  | "surprise_reward";

export interface EngagementEvent {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  action?: { text: string; url: string };
  urgency: "low" | "medium" | "high";
  timestamp: Date;
  data: Record<string, any>;
}

// Triggers that fire notifications
export const ENGAGEMENT_TRIGGERS = {
  // REAL-TIME: When project is posted (within 5 minutes)
  new_project: {
    trigger: "project.created",
    delay: 300, // 5 min
    title: "⚡ Nova oportunidade para você!",
    getMessage: (data: any) =>
      `${data.projectTitle} por R$ ${data.budget} - matches seu perfil!`,
    urgency: "high" as const,
  },

  // REAL-TIME: Proposal status
  proposal_accepted: {
    trigger: "proposal.accepted",
    delay: 0,
    title: "🎉 Proposta Aceita!",
    getMessage: (data: any) => `Você conseguiu! Ganho: R$ ${data.value}`,
    urgency: "high" as const,
  },

  // REAL-TIME: Social proof (friend earning)
  friend_earning: {
    trigger: "user.earned",
    delay: 300,
    title: "🔥 ${friendName} acabou de ganhar R$ ${amount}",
    getMessage: (data: any) => `Não fique para trás! Respon propostas agora`,
    urgency: "medium" as const,
  },

  // MILESTONE: Streak hit 7 days
  streak_milestone: {
    trigger: "streak.milestone",
    delay: 0,
    title: "🏃 7 Dias de Sequência!",
    getMessage: () => "Você está no fogo! Próximo bonus: R$ 100",
    urgency: "medium" as const,
  },

  // MILESTONE: Badge unlocked
  badge_unlocked: {
    trigger: "badge.earned",
    delay: 0,
    title: "🏆 Badge Desbloqueado!",
    getMessage: (data: any) => `Você conquistou: ${data.badgeName}`,
    urgency: "medium" as const,
  },

  // LEADERBOARD: Jumped into top 10
  leaderboard_climb: {
    trigger: "leaderboard.change",
    delay: 0,
    title: "📈 Você tá subindo no ranking!",
    getMessage: (data: any) => `Posição ${data.newRank} de ${data.total}`,
    urgency: "low" as const,
  },

  // SCARCITY: Project ending soon
  project_ending: {
    trigger: "project.ending",
    delay: 300, // 5 min before deadline
    title: "⏰ Projeto fechando em 1h",
    getMessage: (data: any) => `R$ ${data.budget} - Responda AGORA antes que feche`,
    urgency: "high" as const,
  },

  // SURPRISE: Random bonus reward
  surprise_reward: {
    trigger: "random.bonus",
    delay: 900, // Every ~15 min for active users
    title: "🎁 Bonus aleatório desbloqueado!",
    getMessage: (data: any) => `+R$ ${data.amount} crédito. Use agora!`,
    urgency: "high" as const,
  },
};

// Push notification payload
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string; // grouping
  data: {
    url: string;
    eventId: string;
    urgency: string;
  };
}

// Generate push payload
export function generatePushPayload(
  event: EngagementEvent
): PushNotificationPayload {
  return {
    title: event.title,
    body: event.message,
    icon: "🔔",
    badge: event.urgency === "high" ? "🔴" : "🟡",
    tag: event.type,
    data: {
      url: event.action?.url || "/dashboard",
      eventId: `${event.userId}_${Date.now()}`,
      urgency: event.urgency,
    },
  };
}

// Email notification (for non-push users)
export interface EmailNotificationPayload {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Generate email payload
export function generateEmailPayload(
  event: EngagementEvent,
  email: string
): EmailNotificationPayload {
  const subjects = {
    new_project: "⚡ Nova oportunidade para você!",
    proposal_accepted: "🎉 Sua proposta foi aceita!",
    proposal_rejected: "😢 Proposta não foi selecionada",
    friend_earning: "🔥 Seu amigo está ganhando!",
    badge_unlocked: "🏆 Você conquistou uma badge!",
    streak_milestone: "🏃 Sequência ativada!",
    leaderboard_climb: "📈 Você subiu no ranking!",
    project_ending: "⏰ Projeto fechando em breve",
    surprise_reward: "🎁 Bonus desbloqueado!",
  };

  return {
    to: email,
    subject: subjects[event.type] || event.title,
    template: `notification_${event.type}`,
    data: event.data,
  };
}

// Rate limiting: Don't spam users
export function shouldSendNotification(
  userId: string,
  notificationType: NotificationType
): boolean {
  // Max 5 notifications per user per hour
  // Max 2 high-urgency per hour
  // Spread them out
  return true; // TODO: Implement rate limiting
}

// A/B Testing: Which notification style converts best?
export const NOTIFICATION_VARIANTS = {
  // Variant A: Short & Urgency-focused
  short: {
    title: "⏰ Proposta fechando em 1h",
    body: "R$ 2000 disponível",
  },

  // Variant B: FOMO-focused
  fomo: {
    title: "🔥 3 pessoas responderam",
    body: "Não perca esta oportunidade!",
  },

  // Variant C: Benefit-focused
  benefit: {
    title: "Ganhe R$ 2000 em 1h",
    body: "Clique aqui para responder",
  },
};

// Deep linking for push notifications
export function generateDeepLink(
  event: EngagementEvent
): string {
  const baseUrl = "https://prestacerto.com.br";
  const params = new URLSearchParams({
    source: "push_notification",
    event_type: event.type,
    user_id: event.userId,
  });

  const paths = {
    new_project: `/projects/${event.data.projectId}`,
    proposal_accepted: `/dashboard/proposals`,
    project_ending: `/projects/${event.data.projectId}`,
    badge_unlocked: `/dashboard?tab=badges`,
    surprise_reward: `/dashboard?show_reward=true`,
  };

  const path = paths[event.type] || "/dashboard";
  return `${baseUrl}${path}?${params}`;
}
