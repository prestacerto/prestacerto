import { Resend } from "resend";

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "PrestaCerto <onboarding@resend.dev>";
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
