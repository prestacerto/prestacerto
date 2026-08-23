import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const webpush = require("web-push");

if (process.env.VAPID_PRIVATE_KEY && process.env.VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_EMAIL || "support@prestacerto.com.br",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    const { recipientId, senderName, proposalId, messagePreview } = await request.json();

    if (!recipientId || !senderName || !proposalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get recipient's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", recipientId);

    if (error || !subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No subscriptions found",
      });
    }

    const payload = JSON.stringify({
      title: "Nova Mensagem 💬",
      body: `${senderName}: ${messagePreview?.substring(0, 50) || "Enviou uma mensagem"}...`,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "message-notification",
      data: {
        url: `/dashboard/proposals/${proposalId}`,
        type: "message",
      },
    });

    let successCount = 0;
    let failedCount = 0;

    // Send to all subscriptions
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
        console.error("[MESSAGE NOTIFICATION] Send error:", error.message);
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

    // Log notification
    await supabase.from("notification_logs").insert({
      user_id: recipientId,
      type: "message",
      title: "Nova Mensagem",
      body: `${senderName} enviou uma mensagem`,
      sent_count: successCount,
      failed_count: failedCount,
    });

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("[MESSAGE NOTIFICATION] Error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
