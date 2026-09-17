import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getAuthenticatedUser as getUser } from "@/lib/auth/getUser";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
  return url && key ? createClient(url, key) : null;
}

const saveCardSchema = z.object({
  token: z.string().min(1, "Token required"),
  last_four: z.string().regex(/^\d{4}$/, "Last four must be 4 digits"),
  brand: z.enum(["Visa", "Mastercard", "Elo", "Amex"]),
  set_as_default: z.boolean().default(false),
});

type SaveCardRequest = z.infer<typeof saveCardSchema>;

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });

    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: SaveCardRequest = saveCardSchema.parse(await req.json());

    if (body.set_as_default) {
      await supabase
        .from("saved_payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data: savedCard, error } = await supabase
      .from("saved_payment_methods")
      .insert({
        user_id: user.id,
        token: body.token,
        last_four: body.last_four,
        brand: body.brand,
        is_default: body.set_as_default,
      })
      .select()
      .single();

    if (error || !savedCard) {
      console.error("Save card error:", error);
      return NextResponse.json({ error: "Failed to save card" }, { status: 500 });
    }

    await supabase.from("payment_audit_log").insert({
      event_type: "card_saved",
      user_id: user.id,
      details: { card_brand: body.brand, card_last_four: body.last_four },
    });

    return NextResponse.json({
      id: savedCard.id,
      last_four: savedCard.last_four,
      brand: savedCard.brand,
      is_default: savedCard.is_default,
      message: "Card saved successfully",
    });
  } catch (error) {
    console.error("Save card endpoint error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });

    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: cards, error } = await supabase
      .from("saved_payment_methods")
      .select("id, last_four, brand, is_default, created_at")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Get saved cards error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });

    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cardId = req.nextUrl.searchParams.get("id");
    if (!cardId) return NextResponse.json({ error: "Card ID required" }, { status: 400 });

    const { data: card } = await supabase
      .from("saved_payment_methods")
      .select("user_id")
      .eq("id", cardId)
      .single();

    if (!card || card.user_id !== user.id) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("saved_payment_methods")
      .delete()
      .eq("id", cardId);

    if (error) return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });

    await supabase.from("payment_audit_log").insert({
      event_type: "card_deleted",
      user_id: user.id,
      details: { card_id: cardId },
    });

    return NextResponse.json({ message: "Card removed successfully" });
  } catch (error) {
    console.error("Delete saved card error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
