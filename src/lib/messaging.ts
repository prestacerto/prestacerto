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
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await sgMail.send({
        to,
        from: options?.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@prestacerto.com',
        replyTo: options?.replyTo,
        subject,
        html: body,
        trackingSettings: {
          openTracking: { enable: true },
          clickTracking: { enable: true },
        },
      });

      return true;
    }

    // Fallback to Resend API
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: options?.from || process.env.RESEND_FROM_EMAIL || 'noreply@prestacerto.com',
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
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      });

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

Percebi que {{company}} está crescendo no segmento de {{industry}}.

Temos ajudado empresas como a sua a aumentar sua geração de leads em até 40% através de nosso agente de vendas IA.

Gostaria de conversar sobre como isso poderia beneficiar sua equipe?

Melhor atenciosamente,
Equipe Prestacerto`,
    variables: ['name', 'company', 'industry'],
  },
  {
    id: 'whatsapp_introduction',
    name: 'Introdução por WhatsApp',
    channel: 'whatsapp',
    body: `Oi {{name}}, tudo bem?

Vi que você trabalha com {{company}}. Estamos ajudando empresas a automatizar sua prospecção com IA. Seria legal conversar sobre como isso pode ajudar a sua equipe?

Prestacerto 🚀`,
    variables: ['name', 'company'],
  },
  {
    id: 'email_followup',
    name: 'Follow-up 1 - Email',
    channel: 'email',
    subject: 'Re: Oportunidade para {{company}}',
    body: `Oi {{name}},

Acho que você não viu meu email anterior (sem problema!).

Deixei uma proposta que pode gerar mais leads qualificados para sua equipe. Qual seria o melhor dia para uma breve conversa?

Prestacerto`,
    variables: ['name', 'company'],
  },
];
