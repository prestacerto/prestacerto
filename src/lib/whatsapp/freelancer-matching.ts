import { createClient } from "@supabase/supabase-js";
import { ScopeAnalysis } from "./ai-scope-analyzer";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export interface FreelancerMatch {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  rating: number | null;
  rating_count: number;
  profile_slug: string;
}

/**
 * Buscar top 3 freelancers compatíveis com escopo
 * Leva em conta: categoria, habilidades, rating, disponibilidade
 */
export async function findCompatibleFreelancers(
  scope: ScopeAnalysis
): Promise<FreelancerMatch[]> {
  try {
    const supabase = getSupabaseClient();
    // Buscar por categoria (se encontrar categoria no sistema)
    // Por enquanto, busca generalista e ordena por rating
    // TODO: Implementar busca por habilidades do scope.skills[]

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        avatar_url,
        bio,
        rating,
        rating_count
      `
      )
      .in("role", ["freelancer", "both"])
      .not("rating", "is", null) // Prioriza quem tem rating
      .order("rating", { ascending: false })
      .order("rating_count", { ascending: false }) // Desempate: mais reviews
      .limit(3);

    if (error) throw error;

    return (data || []).map((f) => ({
      id: f.id,
      full_name: f.full_name,
      avatar_url: f.avatar_url,
      bio: f.bio,
      rating: f.rating,
      rating_count: f.rating_count,
      profile_slug: f.id, // Usar ID como slug por enquanto
    }));
  } catch (error) {
    console.error("Freelancer matching error:", error);
    return [];
  }
}

/**
 * Formatar resposta de freelancers pra WhatsApp
 * IMPORTANTE: Nunca revela número pessoal. Retorna links pra plataforma apenas.
 * Todo negócio (proposta, contrato, pagamento) acontece 100% na plataforma.
 * Links usam redirect endpoint que valida acesso baseado na conversa.
 */
export function formatFreelancerResponse(
  freelancers: FreelancerMatch[],
  scope: ScopeAnalysis,
  prestagercoDomain: string = "prestacerto.com",
  conversationId?: string
): string {
  if (freelancers.length === 0) {
    return (
      "Não encontrei freelancers com esse perfil disponíveis agora.\n\n" +
      "Mas você pode:\n" +
      "• Publicar um projeto aberto\n" +
      "• Receber propostas de múltiplos freelancers\n" +
      "• Escolher o melhor custo-benefício\n\n" +
      "Quer que a gente crie esse projeto pra você na plataforma agora?"
    );
  }

  let response = `✅ Encontrei ${freelancers.length} especialista${freelancers.length > 1 ? "s" : ""} compatível${freelancers.length > 1 ? "s" : ""}:\n\n`;

  freelancers.forEach((f, i) => {
    response += `${i + 1}. *${f.full_name}*\n`;

    if (f.rating && f.rating_count) {
      response += `   ⭐ ${f.rating.toFixed(1)}/5.0 (${f.rating_count} projeto${f.rating_count > 1 ? "s" : ""})\n`;
    } else {
      response += `   ⭐ Freelancer novo (sem avaliações ainda)\n`;
    }

    if (f.bio) {
      const bio = f.bio.length > 50 ? f.bio.substring(0, 50) + "…" : f.bio;
      response += `   "${bio}"\n`;
    }

    // Link seguro com validação de conversa
    const profileLink = conversationId
      ? `${prestagercoDomain}/api/whatsapp/redirect-profile?conversation_id=${conversationId}&freelancer_id=${f.profile_slug}`
      : `${prestagercoDomain}/profile/${f.profile_slug}`;

    response += `   👉 ${profileLink}\n\n`;
  });

  response += "*Clique no link acima pra ver o perfil completo e mandar uma proposta.*\n\n";
  response +=
    "Tudo é seguro: pagamento, contrato e proteção estão garantidos na plataforma. " +
    "Nenhum dado pessoal é compartilhado até você aceitar a proposta.";

  return response;
}

/**
 * Notificar freelancer que foi matched com um cliente
 * (Fase futura: enviar mensagem via WhatsApp pra freelancer)
 */
export async function notifyFreelancerOfMatch(
  freelancerId: string,
  phoneNumber: string,
  scope: ScopeAnalysis
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    // TODO: Enviar notificação pra freelancer via WhatsApp
    // Por enquanto, log apenas
    console.log(
      `[NOTIFY FREELANCER] ID: ${freelancerId}, Project: ${scope.summary}`
    );

    // Futuramente: chamar sendWhatsAppMessage(freelancer_number, notification_text)
    return true;
  } catch (error) {
    console.error("Freelancer notification error:", error);
    return false;
  }
}

/**
 * Criar projeto automaticamente a partir da análise
 * (Executado se cliente responder "sim" à publicação automática)
 * TODO: Fase 2 - integrar com project_contacts após tabela ser criada
 */
export async function createProjectFromScope(
  clientPhoneNumber: string,
  scope: ScopeAnalysis
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    // Primeiro: linkar telefone ao user_id (ou criar novo user se necessário)
    const userId = await getOrCreateUserFromPhone(clientPhoneNumber);
    if (!userId) throw new Error("Could not identify user");

    // Criar projeto
    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        client_id: userId,
        title: scope.summary.substring(0, 100),
        description: scope.summary,
        skills: scope.skills,
        budget_min: scope.budget_min,
        budget_max: scope.budget_max,
        deadline_days: scope.deadline_days,
        status: "open",
      })
      .select("id")
      .single();

    if (error) throw error;

    // TODO: Guardar contato em project_contacts quando tabela existir
    // await supabase.from("project_contacts").insert({
    //   project_id: project.id,
    //   contact_phone: clientPhoneNumber,
    // });

    console.log(`[PROJECT CREATED] ID: ${project.id}, Client: ${userId}`);
    return project.id;
  } catch (error) {
    console.error("Project creation error:", error);
    return null;
  }
}

/**
 * Linkar telefone do WhatsApp ao PrestaCerto user
 * Se não existir, cria conta nova com dados mínimos
 */
async function getOrCreateUserFromPhone(
  phoneNumber: string
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    // Ver se já existe mapeamento
    const { data: existing } = await supabase
      .from("whatsapp_users")
      .select("user_id")
      .eq("phone_number", phoneNumber)
      .single();

    if (existing?.user_id) {
      return existing.user_id;
    }

    // Criar novo user via Supabase Auth (email: phone@whatsapp.local)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser(
      {
        email: `${phoneNumber}@whatsapp.local`,
        password: crypto.getRandomValues(new Uint8Array(32)).toString(),
        email_confirm: true,
        user_metadata: { whatsapp_phone: phoneNumber },
      }
    );

    if (authError || !authUser.user) throw authError || new Error("User creation failed");

    // Criar profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authUser.user.id,
      role: "client",
      full_name: `Cliente ${phoneNumber.slice(-4)}`,
      contact_phone: phoneNumber,
    });

    if (profileError) throw profileError;

    // Mapear phone → user_id
    await supabase.from("whatsapp_users").insert({
      phone_number: phoneNumber,
      user_id: authUser.user.id,
      interaction_count: 1,
    });

    console.log(`[USER CREATED] Phone: ${phoneNumber}, ID: ${authUser.user.id}`);
    return authUser.user.id;
  } catch (error) {
    console.error("User creation error:", error);
    return null;
  }
}

/**
 * Registrar interação no banco pra analytics
 */
export async function logWhatsAppInteraction(
  phoneNumber: string,
  messageText: string,
  scopeAnalysis: ScopeAnalysis,
  freelancersReturned: FreelancerMatch[]
): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    await supabase.from("whatsapp_interactions").insert({
      phone_number: phoneNumber,
      user_message: messageText,
      scope_analysis: scopeAnalysis,
      freelancers_returned: freelancersReturned.length,
    });

    // Atualizar contador em whatsapp_users
    const { data: whatsappUser } = await supabase
      .from("whatsapp_users")
      .select("id, interaction_count")
      .eq("phone_number", phoneNumber)
      .single();

    if (whatsappUser) {
      await supabase
        .from("whatsapp_users")
        .update({
          interaction_count: (whatsappUser.interaction_count || 0) + 1,
          last_interaction: new Date(),
        })
        .eq("phone_number", phoneNumber);
    }
  } catch (error) {
    console.error("Logging interaction error:", error);
  }
}
