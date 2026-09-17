// Email notification service
// Sends personalized daily digests to keep users engaged

export type EmailTemplate =
  | "daily-digest"
  | "opportunity-alert"
  | "proposal-update"
  | "streak-reminder"
  | "leaderboard-update";

export interface EmailPayload {
  userId: string;
  email: string;
  template: EmailTemplate;
  data: Record<string, any>;
  sendAt?: Date;
}

interface DailyDigestData {
  openProjects: number;
  opportunities: {
    id: string;
    title: string;
    budget: number;
    category: string;
  }[];
  stats: {
    proposalsSent: number;
    acceptanceRate: number;
    earnings: number;
  };
  leaderboardPosition?: number;
  nextStreakMilestone?: number;
}

interface OpportunityAlertData {
  projectId: string;
  title: string;
  budget: number;
  description: string;
  category: string;
  matchScore: number; // 0-100
}

interface ProposalUpdateData {
  proposalId: string;
  projectTitle: string;
  status: "viewed" | "accepted" | "rejected" | "in_review";
  viewedAt?: Date;
}

interface StreakReminderData {
  currentStreak: number;
  targetStreak: number;
  timeUntilReset: string;
  bonus: string;
}

interface LeaderboardUpdateData {
  position: number;
  totalReferrals: number;
  bonus: string;
  nextMilestone: number;
}

// Email templates com variáveis
export const EMAIL_TEMPLATES: Record<EmailTemplate, {
  subject: (data: any) => string;
  preview: (data: any) => string;
  template: string;
}> = {
  "daily-digest": {
    subject: (data: DailyDigestData) =>
      `📊 Seu resumo de hoje: ${data.openProjects} oportunidades disponíveis`,
    preview: (data: DailyDigestData) =>
      `Você recebeu ${data.opportunities.length} novas oportunidades hoje. Taxa de aceitação: ${data.stats.acceptanceRate}%`,
    template: `
      <h2>Bom dia! 👋</h2>
      <p>Aqui está seu resumo de oportunidades de hoje:</p>

      <h3>Oportunidades Disponíveis: {{openProjects}}</h3>
      {{#opportunities}}
      <div style="border-left: 3px solid #2563eb; padding: 12px; margin: 8px 0;">
        <strong>{{title}}</strong><br/>
        R$ {{budget}} • {{category}}<br/>
        <a href="https://prestacerto.com.br/projects/{{id}}">Ver projeto →</a>
      </div>
      {{/opportunities}}

      <h3>Seu Desempenho</h3>
      <ul>
        <li>Propostas enviadas: {{stats.proposalsSent}}</li>
        <li>Taxa de aceitação: {{stats.acceptanceRate}}%</li>
        <li>Ganhos este mês: R$ {{stats.earnings}}</li>
        {{#leaderboardPosition}}<li>🏆 Posição no ranking: #{{leaderboardPosition}}</li>{{/leaderboardPosition}}
      </ul>

      {{#nextStreakMilestone}}
      <p><strong>Faltam {{nextStreakMilestone}} dias para ganhar seu próximo badge! 🎯</strong></p>
      {{/nextStreakMilestone}}
    `
  },

  "opportunity-alert": {
    subject: (data: OpportunityAlertData) =>
      `🎯 Nova oportunidade perfeita para você: ${data.title}`,
    preview: (data: OpportunityAlertData) =>
      `Encontramos um projeto que pode ser ideal (${data.matchScore}% de compatibilidade)`,
    template: `
      <h2>Encontramos uma oportunidade perfeita! 🎯</h2>
      <p>Compatibilidade com seu perfil: <strong>{{matchScore}}%</strong></p>

      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3>{{title}}</h3>
        <p>Orçamento: <strong>R$ {{budget}}</strong></p>
        <p>Categoria: {{category}}</p>
        <p>{{description}}</p>
        <a href="https://prestacerto.com.br/projects/{{projectId}}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Enviar Proposta
        </a>
      </div>
    `
  },

  "proposal-update": {
    subject: (data: ProposalUpdateData) =>
      `Sua proposta para "${data.projectTitle}" foi {{status}}!`,
    preview: (data: ProposalUpdateData) =>
      `Status atualizado: ${data.status}`,
    template: `
      <h2>Atualização de Proposta 📬</h2>
      <p>Projeto: <strong>{{projectTitle}}</strong></p>
      <p>Status: <strong>{{status}}</strong></p>
      {{#viewedAt}}<p>Visualizado em: {{viewedAt}}</p>{{/viewedAt}}

      <a href="https://prestacerto.com.br/dashboard/proposals">Ver suas propostas →</a>
    `
  },

  "streak-reminder": {
    subject: (data: StreakReminderData) =>
      `🔥 Você está em uma sequência de ${data.currentStreak} dias!`,
    preview: (data: StreakReminderData) =>
      `Continue assim para ganhar ${data.bonus}!`,
    template: `
      <h2>Você está em sequência! 🔥</h2>
      <p><strong>{{currentStreak}}</strong> dias respondendo propostas</p>
      <p>Faltam <strong>{{targetStreak}}</strong> dias para ganhar: <strong>{{bonus}}</strong></p>
      <p>Tempo até reset: {{timeUntilReset}}</p>

      <a href="https://prestacerto.com.br/projects">Ver novas oportunidades →</a>
    `
  },

  "leaderboard-update": {
    subject: (data: LeaderboardUpdateData) =>
      `🏆 Você está em #${data.position} no ranking de indicações!`,
    preview: (data: LeaderboardUpdateData) =>
      `${data.totalReferrals} indicações - Próxima meta: ${data.nextMilestone}`,
    template: `
      <h2>Você está no Ranking! 🏆</h2>
      <p>Posição: <strong>#{{position}}</strong></p>
      <p>Total de indicações: <strong>{{totalReferrals}}</strong></p>
      <p>Bônus atual: <strong>{{bonus}}</strong></p>
      <p>Próxima meta: {{nextMilestone}} indicações</p>

      <a href="https://prestacerto.com.br/dashboard?tab=referral">Ver seu dashboard →</a>
    `
  }
};

// Schedule notifications
export const NOTIFICATION_SCHEDULE = [
  { hour: 9, template: "daily-digest" as EmailTemplate },
  { hour: 14, template: "opportunity-alert" as EmailTemplate },
  { hour: 17, template: "streak-reminder" as EmailTemplate },
  { hour: 20, template: "leaderboard-update" as EmailTemplate },
];

// Send email via Resend/SendGrid/etc
export async function sendEmail(payload: EmailPayload) {
  try {
    const tmpl = EMAIL_TEMPLATES[payload.template];
    const subject = tmpl.subject(payload.data);

    // TODO: Integrate with email service (Resend, SendGrid)
    // For now, log the notification
    console.log(`[EMAIL] To: ${payload.email}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    console.log(`[EMAIL] Template: ${payload.template}`);

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      email: payload.email,
    };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

// Queue notifications for later delivery
export async function queueNotification(payload: EmailPayload) {
  // TODO: Use job queue (Bull, Inngest, etc)
  const scheduledTime = payload.sendAt || new Date();
  console.log(`[QUEUE] Notification scheduled for ${scheduledTime.toISOString()}`);
}
