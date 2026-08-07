// Email notification templates & sending

export interface EmailNotification {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const EMAIL_TEMPLATES = {
  welcome: {
    subject: "Bem-vindo ao PrestaCerto! 🎉",
    template: "welcome",
  },
  proposal_received: {
    subject: "Nova proposta recebida! 💰",
    template: "proposal_received",
  },
  proposal_accepted: {
    subject: "Parabéns! Sua proposta foi aceita! 🎉",
    template: "proposal_accepted",
  },
  payment_received: {
    subject: "Pagamento recebido! Presta ativada ✅",
    template: "payment_received",
  },
  tip_high_earner: {
    subject: "Você pode ganhar R$ 500+ esse mês - veja como",
    template: "tip_high_earner",
  },
  daily_digest: {
    subject: "Seu resumo diário - {proposalsCount} oportunidades",
    template: "daily_digest",
  },
  promotion_seasonal: {
    subject: "30% OFF em Premium - Oferta limitada! ⚡",
    template: "promotion_seasonal",
  },
};

export async function sendEmail(notification: EmailNotification) {
  try {
    // TODO: Integrar com Resend, SendGrid, ou AWS SES
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      console.error("Email send failed:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Specific email triggers

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.welcome.subject,
    template: EMAIL_TEMPLATES.welcome.template,
    data: { name },
  });
}

export async function sendProposalAcceptedEmail(
  email: string,
  projectTitle: string,
  amount: number
) {
  return sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.proposal_accepted.subject,
    template: EMAIL_TEMPLATES.proposal_accepted.template,
    data: { projectTitle, amount },
  });
}

export async function sendPaymentReceivedEmail(
  email: string,
  planName: string,
  amount: number
) {
  return sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.payment_received.subject,
    template: EMAIL_TEMPLATES.payment_received.template,
    data: { planName, amount },
  });
}

export async function sendDailyDigestEmail(
  email: string,
  proposalsCount: number,
  estimatedEarnings: number
) {
  return sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.daily_digest.subject.replace(
      "{proposalsCount}",
      proposalsCount.toString()
    ),
    template: EMAIL_TEMPLATES.daily_digest.template,
    data: { proposalsCount, estimatedEarnings },
  });
}

export async function sendPromotionalEmail(
  email: string,
  discountPercent: number
) {
  return sendEmail({
    to: email,
    subject: EMAIL_TEMPLATES.promotion_seasonal.subject,
    template: EMAIL_TEMPLATES.promotion_seasonal.template,
    data: { discountPercent },
  });
}
