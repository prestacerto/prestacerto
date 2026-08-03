import { Resend } from "resend";

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "PrestaCerto <onboarding@resend.dev>";
}

function wrapEmail(bodyHtml: string, ctaHref?: string, ctaLabel?: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${bodyHtml}
      ${
        ctaHref
          ? `<p style="margin: 24px 0;">
              <a href="${ctaHref}"
                 style="background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                ${ctaLabel}
              </a>
            </p>`
          : ""
      }
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
        PrestaCerto — assinatura fixa, sem comissão.
      </p>
    </div>
  `;
}

// Notificações de eventos (nova proposta, aceite, mensagem, pagamento,
// conclusão) são best-effort: se RESEND_API_KEY não estiver configurada ou
// o envio falhar, a ação principal (aceitar proposta, mandar mensagem etc.)
// já aconteceu de qualquer forma — o e-mail é só um aviso a mais.
async function sendNotification(params: { to: string | null; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !params.to) return { sent: false as const };

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error(`sendNotification (${params.subject}) falhou:`, error);
    return { sent: false as const };
  }
  return { sent: true as const };
}

export async function sendNewProposalEmail(params: {
  to: string | null;
  projectTitle: string;
  freelancerName: string;
  projectUrl: string;
}) {
  return sendNotification({
    to: params.to,
    subject: `Nova proposta em "${params.projectTitle}"`,
    html: wrapEmail(
      `<p><strong>${params.freelancerName}</strong> enviou uma proposta pro seu projeto
      <strong>${params.projectTitle}</strong>.</p>`,
      params.projectUrl,
      "Ver proposta"
    ),
  });
}

export async function sendProposalAcceptedEmail(params: {
  to: string | null;
  projectTitle: string;
  threadUrl: string;
}) {
  return sendNotification({
    to: params.to,
    subject: `Sua proposta foi aceita — "${params.projectTitle}"`,
    html: wrapEmail(
      `<p>Boa notícia! Sua proposta pro projeto <strong>${params.projectTitle}</strong>
      foi aceita.</p>
      <p>Conecte sua conta Mercado Pago (se ainda não fez) pra poder receber o
      pagamento, e combine os detalhes pelo chat.</p>`,
      params.threadUrl,
      "Ver conversa"
    ),
  });
}

export async function sendNewMessageEmail(params: {
  to: string | null;
  senderName: string;
  projectTitle: string;
  threadUrl: string;
}) {
  return sendNotification({
    to: params.to,
    subject: `Nova mensagem de ${params.senderName}`,
    html: wrapEmail(
      `<p><strong>${params.senderName}</strong> te mandou uma mensagem sobre o projeto
      <strong>${params.projectTitle}</strong>.</p>`,
      params.threadUrl,
      "Ver mensagem"
    ),
  });
}

export async function sendPaymentApprovedEmail(params: {
  to: string | null;
  projectTitle: string;
  amount: number;
}) {
  return sendNotification({
    to: params.to,
    subject: `Pagamento aprovado — "${params.projectTitle}"`,
    html: wrapEmail(
      `<p>O pagamento de <strong>R$ ${params.amount}</strong> pelo projeto
      <strong>${params.projectTitle}</strong> foi aprovado pelo Mercado Pago e já está
      na sua conta.</p>`
    ),
  });
}

export async function sendProjectCompletedEmail(params: {
  to: string | null;
  projectTitle: string;
  reviewUrl: string;
}) {
  return sendNotification({
    to: params.to,
    subject: `Projeto concluído — "${params.projectTitle}"`,
    html: wrapEmail(
      `<p>O cliente marcou o projeto <strong>${params.projectTitle}</strong> como
      concluído. Que tal avaliar como foi a experiência?</p>`,
      params.reviewUrl,
      "Avaliar"
    ),
  });
}

// Se RESEND_API_KEY não estiver configurada, os convites continuam
// funcionando normalmente — só não enviamos e-mail automático (o link
// ainda aparece no dashboard pra copiar e mandar manualmente).
export async function sendTeamInviteEmail(params: {
  to: string;
  teamName: string;
  inviterName: string;
  inviteUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY não configurada — convite criado, mas o e-mail não foi enviado."
    );
    return { sent: false as const };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: `${params.inviterName} te convidou pra equipe ${params.teamName} na PrestaCerto`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Oi!</p>
        <p><strong>${params.inviterName}</strong> te convidou pra fazer parte da equipe
        <strong>${params.teamName}</strong> na PrestaCerto.</p>
        <p style="margin: 24px 0;">
          <a href="${params.inviteUrl}"
             style="background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Aceitar convite
          </a>
        </p>
        <p style="color: #64748b; font-size: 13px;">
          Se você não esperava este e-mail, pode ignorá-lo.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("sendTeamInviteEmail falhou:", error);
    return { sent: false as const };
  }

  return { sent: true as const };
}

// A mensagem já fica salva em contact_messages independente do e-mail sair
// ou não — isso aqui é só uma notificação, não a fonte da verdade.
export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.RESEND_CONTACT_EMAIL ?? "contato@prestacerto.com.br";
  if (!apiKey) return { sent: false as const };

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: notifyTo,
    replyTo: params.email,
    subject: `[Contato] ${params.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p><strong>${params.name}</strong> (${params.email}) mandou uma mensagem pelo site:</p>
        <p style="white-space: pre-line; border-left: 3px solid #e2e8f0; padding-left: 12px;">${params.message}</p>
      </div>
    `,
  });

  if (error) {
    console.error("sendContactNotificationEmail falhou:", error);
    return { sent: false as const };
  }

  return { sent: true as const };
}
