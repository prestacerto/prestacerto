import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendCaptureReminderEmail } from "@/lib/email/resend";

// Chamado 1x/dia pelo Vercel Cron (ver vercel.json). Avisa o cliente quando
// a retenção do pagamento está prestes a expirar (janela de 5 dias do
// Mercado Pago) — sem isso, um cliente que esquece de confirmar a entrega
// simplesmente perde o prazo e o freelancer não recebe.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const reminderWindowEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const { data: payments, error } = await supabase
    .from("payments")
    .select("id, client_id, amount, project_id, capture_deadline, project:projects(title)")
    .eq("status", "authorized")
    .is("reminder_sent_at", null)
    .lte("capture_deadline", reminderWindowEnd.toISOString())
    .gte("capture_deadline", now.toISOString());

  if (error) {
    console.error("payment-reminders: falha ao buscar pagamentos", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  for (const payment of payments ?? []) {
    const project = payment.project as unknown as { title: string } | null;
    const clientEmail = await getUserEmailById(payment.client_id);
    const hoursLeft = Math.max(
      1,
      Math.round(
        (new Date(payment.capture_deadline!).getTime() - now.getTime()) / (60 * 60 * 1000)
      )
    );
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

    const { sent: wasSent } = await sendCaptureReminderEmail({
      to: clientEmail,
      projectTitle: project?.title ?? "seu projeto",
      amount: payment.amount,
      projectUrl: `${siteUrl}/dashboard/projects/${payment.project_id}`,
      hoursLeft,
    });

    if (wasSent) {
      sent += 1;
      await supabase
        .from("payments")
        .update({ reminder_sent_at: now.toISOString() })
        .eq("id", payment.id);
    }
  }

  return NextResponse.json({ checked: payments?.length ?? 0, sent });
}
