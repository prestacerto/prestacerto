import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactNotificationEmail } from "@/lib/email/resend";
import { rateLimiters, getClientIP, rateLimitResponse } from "@/lib/rate-limit";
import { readJsonObject } from '@/lib/http/request-body';

export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per hour per IP
  const ip = getClientIP(request);
  const { success, reset } = await rateLimiters.contact.limit(ip);

  if (!success) {
    return rateLimitResponse(reset);
  }

  try {
    const input = await readJsonObject(request, 20000);
    if (input.response) return input.response;
    const body = input.data;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || subject.length > 200 || !message || message.length > 10000) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, subject, message });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await sendContactNotificationEmail({ name, email, subject, message });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
