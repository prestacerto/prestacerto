/**
 * POST /api/projects/create-with-options
 *
 * Cria projeto com opções de monetização:
 * - urgency: 'normal' | 'urgent' | 'critical'
 * - has_guarantee: boolean
 * - milestones: { title, amount, due_date }[]
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const URGENT_FEE = 50; // R$ 50 por projeto urgente
const CRITICAL_FEE = 100; // R$ 100 por projeto crítico
const GUARANTEE_FEE_PERCENT = 0.05; // 5% do orçamento

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      category_id,
      skills,
      budget_min,
      budget_max,
      deadline_days,
      contact_email,
      contact_phone,
      urgency = "normal",
      has_guarantee = false,
      milestones = [],
    } = await req.json();

    // Validar campos obrigatórios
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description required" },
        { status: 400 }
      );
    }

    // Calcular taxas
    let urgent_fee = 0;
    if (urgency === "urgent") urgent_fee = URGENT_FEE;
    if (urgency === "critical") urgent_fee = CRITICAL_FEE;

    let guarantee_fee = 0;
    if (has_guarantee && budget_max) {
      guarantee_fee = Math.round(budget_max * GUARANTEE_FEE_PERCENT * 100) / 100;
    }

    // Criar projeto
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: user.id,
        title,
        description,
        category_id,
        skills: skills || [],
        budget_min,
        budget_max,
        deadline_days,
        status: "open",
        urgency,
        urgent_fee,
        has_guarantee,
        guarantee_fee,
      })
      .select("id")
      .single();

    if (projectError || !project) throw projectError;

    // Criar contato do projeto
    if (contact_email || contact_phone) {
      await supabase.from("project_contacts").insert({
        project_id: project.id,
        contact_email,
        contact_phone,
      });
    }

    // Criar milestones se fornecidos
    if (milestones.length > 0) {
      interface MilestoneInput {
        title: string;
        description?: string;
        amount: number;
        due_date?: string;
      }
      const milestonesToInsert = milestones.map((m: MilestoneInput, idx: number) => ({
        project_id: project.id,
        title: m.title,
        description: m.description,
        amount: m.amount,
        order_num: idx + 1,
        due_date: m.due_date,
      }));

      await supabase.from("project_milestones").insert(milestonesToInsert);
    }

    // Registrar transações de monetização — "pending" até o pagamento real
    // ser cobrado no checkout. Nunca marcar "completed" sem cobrança de
    // verdade confirmada (senão vira receita fabricada no relatório).
    const transactions: Array<{ project_id: string; transaction_type: string; amount: number; status: string }> = [];
    if (urgent_fee > 0) {
      transactions.push({
        project_id: project.id,
        transaction_type: "urgent_fee",
        amount: urgent_fee,
        status: "pending",
      });
    }
    if (guarantee_fee > 0) {
      transactions.push({
        project_id: project.id,
        transaction_type: "guarantee_fee",
        amount: guarantee_fee,
        status: "pending",
      });
    }

    if (transactions.length > 0) {
      await supabase.from("monetization_transactions").insert(transactions);
    }

    return NextResponse.json(
      {
        project_id: project.id,
        urgent_fee,
        guarantee_fee,
        total_extra_fees: urgent_fee + guarantee_fee,
        milestones_created: milestones.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE PROJECT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
