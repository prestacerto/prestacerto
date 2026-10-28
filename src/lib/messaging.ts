// Messaging service for sending emails and WhatsApp messages

export interface MessageTemplate {
  id: string;
  name: string;
  channel: 'email' | 'whatsapp' | 'linkedin';
  subject?: string; // for email
  body: string;
  variables: string[]; // e.g., ['{{name}}', '{{company}}']
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  options?: {
    from?: string;
    replyTo?: string;
  }
): Promise<boolean> {
  try {
    // Using SendGrid API if available
    if (process.env.SENDGRID_API_KEY) {
      const fromEmail = options?.from || process.env.SENDGRID_FROM_EMAIL;
      if (!fromEmail) throw new Error('SENDGRID_FROM_EMAIL não configurado');
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail },
          ...(options?.replyTo ? { reply_to: { email: options.replyTo } } : {}),
          subject,
          content: [{ type: 'text/html', value: body }],
          tracking_settings: {
            open_tracking: { enable: true },
            click_tracking: { enable: true },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid error ${response.status}`);
      }

      return true;
    }

    // Fallback to Resend API
    if (process.env.RESEND_API_KEY) {
      const fromAddress = options?.from || process.env.RESEND_FROM_EMAIL;
      if (!fromAddress) throw new Error('RESEND_FROM_EMAIL não configurado');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to,
          subject,
          html: body,
          replyTo: options?.replyTo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email via Resend');
      }

      return true;
    }

    console.warn('No email service configured');
    return false;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendWhatsApp(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    // Using Twilio WhatsApp API
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:${phoneNumber}`,
          Body: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Twilio error ${response.status}`);
      }

      return true;
    }

    // Alternative: GreenAPI
    if (process.env.GREENAPI_INSTANCE_ID && process.env.GREENAPI_ACCESS_TOKEN) {
      const response = await fetch(
        `https://api.green-api.com/waInstance${process.env.GREENAPI_INSTANCE_ID}/sendMessage/${process.env.GREENAPI_ACCESS_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: `${phoneNumber}@c.us`,
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp message');
      }

      return true;
    }

    console.warn('No WhatsApp service configured');
    return false;
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    return false;
  }
}

export async function sendLinkedInMessage(
  profileUrl: string,
  message: string
): Promise<boolean> {
  try {
    // LinkedIn messaging requires official API or browser automation
    // This is a placeholder - in production, use official LinkedIn API or service
    console.warn('LinkedIn messaging not yet implemented');
    return false;
  } catch (error) {
    console.error('LinkedIn messaging error:', error);
    return false;
  }
}

export function interpolateTemplate(template: string, variables: Record<string, string>): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }

  return result;
}

export function extractVariables(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = template.match(regex) || [];
  return matches.map((m) => m.replace(/[{}]/g, ''));
}

export const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'email_introduction',
    name: 'Introdução por Email',
    channel: 'email',
    subject: 'Oportunidade de Crescimento para {{company}}',
    body: `Olá {{name}},

Trabalhamos com [o que sua empresa oferece] e acredito que pode ajudar a {{company}} com [resultado principal].

Podemos conversar 15 minutos esta semana?

Atenciosamente,
[Seu nome] — [Sua empresa]`,
    variables: ['name', 'company'],
  },
  {
    id: 'whatsapp_introduction',
    name: 'Introdução por WhatsApp',
    channel: 'whatsapp',
    body: `Oi {{name}}, tudo bem?

Vi que você está na {{company}}. Trabalho com [o que sua empresa oferece] e acho que pode ajudar vocês com [resultado principal]. Faz sentido conversarmos?

[Seu nome] — [Sua empresa]`,
    variables: ['name', 'company'],
  },
  {
    id: 'email_followup',
    name: 'Follow-up 1 - Email',
    channel: 'email',
    subject: 'Re: Oportunidade para {{company}}',
    body: `Oi {{name}},

Acho que você não viu meu email anterior (sem problema!).

Queria entender se [resultado principal] é prioridade para a {{company}} agora. Qual seria o melhor dia para uma conversa rápida?

[Seu nome] — [Sua empresa]`,
    variables: ['name', 'company'],
  },
];
