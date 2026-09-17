import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      category,
      commissionRate,
      commissionModel,
      description,
      websiteUrl,
      contactEmail,
    } = await req.json();

    const db = createServiceClient();

    // Validar dados
    if (!name || !category || !commissionRate || !commissionModel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Inserir partner (status: pending até aprovação manual)
    const { data, error } = await db
      .from("partners")
      .insert({
        name,
        category,
        commission_rate: commissionRate,
        commission_model: commissionModel,
        description,
        website_url: websiteUrl,
        contact_email: contactEmail,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        partnerId: data.id,
        message:
          "Partner application submitted. We will review and approve soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
