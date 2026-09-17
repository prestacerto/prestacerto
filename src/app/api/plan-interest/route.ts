import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimiters.leads.limit(getClientIP(request));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request, 8192);
    if (input.response) return input.response;
    const body = input.data;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const plan = body.plan as string;

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("plan_interest_leads").insert({ email, plan });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save interest" }, { status: 500 });
  }
}
