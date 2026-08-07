import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const bodySchema = z.object({
  full_name: z.string().min(2).max(80).optional(),
  headline: z.string().max(100).optional(),
  bio: z.string().max(600).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(2).optional(),
  avatar_url: z.string().url().optional(),
  resume_url: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);

  if (error) {
    console.error("profile PATCH falhou:", error);
    return NextResponse.json({ error: "Não foi possível salvar" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
