/**
 * GET /api/projects/urgent
 *
 * Retorna projetos urgentes/críticos (prioritários)
 * Ordenados por: crítico > urgente, depois por data
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    let query = supabase
      .from("projects")
      .select(
        `
        id,
        title,
        description,
        budget_min,
        budget_max,
        deadline_days,
        urgency,
        urgent_fee,
        has_guarantee,
        guarantee_fee,
        created_at,
        categories(name)
      `
      )
      .eq("status", "open")
      .in("urgency", ["urgent", "critical"])
      .order("urgency", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq("category_id", category);
    }

    const { data: projects, error } = await query;

    if (error) throw error;

    // Formatar resposta
    const formatted = projects.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description.substring(0, 200) + "...",
      budget_min: p.budget_min,
      budget_max: p.budget_max,
      deadline_days: p.deadline_days,
      category: p.categories?.name,
      urgency: p.urgency,
      extra_fees: {
        urgent_fee: p.urgent_fee,
        guarantee_fee: p.guarantee_fee,
        total: p.urgent_fee + p.guarantee_fee,
      },
      badge: p.urgency === "critical" ? "🚨 CRÍTICO" : "⚡ URGENTE",
      created_at: p.created_at,
    }));

    return NextResponse.json(
      {
        total: formatted.length,
        projects: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[URGENT PROJECTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch urgent projects" },
      { status: 500 }
    );
  }
}
