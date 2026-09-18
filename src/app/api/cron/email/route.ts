import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getPendingEmails,
  markEmailAsSent,
  markEmailAsFailed,
} from "@/lib/email/queue";
import { getEmailTemplate } from "@/lib/email/templates";

let resendClient: Resend | null = null;
const getResend = () => (resendClient ??= new Resend(process.env.RESEND_API_KEY));

// Proteger rota com token secreto (Vercel Cron)
function validateRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return false;
  }

  return true;
}

export async function POST(req: NextRequest) {
  // Validar que é uma requisição do Vercel Cron
  if (!validateRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Pegar e-mails pendentes
    const pendingEmails = await getPendingEmails();

    if (pendingEmails.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No pending emails",
      });
    }

    let sent = 0;
    let failed = 0;

    // Enviar cada e-mail
    for (const entry of pendingEmails) {
      try {
        const template = getEmailTemplate(entry.sequence, entry.step);

        const result = await getResend().emails.send({
          from: "PrestaCerto <noreply@prestacerto.com.br>",
          to: entry.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        if (result.error) {
          console.error(`Failed to send email ${entry.id}:`, result.error);
          await markEmailAsFailed(entry.id);
          failed++;
        } else {
          await markEmailAsSent(entry.id);
          sent++;
        }
      } catch (error) {
        console.error(`Error processing email ${entry.id}:`, error);
        await markEmailAsFailed(entry.id);
        failed++;
      }

      // Evitar rate limit do Resend
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: pendingEmails.length,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    );
  }
}
