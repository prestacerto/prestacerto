import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Timing Recomendações - IA que recomenda melhor momento para lançar/publicar
export async function POST(request: NextRequest) {
  try {
    const { projectType, targetAudience, competitorActivity } = await request.json();

    if (!projectType || !targetAudience) {
      return NextResponse.json(
        { error: "projectType e targetAudience são obrigatórios" },
        { status: 400 }
      );
    }

    // Simulação de análise de timing
    const dayOfWeekScores = {
      Monday: 0.85,
      Tuesday: 0.90,
      Wednesday: 0.88,
      Thursday: 0.82,
      Friday: 0.75,
      Saturday: 0.65,
      Sunday: 0.60,
    };

    const hourScores = {
      morning: 0.80,
      afternoon: 0.75,
      evening: 0.90,
      night: 0.70,
    };

    const bestDay = Object.entries(dayOfWeekScores).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    const bestHour = Object.entries(hourScores).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    // Rastrear uso
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      supabase
        .from("certo_product_usage")
        .insert({
          user_id: user.id,
          product_id: "timing-product-id",
          action: "timing_analysis",
          metadata: {
            projectType,
            targetAudience,
            recommendedDay: bestDay,
            recommendedHour: bestHour,
          },
        })
        .then(({ error }) => { if (error) console.error("Error logging usage:", error); });
    }

    return NextResponse.json(
      {
        success: true,
        projectType,
        targetAudience,
        recommendation: {
          bestDay,
          bestHour,
          confidence: 0.87,
          nextWindowDays: 3,
        },
        analysis: {
          dayOfWeekScores,
          hourScores,
          competitorActivityLevel: competitorActivity || "medium",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao analisar timing:", error);
    return NextResponse.json(
      { error: "Erro ao analisar timing", details: String(error) },
      { status: 500 }
    );
  }
}
