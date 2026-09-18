import { NextRequest, NextResponse } from "next/server";
import { handleAssinifyWebhook } from "@/lib/assinify/webhook-handler";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

const ASSINIFY_WEBHOOK_SECRET = process.env.ASSINIFY_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const headerSecret = request.headers.get("x-assinify-signature");
    if (headerSecret !== ASSINIFY_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await request.json();

    if (!payload.event || !payload.data) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const result = await handleAssinifyWebhook(
      payload,
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed",
        action: "action" in result ? result.action : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "Assinify webhook endpoint is active",
      methods: ["POST"],
      docs: "https://docs.assinify.com.br/webhooks",
    },
    { status: 200 }
  );
}
