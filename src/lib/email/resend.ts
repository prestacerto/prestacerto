import { Resend } from "resend";

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
  const from = process.env.RESEND_FROM_EMAIL ?? "PrestaCerto <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
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
