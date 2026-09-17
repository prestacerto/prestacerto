import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br").replace(/\/$/, "");

export const sendCertoAIWelcomeEmail = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: 'noreply@prestacerto.com.br',
      to: email,
      subject: '🎉 Bem-vindo ao Certo AI! Suas 3 otimizações grátis estão prontas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Bem-vindo ao Certo AI, ${name}! 🎉</h1>

          <p>Você tem <strong>3 otimizações GRÁTIS</strong> este mês.</p>

          <h2>Como funciona:</h2>
          <ol>
            <li>Cole sua proposta ruim: "Oi, posso fazer seu site?"</li>
            <li>Clique em "Otimizar com IA"</li>
            <li>Veja sua proposta MELHORADA com score de qualidade</li>
            <li>Copie e envie pro cliente</li>
            <li>Ganhe mais projetos! 🚀</li>
          </ol>

          <a href="${siteUrl}/dashboard/certo-ai"
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Começar Agora
          </a>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="color: #6b7280; font-size: 12px;">
            Revise cada sugestão antes de enviar sua proposta.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
  }
};

export const sendCertoAIOptimizationSuccess = async (
  email: string,
  name: string,
  oldScore: number,
  newScore: number
) => {
  try {
    const improvement = newScore - oldScore;
    await resend.emails.send({
      from: 'noreply@prestacerto.com.br',
      to: email,
      subject: `🚀 Sua proposta subiu de ${oldScore} → ${newScore} pontos!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Que melhora! 🎯</h1>

          <p>Sua proposta foi otimizada com sucesso!</p>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-size: 14px; color: #666;">Score anterior</p>
            <p style="margin: 5px 0 15px 0; font-size: 24px; font-weight: bold; color: #22c55e;">${oldScore}/100</p>

            <p style="margin: 0; font-size: 14px; color: #666;">Score novo</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #22c55e;">${newScore}/100</p>

            <p style="margin: 15px 0 0 0; font-size: 16px; font-weight: bold; color: #22c55e;">
              +${improvement} pontos! 🔥
            </p>
          </div>

          <p>Agora copie sua proposta otimizada e envie pro cliente!</p>
          <p>Use a sugestão como ponto de partida e ajuste a proposta ao contexto do cliente.</p>

          <a href="${siteUrl}/dashboard/certo-ai"
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Ver Proposta Otimizada
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar email de sucesso:', error);
  }
};

export const sendUpgradePrompt = async (email: string, name: string) => {
  try {
    await resend.emails.send({
      from: 'noreply@prestacerto.com.br',
      to: email,
      subject: '⚡ Upgrade Certo AI: Ilimitadas por R$ 19,90/mês',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Acabaram suas 3 otimizações grátis, ${name}! 😅</h1>

          <p>Você esgotou suas otimizações do plano grátis este mês.</p>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #d97706;">💡 MAS ESPERA!</p>
            <p style="margin: 10px 0 0 0; color: #b45309;">
              Upgrade para Premium e tenha <strong>ILIMITADAS</strong> por apenas R$ 19,90/mês!
            </p>
          </div>

          <h2>Comparação:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Grátis</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">3/mês</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Premium ⭐</td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Ilimitadas</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">
            Você já testou. Viu o resultado. Agora é hora de escalar! 🚀
          </p>

          <a href="${siteUrl}/dashboard/certo-ai"
             style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Upgrade para Premium
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar email de upgrade:', error);
  }
};

export const sendCertoAILaunchEmail = async (emails: string[]) => {
  try {
    for (const email of emails) {
      await resend.emails.send({
        from: 'noreply@prestacerto.com.br',
        to: email,
        subject: '🎉 Certo AI está aqui! Otimize suas propostas com IA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Apresentamos: Certo AI 🤖✨</h1>

            <p>O Certo AI ajuda você a organizar a proposta antes de enviar.</p>

            <h2>Certo AI faz exatamente isso:</h2>
            <ul>
              <li>✨ Reescreve sua proposta automaticamente</li>
              <li>📊 Dá um score de 0-100 de qualidade</li>
              <li>💡 Sugere melhorias específicas</li>
              <li>🚀 Mantém você no controle antes do envio</li>
            </ul>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;">Teste GRÁTIS</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold;">3 Otimizações</p>
            </div>

            <p style="color: #666; font-size: 14px;">
              Depois, se gostar (e você vai gostar), é só R$ 19,90/mês para ilimitadas.
            </p>

            <a href="${siteUrl}/certo-ai"
               style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
              Experimentar Certo AI
            </a>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

            <p style="color: #6b7280; font-size: 12px;">
              P.S. — Você recebeu este email porque é freelancer na PrestaCerto.
              Se não quer receber mais, deixa quieto que não incomodamos mais. 😄
            </p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Erro ao enviar email de launch:', error);
  }
};
