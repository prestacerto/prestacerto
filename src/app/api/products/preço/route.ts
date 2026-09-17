import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Pricing Engine - IA que recomenda preços otimizados
export async function POST(request: NextRequest) {
  try {
    const { projectType, complexity, timeline, marketData } = await request.json();

    if (!projectType || !complexity) {
      return NextResponse.json(
        { error: "projectType e complexity são obrigatórios" },
        { status: 400 }
      );
    }

    // Simulação de engine de preços com IA
    const basePrice = {
      "design": 1500,
      "desenvolvimento": 3000,
      "marketing": 1200,
      "consultoria": 2000,
      "design-gráfico": 800,
    }[projectType as string] || 1000;

    const complexityMultiplier = {
      "baixa": 1,
      "média": 1.5,
      "alta": 2.5,
    }[complexity as string] || 1;

    const recommendedPrice = Math.round(basePrice * complexityMultiplier);

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
          product_id: "preço-product-id",
          action: "pricing_calculation",
          metadata: {
            projectType,
            complexity,
            recommendedPrice,
          },
        })
        .catch((err) => console.error("Error logging usage:", err));
    }

    return NextResponse.json(
      {
        success: true,
        projectType,
        complexity,
        recommendedPrice,
        currency: "BRL",
        insights: {
          message: `Preço recomendado: R$ ${recommendedPrice} para ${projectType} com complexidade ${complexity}`,
          competitorRange: {
            min: Math.round(recommendedPrice * 0.8),
            max: Math.round(recommendedPrice * 1.2),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao calcular preço:", error);
    return NextResponse.json(
      { error: "Erro ao calcular preço", details: String(error) },
      { status: 500 }
    );
  }
}
