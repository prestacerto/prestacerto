import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendProjectNotification(
  freelancerEmail: string,
  freelancerName: string,
  projectTitle: string,
  projectLink: string
) {
  try {
    const result = await resend.emails.send({
      from: "projetos@prestacerto.com",
      to: freelancerEmail,
      subject: `🎯 Novo projeto: ${projectTitle}`,
      html: `
        <h2>Oi ${freelancerName}!</h2>
        <p>Um novo projeto compatível com seu perfil apareceu:</p>
        <h3>${projectTitle}</h3>
        <p><a href="${projectLink}">Ver projeto →</a></p>
        <p>Aproveita, pode ser a próxima oportunidade!</p>
      `,
    });

    console.log("[EMAIL SENT]", result);
    return result;
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    return await resend.emails.send({
      from: "welcome@prestacerto.com",
      to: email,
      subject: "Bem-vindo ao PrestaCerto! 🚀",
      html: `
        <h2>Oi ${name}!</h2>
        <p>Você tá no PrestaCerto agora.</p>
        <p>Compartilha seu referral code e ganha R$ 50 cada indicação!</p>
        <p><a href="https://prestacerto.com/dashboard">Ir pro dashboard →</a></p>
      `,
    });
  } catch (error) {
    console.error("[WELCOME EMAIL ERROR]", error);
  }
}
