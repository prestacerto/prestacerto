import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firebase/firestore-schema";
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

    await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), {
      name,
      email,
      subject,
      message,
      created_at: Date.now(),
    });

    await sendContactNotificationEmail({ name, email, subject, message });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
