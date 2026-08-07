import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Validar CNPJ usando API pública da Receita Federal (via mCidade)
// Alternativa: usar https://brasilapi.com.br/docs (free, sem autenticação)

async function validateCNPJViaAPI(cnpj: string) {
  try {
    // Usar Brasil API (gratuita, sem rate limit agressivo)
    const response = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      cnpj: data.cnpj,
      company_name: data.nome_fantasia || data.razao_social,
      status: data.descricao_situacao_cadastral,
      founded_at: data.data_abertura,
      activity: data.descricao_atividade_principal,
    };
  } catch (error) {
    console.error("Erro ao validar CNPJ:", error);
    return null;
  }
}

function validateCNPJFormat(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Calcular primeiro dígito verificador
  let sum = 0;
  let factor = 5;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cnpj[i]) * factor;
    factor--;
  }
  sum += 2 * parseInt(cnpj[8]);
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;

  // Calcular segundo dígito verificador
  sum = 0;
  factor = 9;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cnpj[i]) * factor;
    factor--;
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;

  return (
    parseInt(cnpj[10]) === firstDigit && parseInt(cnpj[11]) === secondDigit
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { cnpj } = await request.json();

    if (!cnpj || typeof cnpj !== "string") {
      return NextResponse.json(
        { error: "CNPJ inválido" },
        { status: 400 }
      );
    }

    const cleanCNPJ = cnpj.replace(/\D/g, "");

    // Validar formato
    if (!validateCNPJFormat(cleanCNPJ)) {
      return NextResponse.json(
        { error: "CNPJ inválido — verifique o formato" },
        { status: 400 }
      );
    }

    // Validar via API
    const companyData = await validateCNPJViaAPI(cleanCNPJ);

    if (!companyData) {
      return NextResponse.json(
        { error: "CNPJ não encontrado na Receita Federal" },
        { status: 404 }
      );
    }

    // Verificar se já está verificado
    const { data: existing } = await supabase
      .from("company_verifications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "Sua empresa já está verificada",
          company_name: existing.company_name,
        },
        { status: 400 }
      );
    }

    // Armazenar verificação (pendente de pagamento)
    await supabase
      .from("company_verifications")
      .insert({
        user_id: user.id,
        cnpj: cleanCNPJ,
        company_name: companyData.company_name,
        status: "pending_payment",
        metadata: companyData,
      });

    return NextResponse.json({
      success: true,
      company_name: companyData.company_name,
      cnpj: cleanCNPJ,
      founded_at: companyData.founded_at,
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json(
      { error: "Erro ao validar CNPJ" },
      { status: 500 }
    );
  }
}
