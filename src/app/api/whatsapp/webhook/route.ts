import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { analyzeScopeFromMessage } from "@/lib/whatsapp/ai-scope-analyzer";
import {
  findCompatibleFreelancers,
  formatFreelancerResponse,
  logWhatsAppInteraction,
} from "@/lib/whatsapp/freelancer-matching";
import {
  getOrCreateConversation,
  addMessageToContext,
  storeMatchesInConversation,
  validateNoPersonalDataInResponse,
} from "@/lib/whatsapp/secure-conversations";

/**
 * POST /api/whatsapp/webhook
 * Recebe mensagens do WhatsApp Business API
 * Processa via IA, retorna freelancers compatíveis
 */
export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    // Validar webhook da Meta (usar body bruto, não deserializado)
    if (!validateWebhookSignature(req, bodyText)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Processar mensagens entrada
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const messages = body.entry[0].changes[0].value.messages;
      const phoneNumber = messages[0].from;
      const messageText = messages[0].text?.body;

      if (messageText) {
        await processMessage(phoneNumber, messageText);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * GET /api/whatsapp/webhook
 * Validação de webhook da Meta
 */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error("[WEBHOOK VERIFY] WHATSAPP_VERIFY_TOKEN not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * Validar assinatura do webhook (HMAC-SHA256)
 * Garante que mensagem veio realmente da Meta, não de atacante
 * IMPORTANTE: bodyText é o corpo RAW exato que Meta assinou
 */
function validateWebhookSignature(req: NextRequest, bodyText: string): boolean {
  const signature = req.headers.get("x-hub-signature-256");
  if (!signature) {
    console.error("[WEBHOOK SIGNATURE] Missing header x-hub-signature-256");
    return false;
  }

  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error("[WEBHOOK SIGNATURE] WHATSAPP_APP_SECRET not configured");
    return false;
  }

  // Calcular HMAC-SHA256 em cima dos bytes EXATOS que Meta enviou
  const hash = createHmac("sha256", appSecret).update(bodyText).digest("hex");
  const expectedSignature = `sha256=${hash}`;

  const isValid = signature === expectedSignature;

  if (!isValid) {
    console.error(
      `[WEBHOOK SIGNATURE] Mismatch: received ${signature}, expected ${expectedSignature}`
    );
  }

  return isValid;
}

/**
 * Processar mensagem: entender escopo → buscar freelancers → responder (SEM expor dados)
 */
async function processMessage(phoneNumber: string, messageText: string) {
  try {
    console.log(`[WHATSAPP MESSAGE] Phone: ${phoneNumber}, Text: ${messageText.substring(0, 50)}...`);

    // 0. Gerenciar conversa segura
    const { conversationId, userId } = await getOrCreateConversation(phoneNumber);
    console.log(`[CONVERSATION] ID: ${conversationId}, UserID: ${userId}`);

    // Registrar mensagem do cliente no contexto
    await addMessageToContext(conversationId, "client", messageText);

    // 1. Entender escopo via IA
    const scopeAnalysis = await analyzeScopeFromMessage(messageText);
    console.log(`[SCOPE ANALYSIS] Category: ${scopeAnalysis.category}, Confidence: ${scopeAnalysis.confidence}`);

    // 2. Buscar freelancers compatíveis
    const freelancers = await findCompatibleFreelancers(scopeAnalysis);
    console.log(`[FREELANCER MATCH] Found: ${freelancers.length} freelancers`);

    // 3. Formatar resposta (NUNCA expõe dados pessoais)
    // Usar conversation_id nos links pra validação de segurança
    const responseMessage = formatFreelancerResponse(
      freelancers,
      scopeAnalysis,
      process.env.NEXT_PUBLIC_DOMAIN || "prestacerto.com",
      conversationId
    );

    // 4. Validar que nenhum dado sensível vazou
    if (!validateNoPersonalDataInResponse(responseMessage)) {
      console.error("[SECURITY VIOLATION] Response contains personal data!");
      throw new Error("Response validation failed");
    }

    // 5. Registrar matches e contexto
    await storeMatchesInConversation(
      conversationId,
      freelancers.map((f) => f.id),
      scopeAnalysis
    );

    // Registrar resposta no contexto
    await addMessageToContext(conversationId, "assistant", responseMessage);

    // 6. Enviar resposta via WhatsApp
    await sendWhatsAppMessage(phoneNumber, responseMessage);

    // 7. Log auditoria
    await logWhatsAppInteraction(phoneNumber, messageText, scopeAnalysis, freelancers);

    console.log(`[WHATSAPP SENT] Response to ${phoneNumber}`);
  } catch (error) {
    console.error("[WHATSAPP ERROR]", error);
    await sendWhatsAppMessage(
      phoneNumber,
      "Desculpe, tive um problema. Tente novamente em alguns segundos."
    );
  }
}

/**
 * Enviar mensagem via WhatsApp Business API
 */
async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[WHATSAPP SEND ERROR]", error);
    throw error;
  }
}
