import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const webpush = require("web-push");

// Configure web-push
if (process.env.VAPID_PRIVATE_KEY && process.env.VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "support@prestacerto.com.br",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(req: NextRequest) {
  try {
    // Validar autenticação de admin (usar secret key)
    const secret = req.headers.get("x-admin-secret");
    if (secret !== process.env.ADMIN_PUSH_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, title, body, data, icon } = await req.json();

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "User has no active subscriptions",
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || "/icon-192.png",
      tag: "prestacerto-notification",
      data: data || {},
    });

    let successCount = 0;
    let failedCount = 0;

    // Send push to all subscriptions
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.auth,
              p256dh: subscription.p256dh,
            },
          },
          payload
        );
        successCount++;
      } catch (error: any) {
        console.error("Error sending push:", error.message);
        failedCount++;

        // Remove dead subscriptions
        if (error.statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", subscription.endpoint);
        }
      }
    }

    // Log notification sent
    try {
      await supabase.from("notification_logs").insert({
        user_id: userId,
        title,
        body,
        type: "push",
        sent_count: successCount,
        failed_count: failedCount,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error logging notification:", err);
    }

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("[PUSH SEND ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
