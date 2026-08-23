import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
}
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
}
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
}
);

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscription } = await req.json();
    if (!subscription) return NextResponse.json({ error: "subscription required" }, { status: 400 });

    // Salvar subscription
    await supabase.from("push_subscriptions").upsert({
      user_id: user.id,
      subscription: JSON.stringify(subscription),
      endpoint: subscription.endpoint,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUSH SUBSCRIPTION ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { endpoint } = await req.json();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUSH UNSUBSCRIBE ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
