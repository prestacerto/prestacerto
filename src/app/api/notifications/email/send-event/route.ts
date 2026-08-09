import { NextRequest, NextResponse } from "next/server";
import { sendProjectNotification, sendWelcomeEmail } from "@/lib/email/send-notification";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface EmailEvent {
  type: "project_match" | "proposal_accepted" | "welcome" | "reward_earned" | "challenge_completed";
  userId: string;
  data?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = (await req.json()) as EmailEvent;

    // Buscar email do usuário
    const { data: profile } = await supabase
      .from("profiles")
      .select("contact_email, full_name")
      .eq("id", event.userId)
      .single();

    if (!profile?.contact_email) {
      return NextResponse.json({ error: "No email on file" }, { status: 400 });
    }

    let result;

    switch (event.type) {
      case "project_match":
        result = await sendProjectNotification(
          profile.contact_email,
          profile.full_name,
          event.data?.projectTitle || "Novo projeto",
          event.data?.projectLink || "/dashboard"
        );
        break;

      case "welcome":
        result = await sendWelcomeEmail(profile.contact_email, profile.full_name);
        break;

      case "reward_earned":
        result = await sendProjectNotification(
          profile.contact_email,
          profile.full_name,
          `Parabéns! Você ganhou R$ ${event.data?.amount}`,
          "/dashboard"
        );
        break;

      case "challenge_completed":
        result = await sendProjectNotification(
          profile.contact_email,
          profile.full_name,
          `Desafio completado! +${event.data?.xp} XP`,
          "/dashboard"
        );
        break;

      default:
        return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    // Log
    await supabase.from("email_logs").insert({
      user_id: event.userId,
      event_type: event.type,
      recipient: profile.contact_email,
      status: "sent",
      metadata: event.data,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[EMAIL EVENT ERROR]", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
