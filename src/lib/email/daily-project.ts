import { sendEmail } from './service';

export function emailDailyProject(
  projectTitle: string,
  matchScore: number,
  budget: number,
  skills: string[],
  proposalCount: number
): string {
  const urgency = proposalCount > 5 ? '🔥 URGENTE: ' : '⚡ ';

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial; color: #333; line-height: 1.6;">
        <h2>${urgency}Projeto perfeito para você!</h2>
        <p>Encontramos um projeto com <strong>${matchScore}% de compatibilidade</strong> com suas skills.</p>

        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); border-radius: 8px; padding: 20px; margin: 20px 0; color: white;">
          <h3 style="margin: 0 0 10px; font-size: 18px;">${projectTitle}</h3>
          <p style="margin: 0 0 15px; font-size: 24px; font-weight: bold;">R$ ${(budget / 100).toFixed(2).replace('.', ',')}</p>

          <div style="background: rgba(0,0,0,0.2); border-radius: 4px; padding: 10px; margin-bottom: 15px;">
            <p style="margin: 0 0 8px; font-size: 12px; opacity: 0.9;">Skills necessários:</p>
            <p style="margin: 0; font-weight: bold;">${skills.join(', ')}</p>
          </div>

          ${proposalCount > 5 ? `
            <p style="margin: 0; font-size: 12px; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 4px;">
              ⚠️ ${proposalCount} propostas já enviadas - responda nos próximos minutos!
            </p>
          ` : ''}
        </div>

        <a href="https://prestacerto.vercel.app/projects"
           style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Ver Projeto
        </a>

        <p style="margin-top: 30px; color: #999; font-size: 12px;">
          💡 Você recebe um projeto perfeito por dia. Ative notificações push para não perder nenhum!
        </p>
      </body>
    </html>
  `;
}

export async function notifyDailyProject(
  email: string,
  projectTitle: string,
  matchScore: number,
  budget: number,
  skills: string[],
  proposalCount: number
) {
  await sendEmail({
    to: email,
    subject: `⚡ Projeto do Dia: ${projectTitle} (${matchScore}% para você!)`,
    html: emailDailyProject(projectTitle, matchScore, budget, skills, proposalCount),
  });
}
