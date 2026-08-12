import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@prestacerto.com.br",
      ...options,
    });

    console.log(`✅ Email sent to ${options.to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error(`❌ Email error to ${options.to}:`, error);
    throw error;
  }
}

// Email Templates
export function emailWelcome(userName: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>Bem-vindo ao PrestaCerto, ${userName}! 🎉</h2>
        <p>Sua conta foi criada com sucesso.</p>
        <p><strong>Plano Atual:</strong> Grátis (2 projetos)</p>
        <p>Upgrade para Pro ou Premium para desbloquear:</p>
        <ul>
          <li>Job Matching com IA</li>
          <li>Relatórios avançados</li>
          <li>Destaque de serviços</li>
        </ul>
        <a href="https://prestacerto.vercel.app/plans"
           style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Ver Planos
        </a>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
          Dúvidas? <a href="mailto:suporte@prestacerto.com.br">Entre em contato</a>
        </p>
      </body>
    </html>
  `;
}

export function emailSubscriptionConfirmed(userName: string, planName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>✅ Inscrição Confirmada, ${userName}!</h2>
        <p>Você agora é um usuário <strong>${planName}</strong>.</p>
        <p>Acesso liberado a:</p>
        <ul>
          <li>✨ Todos os recursos do plano</li>
          <li>🚀 Suporte prioritário</li>
          <li>📊 Relatórios em tempo real</li>
        </ul>
        <a href="https://prestacerto.vercel.app/dashboard"
           style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Ir ao Dashboard
        </a>
      </body>
    </html>
  `;
}

export function emailPaymentFailed(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>⚠️ Pagamento Recusado</h2>
        <p>Olá ${userName},</p>
        <p>Não conseguimos processar seu pagamento.</p>
        <p><strong>Motivos comuns:</strong></p>
        <ul>
          <li>Cartão expirado</li>
          <li>Saldo insuficiente</li>
          <li>Dados incorretos</li>
        </ul>
        <a href="https://prestacerto.vercel.app/billing"
           style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Atualizar Pagamento
        </a>
      </body>
    </html>
  `;
}

export function emailProjectCreated(userName: string, projectName: string, projectUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>🎯 Projeto Criado: ${projectName}</h2>
        <p>Olá ${userName},</p>
        <p>Seu novo projeto "<strong>${projectName}</strong>" está online!</p>
        <a href="${projectUrl}"
           style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Ver Projeto
        </a>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">
          💡 Dica: Destaque este projeto para receber mais propostas!
        </p>
      </body>
    </html>
  `;
}

export function emailNewProposal(userName: string, projectName: string, proposalUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>🚀 Nova Proposta para "${projectName}"</h2>
        <p>Oi ${userName}!</p>
        <p>Você recebeu uma nova proposta.</p>
        <a href="${proposalUrl}"
           style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
          Ver Proposta
        </a>
      </body>
    </html>
  `;
}

export async function notifyUserSubscription(email: string, userName: string, planName: string) {
  await sendEmail({
    to: email,
    subject: `✅ Bem-vindo ao ${planName} - PrestaCerto`,
    html: emailSubscriptionConfirmed(userName, planName),
  });
}

export async function notifyPaymentFailed(email: string, userName: string) {
  await sendEmail({
    to: email,
    subject: "⚠️ Pagamento Recusado - Ação Necessária",
    html: emailPaymentFailed(userName),
  });
}

export async function notifyNewProject(email: string, userName: string, projectName: string, projectUrl: string) {
  await sendEmail({
    to: email,
    subject: `🎯 Projeto Criado: ${projectName}`,
    html: emailProjectCreated(userName, projectName, projectUrl),
  });
}

export async function notifyNewProposal(email: string, userName: string, projectName: string, proposalUrl: string) {
  await sendEmail({
    to: email,
    subject: `🚀 Nova Proposta para "${projectName}"`,
    html: emailNewProposal(userName, projectName, proposalUrl),
  });
}
