import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { categoria, cidade, nivel, seuPreco } = await req.json();

    if (!categoria || !cidade || !seuPreco) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const db = createServiceClient();

    // Buscar categoria_id
    const { data: cat } = await db
      .from("categories")
      .select("id")
      .eq("slug", categoria)
      .single();

    if (!cat) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    // Buscar propostas aceitas por freelancer em uma cidade específica
    const { data: propostas } = await db
      .from("proposals")
      .select(
        "proposed_price, projects!inner(category_id, city), profiles!inner(city, state)"
      )
      .eq("status", "accepted")
      .eq("projects.category_id", cat.id)
      .gt("proposed_price", 0)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    // Filtrar por cidade (matching city name)
    const precos = (propostas ?? [])
      .filter((p) => {
        const profileCity = (p.profiles as unknown as { city: string | null })?.city;
        return profileCity?.toLowerCase().includes(cidade.toLowerCase());
      })
      .map((p) => Number(p.proposed_price))
      .filter((n) => n > 0);

    if (precos.length < 3) {
      // Sem dados suficientes, retorna placeholder
      return NextResponse.json({
        mediana: Math.round(seuPreco * 1.2),
        p25: Math.round(seuPreco * 0.8),
        p75: Math.round(seuPreco * 1.5),
        comparacao: 0,
        estaAcima: false,
        oportunidade: 0,
      });
    }

    // Calcular percentis
    const sorted = [...precos].sort((a, b) => a - b);
    const p25Idx = Math.floor(sorted.length * 0.25);
    const p75Idx = Math.floor(sorted.length * 0.75);
    const medIdx = Math.floor(sorted.length * 0.5);

    const p25 = sorted[p25Idx];
    const mediana = sorted.length % 2 === 0
      ? (sorted[medIdx - 1] + sorted[medIdx]) / 2
      : sorted[medIdx];
    const p75 = sorted[p75Idx];

    // Comparação
    const comparacao = ((seuPreco - mediana) / mediana) * 100;
    const estaAcima = seuPreco >= mediana;
    const oportunidade = estaAcima ? 0 : Math.round(mediana - 50);

    return NextResponse.json({
      mediana: Math.round(mediana),
      p25: Math.round(p25),
      p75: Math.round(p75),
      comparacao,
      estaAcima,
      oportunidade,
    });
  } catch (err) {
    console.error("Erro no benchmark:", err);
    return NextResponse.json(
      { error: "Erro ao calcular benchmark" },
      { status: 500 }
    );
  }
}
