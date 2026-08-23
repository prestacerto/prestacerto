import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { email, name, source } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed", already_subscribed: true },
        { status: 200 }
      );
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      name: name || "Subscriber",
      source: source || "website",
      subscribed_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    await supabase.from("lead_events").insert({
      email,
      event_type: "newsletter_signup",
      source: source || "website",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "✓ Inscrição realizada! Você receberá atualizações sobre novos carros em breve.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NEWSLETTER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
