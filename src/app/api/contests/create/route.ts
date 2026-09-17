import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!
  );

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const { data: user } = await supabase.auth.getUser(token);

  if (!user.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, prize, category, deadline } = await req.json();
  const prestaCommission = prize * 0.3;

  const { data: contest, error } = await supabase
    .from("contests")
    .insert({
      client_id: user.user.id,
      title,
      description,
      prize,
      presta_commission: prestaCommission,
      category,
      deadline,
      status: "open",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    contest_id: contest.id,
    your_cost: prize,
    presta_takes: prestaCommission,
  });
}
