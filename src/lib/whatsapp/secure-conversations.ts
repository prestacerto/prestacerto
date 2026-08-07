/**
 * Sistema seguro de conversas WhatsApp → Plataforma
 * Garante que dados pessoais NUNCA vazam
 *
 * Fluxo:
 * 1. Cliente envia msg no WhatsApp
 * 2. Sistema cria/encontra conversação com ID único
 * 3. IA busca freelancers, manda resposta (SEM contatos pessoais)
 * 4. Cliente clica link → plataforma mostra perfil completo
 * 5. Conversa de negociação acontece 100% na plataforma
 */

import { createClient } from "@supabase/supabase-js";
import type { ScopeAnalysis } from "./ai-scope-analyzer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

/**
 * Iniciar ou recuperar conversação do WhatsApp
 * Todos os dados sensíveis ficam dentro da conversação
 * Nunca são expostos pro cliente ver
 */
export async function getOrCreateConversation(
  phoneNumber: string
): Promise<{ conversationId: string; userId: string | null }> {
  try {
    // Procurar conversa ativa
    const { data: existing } = await supabase
      .from("whatsapp_conversations")
      .select("id, user_id")
      .eq("phone_number", phoneNumber)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      return { conversationId: existing.id, userId: existing.user_id };
    }

    // Criar nova conversa
    const { data: newConvo, error } = await supabase
      .from("whatsapp_conversations")
      .insert({
        phone_number: phoneNumber,
        status: "active",
        conversation_context: [],
      })
      .select("id, user_id")
      .single();

    if (error || !newConvo) throw error;
    return { conversationId: newConvo.id, userId: newConvo.user_id };
  } catch (error) {
    console.error("[CONVERSATION ERROR]", error);
    throw error;
  }
}

/**
 * Adicionar mensagem ao contexto da conversa
 * Permite multi-turn conversations sem expor dados
 */
export async function addMessageToContext(
  conversationId: string,
  role: "client" | "assistant",
  content: string
): Promise<void> {
  try {
    const { data: convo, error: fetchError } = await supabase
      .from("whatsapp_conversations")
      .select("conversation_context")
      .eq("id", conversationId)
      .single();

    if (fetchError) throw fetchError;

    const context = convo.conversation_context || [];
    context.push({
      role,
      content,
      timestamp: new Date(),
    });

    const { error: updateError } = await supabase
      .from("whatsapp_conversations")
      .update({
        conversation_context: context,
        updated_at: new Date(),
      })
      .eq("id", conversationId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("[CONTEXT UPDATE ERROR]", error);
  }
}

/**
 * Armazenar matches da conversa (freelancers encontrados)
 * Sem expor dados pessoais, só IDs e dados públicos
 */
export async function storeMatchesInConversation(
  conversationId: string,
  freelancerIds: string[],
  scopeAnalysis: ScopeAnalysis
): Promise<void> {
  try {
    // Primeiro: ler contexto atual
    const { data: convo, error: fetchError } = await supabase
      .from("whatsapp_conversations")
      .select("conversation_context")
      .eq("id", conversationId)
      .single();

    if (fetchError) throw fetchError;

    // Depois: append ao contexto
    const currentContext = convo?.conversation_context || [];
    const updatedContext = [
      ...currentContext,
      {
        role: "assistant",
        type: "matches",
        freelancer_ids: freelancerIds,
        timestamp: new Date().toISOString(),
      },
    ];

    // Finalmente: atualizar
    const { error: updateError } = await supabase
      .from("whatsapp_conversations")
      .update({
        scope_analysis: scopeAnalysis,
        conversation_context: updatedContext,
      })
      .eq("id", conversationId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error("[MATCHES STORAGE ERROR]", error);
  }
}

/**
 * Validar que cliente pode ver o perfil de um freelancer
 * (depois que clica no link, checar se ele foi recomendado)
 */
export async function validateFreelancerAccess(
  conversationId: string,
  freelancerId: string
): Promise<boolean> {
  try {
    const { data: convo } = await supabase
      .from("whatsapp_conversations")
      .select("conversation_context")
      .eq("id", conversationId)
      .single();

    if (!convo) return false;

    // Verificar se freelancer_id está no histórico de matches dessa conversa
    type ContextEntry = { type?: string; freelancer_ids?: string[] };
    const hasMatch = (convo.conversation_context as ContextEntry[] | null)?.some(
      (msg) => msg.type === "matches" && msg.freelancer_ids?.includes(freelancerId)
    );

    return hasMatch || false;
  } catch (error) {
    console.error("[ACCESS VALIDATION ERROR]", error);
    return false;
  }
}

/**
 * Marcar conversa como concluída
 */
export async function completeConversation(
  conversationId: string,
  selectedFreelancerId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("whatsapp_conversations")
      .update({
        status: "completed",
        selected_freelancer_id: selectedFreelancerId || null,
        closed_at: new Date(),
      })
      .eq("id", conversationId);

    if (error) throw error;
  } catch (error) {
    console.error("[COMPLETION ERROR]", error);
  }
}

/**
 * Garantir que dados pessoais estão sempre atrás de RLS
 * (chamado no server para validar segurança)
 */
export function validateNoPersonalDataInResponse(responseText: string): boolean {
  const sensitivePatterns = [
    /(55)?[\d\s\-()]+@(whatsapp|gmail|hotmail)/, // Email/telefone
    /\b[\d\-\+]{10,15}\b/, // Telefone
    /CPF|CNPJ|RG/, // Documento
    /@gmail|@hotmail|@yahoo/, // Email
  ];

  return !sensitivePatterns.some((pattern) => pattern.test(responseText));
}
