import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("priority_queue_active, priority_queue_expires, priority_queue_tier")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { active: false, tier: null, expires_at: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      active: data.priority_queue_active || false,
      tier: data.priority_queue_tier,
      expires_at: data.priority_queue_expires,
    });
  } catch (error) {
    console.error("[PRIORITY QUEUE STATUS ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
