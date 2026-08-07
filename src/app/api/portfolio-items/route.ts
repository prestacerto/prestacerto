import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const bodySchema = z.object({
  imageUrl: z.string().url(),
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  categoryId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      freelancer_id: user.id,
      image_url: parsed.data.imageUrl,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category_id: parsed.data.categoryId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("portfolio-items insert falhou:", error);
    return NextResponse.json({ error: "Não foi possível salvar o item" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
