import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import {
  calculateMatchScore,
  getAIInsights,
  ProjectData,
  FreelancerProfile,
} from "@/lib/certo-ecosystem/match-engine";

export async function POST(request: NextRequest) {
  try {
    const { projectData, freelancerProfile } = await request.json();

    if (!projectData || !freelancerProfile) {
      return NextResponse.json(
        { error: "Missing projectData or freelancerProfile" },
        { status: 400 }
      );
    }

    // Calcular match score
    const matchScore = await calculateMatchScore(
      projectData as ProjectData,
      freelancerProfile as FreelancerProfile
    );

    // Obter insights da IA
    const aiInsights = await getAIInsights(projectData, matchScore);

    // Rastrear uso (chamar hook do ecosystem)
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
      // Log usage em background (não bloqueia response)
      supabase
        .from("certo_product_usage")
        .insert({
          user_id: user.id,
          product_id: "match-product-id", // Será preenchido depois de criar produto
          action: "calculate_match",
          metadata: {
            projectTitle: projectData.title,
            matchScore: matchScore.overallScore,
          },
        })
        .catch((err) => console.error("Error logging usage:", err));
    }

    return NextResponse.json(
      {
        success: true,
        matchScore,
        aiInsights,
        message: "Match calculado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao calcular match:", error);
    return NextResponse.json(
      { error: "Erro ao calcular match", details: String(error) },
      { status: 500 }
    );
  }
}
