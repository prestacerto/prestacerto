import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';

export async function POST(req: NextRequest) {
  try {
    const { email, skill, experience, hourlyRate, monthlyRate, projectRate } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial; color: #333; line-height: 1.6;">
          <h2>📊 Seus Resultados da Calculadora de Precificação</h2>

          <div style="background: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p><strong>Especialidade:</strong> ${skill}</p>
            <p><strong>Experiência:</strong> ${experience}</p>
          </div>

          <h3 style="color: #667eea;">Valores Recomendados:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Por Hora:</strong> R$ ${hourlyRate}
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Mensal (160h):</strong> R$ ${monthlyRate.toLocaleString('pt-BR')}
            </li>
            <li style="padding: 10px 0;">
              <strong>Por Projeto:</strong> R$ ${projectRate.toLocaleString('pt-BR')}
            </li>
          </ul>

          <p style="margin-top: 30px; color: #999; font-size: 12px;">
            💡 Use esses valores como referência no PrestaCerto!
          </p>
        </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: '📊 Seus Valores de Precificação - PrestaCerto',
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
