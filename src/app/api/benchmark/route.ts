import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { CATEGORIAS, CIDADES } from "@/lib/data/landing-data";
import { readJsonObject } from "@/lib/http/request-body";

const MIN_SAMPLE_SIZE = 3;

export async function POST(req: NextRequest) {
  const input = await readJsonObject(req);
  if (input.response) return input.response;
  const { categoria, cidade, seuPreco } = input.data;
  if (typeof categoria !== "string" || !Object.hasOwn(CATEGORIAS, categoria)
    || typeof cidade !== "string" || !Object.hasOwn(CIDADES, cidade)
    || typeof seuPreco !== "number" || !Number.isFinite(seuPreco) || seuPreco <= 0 || seuPreco > 99999999) {
    return NextResponse.json({ error: "Selecione uma categoria e cidade válidas e informe um preço maior que zero." }, { status: 400 });
  }

  try {
    const db = createServiceClient();
    const city = CIDADES[cidade];
    const { data: category, error: categoryError } = await db.from("categories")
      .select("id").eq("slug", categoria).maybeSingle();
    if (categoryError) throw categoryError;
    if (!category) return NextResponse.json({ available: false, sampleSize: 0, minSampleSize: MIN_SAMPLE_SIZE });

    const { data: proposals, error } = await db.from("proposals")
      .select("proposed_price, projects!inner(category_id), freelancer:profiles!proposals_freelancer_id_fkey!inner(city, state)")
      .eq("status", "accepted").eq("projects.category_id", category.id)
      .ilike("freelancer.city", city.name).ilike("freelancer.state", city.state)
      .gt("proposed_price", 0)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false }).limit(1000);
    if (error) throw error;
    const prices = (proposals ?? []).map(proposal => Number(proposal.proposed_price))
      .filter(price => Number.isFinite(price) && price > 0).sort((a, b) => a - b);
    if (prices.length < MIN_SAMPLE_SIZE) {
      return NextResponse.json({ available: false, sampleSize: prices.length, minSampleSize: MIN_SAMPLE_SIZE });
    }

    const middle = Math.floor(prices.length / 2);
    const mediana = prices.length % 2 ? prices[middle] : (prices[middle - 1] + prices[middle]) / 2;
    return NextResponse.json({
      available: true,
      sampleSize: prices.length,
      mediana,
      p25: prices[Math.floor(prices.length * 0.25)],
      p75: prices[Math.floor(prices.length * 0.75)],
      comparacao: ((seuPreco - mediana) / mediana) * 100,
    });
  } catch (error) {
    console.error("Erro no benchmark:", error);
    return NextResponse.json({ error: "Não foi possível consultar as referências agora. Seus dados foram preservados; tente novamente." }, { status: 503 });
  }
}
