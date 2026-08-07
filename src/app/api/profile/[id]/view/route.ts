import { type NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createHash } from "node:crypto";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // Hash pra não guardar IP em texto puro (LGPD)
  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

  const db = createServiceClient();
  await db.from("profile_views").insert({
    freelancer_id: id,
    viewer_ip_hash: ipHash,
  });

  return NextResponse.json({ ok: true });
}
