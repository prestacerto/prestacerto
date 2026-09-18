import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
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
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Buscar subscription do usuário para este produto
    const { data, error } = await supabase
      .from("certo_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { subscription: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscription: {
        productId: data.product_id,
        plan: data.plan,
        status: data.status,
        startDate: data.start_date,
        renewalDate: data.renewal_date,
        subscriptionId: data.subscription_id,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar subscription:", error);
    return NextResponse.json(
      { error: "Erro ao buscar subscription" },
      { status: 500 }
    );
  }
}

// Webhook para processar eventos de pagamento do Assiny
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  try {
    const payload = await request.json();
    const authHeader = request.headers.get("x-assiny-signature");

    // Validar webhook token (simplificado - implementar validação real com HMAC)
    if (!authHeader) {
      return NextResponse.json(
        { error: "Assinatura inválida" },
        { status: 401 }
      );
    }

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    });

    // Processar evento de pagamento
    const { email, event, subscriptionId, plan, active } = payload;

    // Buscar usuário pelo email
    const { data: authUser, error: userError } = await supabase.auth.admin.listUsers();
    const matchedUser = authUser?.users.find((u) => u.email?.toLowerCase() === String(email).toLowerCase());

    if (userError || !matchedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = matchedUser.id;
    const status = active ? "active" : "cancelled";

    // Atualizar ou criar subscription
    const { error: upsertError } = await supabase
      .from("certo_subscriptions")
      .upsert(
        {
          user_id: userId,
          product_id: productId,
          plan: plan === "monthly" ? "monthly" : "one-time",
          status,
          subscription_id: subscriptionId,
          start_date: new Date().toISOString(),
          renewal_date: plan === "monthly"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        },
        {
          onConflict: "user_id,product_id",
        }
      );

    if (upsertError) throw upsertError;

    // Log do evento
    await supabase
      .from("certo_payment_events")
      .insert({
        user_id: userId,
        product_id: productId,
        event_type: event,
        subscription_id: subscriptionId,
        payload: payload,
      })
      .then(({ error }) => { if (error) console.error("Error logging payment event:", error); });

    return NextResponse.json({
      success: true,
      message: "Subscription atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
