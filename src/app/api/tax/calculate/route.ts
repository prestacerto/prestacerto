import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { calculateTaxBreakdown } from "@/lib/tax/calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { grossIncome, workType = "freelancer_other", otherDeductions = 0 } =
      body;

    if (!grossIncome || grossIncome <= 0) {
      return NextResponse.json(
        { error: "grossIncome deve ser maior que 0" },
        { status: 400 }
      );
    }

    // Calcular imposto
    const breakdown = calculateTaxBreakdown(
      grossIncome,
      workType,
      otherDeductions
    );

    return NextResponse.json(
      {
        success: true,
        breakdown,
        message: "Imposto calculado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao calcular imposto:", error);
    return NextResponse.json(
      { error: "Erro ao calcular imposto" },
      { status: 500 }
    );
  }
}

// GET pra puxar histórico de cálculos do usuário
export async function GET(request: NextRequest) {
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Puxar últimos 12 meses de cálculos
    const { data: calculations, error } = await supabase
      .from("tax_calculations")
      .select("*")
      .eq("user_id", user.id)
      .order("month", { ascending: false })
      .limit(12);

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        calculations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar cálculos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cálculos" },
      { status: 500 }
    );
  }
}
