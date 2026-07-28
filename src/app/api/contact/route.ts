import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactNotificationEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name as string)?.trim();
    const email = (body.email as string)?.trim();
    const subject = (body.subject as string)?.trim();
    const message = (body.message as string)?.trim();

    if (!name || !email || !subject || !message) {
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
