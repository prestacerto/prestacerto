import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const { subscription } = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get authenticated user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save subscription to database
    await supabase.from("push_subscriptions").insert({
      user_id: user.id,
      endpoint: subscription.endpoint,
      auth: subscription.keys?.auth,
      p256dh: subscription.keys?.p256dh,
      user_agent: req.headers.get("user-agent"),
      device_info: {
        timestamp: new Date().toISOString(),
      },
    }).then(({ error }) => {
      if (error) {
        console.error("Error saving subscription:", error);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUSH SUBSCRIBE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
