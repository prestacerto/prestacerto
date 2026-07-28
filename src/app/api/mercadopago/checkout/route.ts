import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { createSplitPreference } from "@/lib/payments/mercadopago";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const projectId = body.projectId as string;

    const supabase = await createClient();

    const { data: project } = await supabase
      .from("projects")
      .select("id, title, client_id, status")
      .eq("id", projectId)
      .single();

    if (!project || project.client_id !== user.id) {
      return NextResponse.json(
        { error: "Você não é o dono deste projeto." },
        { status: 403 }
      );
    }

    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, freelancer_id, proposed_price")
      .eq("project_id", projectId)
      .eq("status", "accepted")
      .maybeSingle();

    if (!proposal) {
      return NextResponse.json(
        { error: "Nenhuma proposta aceita neste projeto ainda." },
        { status: 400 }
      );
    }
    if (!proposal.proposed_price) {
      return NextResponse.json(
        { error: "Essa proposta não tem um valor definido pra cobrar." },
        { status: 400 }
      );
    }

    const serviceClient = createServiceClient();

    const { data: connection } = await serviceClient
      .from("mp_connections")
      .select("access_token")
      .eq("freelancer_id", proposal.freelancer_id)
      .maybeSingle();

    if (!connection) {
      return NextResponse.json(
        { error: "O freelancer ainda não conectou uma conta Mercado Pago para receber." },
        { status: 400 }
      );
    }

    const { data: payment, error: insertError } = await serviceClient
      .from("payments")
      .upsert(
        {
          proposal_id: proposal.id,
          project_id: project.id,
          client_id: project.client_id,
          freelancer_id: proposal.freelancer_id,
          amount: proposal.proposed_price,
          status: "pending",
        },
        { onConflict: "proposal_id" }
      )
      .select("id")
      .single();

    if (insertError || !payment) {
      return NextResponse.json(
        { error: "Não foi possível iniciar o pagamento." },
        { status: 500 }
      );
    }

    const preference = await createSplitPreference({
      sellerAccessToken: connection.access_token,
      title: project.title,
      amount: proposal.proposed_price,
      externalReference: payment.id,
    });

    await serviceClient
      .from("payments")
      .update({ mp_preference_id: preference.id })
      .eq("id", payment.id);

    return NextResponse.json({ url: preference.init_point });
  } catch (err) {
    console.error("mercadopago checkout falhou:", err);
    return NextResponse.json(
      { error: "Não foi possível criar a cobrança no Mercado Pago." },
      { status: 500 }
    );
  }
}
