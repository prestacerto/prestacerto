# PrestaCerto WhatsApp Integration — Arquitetura

## Fluxo de ponta a ponta

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (WhatsApp)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. Envia: "Preciso de dev React pra app de delivery"               │
│                        ▼                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    Meta WhatsApp Cloud API                           │
├─────────────────────────────────────────────────────────────────────┤
│  2. Webhook → POST /api/whatsapp/webhook                            │
│     - Header: x-hub-signature-256 (HMAC-SHA256)                     │
│     - Body: { entry: [{ changes: [{ value: { messages: [...] } }] }│
│                        ▼                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              PrestaCerto Backend (Next.js Route Handler)             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  3. validateWebhookSignature()                                       │
│     ├─ Recalcula HMAC-SHA256 com WHATSAPP_APP_SECRET                │
│     └─ Rejeita se não bater → 403 Forbidden                         │
│                        ▼                                              │
│  4. getOrCreateConversation(phoneNumber)                             │
│     ├─ Busca whatsapp_conversations ativa                           │
│     └─ Cria nova se não existir (isolada por cliente)              │
│                        ▼                                              │
│  5. analyzeScopeFromMessage(messageText)                            │
│     ├─ Chama Claude 3.5 Sonnet                                      │
│     ├─ Extrai: category, budget_min/max, deadline_days, skills     │
│     └─ Retorna confidence score (0-100)                             │
│                        ▼                                              │
│  6. findCompatibleFreelancers(scope)                                 │
│     ├─ Query Supabase: profiles WHERE role='freelancer'             │
│     ├─ Ordena por rating DESC, rating_count DESC                    │
│     └─ Retorna top 3 (sem dados pessoais)                           │
│                        ▼                                              │
│  7. storeMatchesInConversation()                                     │
│     ├─ Armazena freelancer IDs                                      │
│     ├─ Armazena scope_analysis                                      │
│     └─ Pronto pra validações futuras                                │
│                        ▼                                              │
│  8. formatFreelancerResponse()                                       │
│     ├─ Monta resposta: "Encontrei 3 especialistas"                  │
│     ├─ Para cada um: nome, rating, bio (sem contatos)               │
│     ├─ Links: /api/whatsapp/redirect-profile?conversation_id=...   │
│     └─ Garante NENHUM dado sensível (validação)                     │
│                        ▼                                              │
│  9. sendWhatsAppMessage(phoneNumber, responseMessage)               │
│     ├─ POST https://graph.instagram.com/v18.0/PHONE_ID/messages    │
│     ├─ Header: Authorization: Bearer WHATSAPP_ACCESS_TOKEN          │
│     └─ Body: { messaging_product: "whatsapp", to: "55...", ... }   │
│                        ▼                                              │
│  10. logWhatsAppInteraction()                                        │
│      ├─ INSERT whatsapp_interactions                                │
│      ├─ INSERT whatsapp_users (phone → user_id)                     │
│      └─ UPDATE whatsapp_conversations (status)                      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (recebe)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  11. Recebe mensagem WhatsApp:                                       │
│     "✅ Encontrei 3 especialistas                                    │
│      1. João Silva                                                   │
│         ⭐ 4.9 (47 projetos)                                         │
│         👉 prestacerto.com/api/whatsapp/redirect-profile?..."       │
│                                                                       │
│  12. Clica no link → redirect-profile valida acesso                 │
│                        ▼                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│         redirect-profile endpoint (/api/whatsapp/redirect)          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  13. validateFreelancerAccess(conversationId, freelancerId)         │
│      ├─ Query whatsapp_conversations.conversation_context         │
│      ├─ Verifica se freelancer está no histórico de matches        │
│      └─ Se não → 404 Not Found (segurança)                         │
│                        ▼                                              │
│  14. Redireciona: https://prestacerto.com/@freelancer_id            │
│                        ▼                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              CLIENTE (dentro da plataforma)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  15. Vê perfil completo do freelancer                               │
│      - Bio, portfolio, projetos anteriores                          │
│      - CTA: "Enviar proposta"                                       │
│                        ▼                                              │
│  16. Cria proposta                                                   │
│      ├─ message, proposed_price                                     │
│      ├─ Freelancer pode aceitar/rejeitar                            │
│      └─ Após aceite: contato liberado via RLS                       │
│                        ▼                                              │
│  17. Checkout (Mercado Pago Brick)                                   │
│      ├─ Escrow de 7-14 dias                                         │
│      ├─ Proteção integral                                           │
│      └─ Chat privado despontecado                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Camadas de segurança

### 1️⃣ Webhook Signature (HMAC-SHA256)
```
Cliente externo
    ↓
Meta envia mensagem com header:
  x-hub-signature-256: sha256=<HMAC-SHA256(body, app_secret)>
    ↓
Servidor recalcula HMAC
    ↓
Se não bater → 403 Rejected
```

### 2️⃣ Conversa isolada
```
Cada cliente tem whatsapp_conversation única
    ↓
Todos os dados sensíveis (matches, context) ficam ali
    ↓
Nada é exposto na resposta do WhatsApp
```

### 3️⃣ Validação no redirect
```
Cliente clica link: /redirect-profile?conversation_id=X&freelancer_id=Y
    ↓
Endpoint valida: freelancer Y estava nos matches de conversation X?
    ↓
Sim → redireciona pra /@Y
Não → 404 (tentativa de acesso não autorizado)
```

### 4️⃣ RLS no banco
```
whatsapp_conversations tem RLS
    ↓
Usuário autenticado vê só suas próprias conversas
    ↓
Service role pode tudo (servidor backend)
    ↓
Cliente anônimo = não vê nada
```

---

## Estrutura de dados

### whatsapp_conversations
```sql
id (uuid)                    -- Identificador único da conversa
phone_number (text)         -- Número do cliente (55YYXXXXXXXXX)
user_id (uuid FK)           -- Link pra profiles (null se anônimo)
status (text)               -- 'active', 'completed', 'archived'
scope_analysis (jsonb)      -- Última análise de escopo
selected_freelancer_id      -- Qual freelancer foi selecionado (pós-conversa)
conversation_context (jsonb)-- Histórico:
                              -- [
                              --   {role: 'client', content: '...', timestamp},
                              --   {role: 'assistant', content: '...', timestamp},
                              --   {role: 'assistant', type: 'matches', freelancer_ids: [...]}
                              -- ]
created_at                  -- Quando conversa começou
updated_at                  -- Última interação
closed_at                   -- Quando foi finalizada
```

### whatsapp_interactions (log)
```sql
id (uuid)
phone_number (text)         -- Para agregação de stats
user_message (text)         -- Mensagem original do cliente
scope_analysis (jsonb)      -- Análise feita pela IA
freelancers_returned (int)  -- Quantos foram encontrados
created_at
```

### whatsapp_users (mapeamento)
```sql
id (uuid)
phone_number (text)         -- Índice único (lookup rápido)
user_id (uuid FK)           -- Profile criada na 1ª interação (pode ser null)
first_interaction (timestamptz)
last_interaction (timestamptz)
interaction_count (int)     -- Para identificar VIPs
```

---

## Componentes (TypeScript)

### `ai-scope-analyzer.ts`
```
analyzeScopeFromMessage(text: string)
  → Claude API
  → ScopeAnalysis { category, budget_min/max, deadline_days, skills, urgency, confidence }

generateConfirmationPrompt(analysis)
  → "Entendi! Você quer dev React, orçamento R$500-5k, prazo 7 dias. Tá certo?"
```

### `freelancer-matching.ts`
```
findCompatibleFreelancers(scope)
  → Supabase query (rating DESC, rating_count DESC)
  → FreelancerMatch[] (top 3, sem dados pessoais)

formatFreelancerResponse(freelancers, scope, domain, conversationId)
  → WhatsApp-friendly string com links seguros

notifyFreelancerOfMatch(freelancerId, phoneNumber, scope)
  → Future: enviar notificação pro freelancer via WhatsApp

createProjectFromScope(phoneNumber, scope)
  → Cria projeto automaticamente (Fase 2)

logWhatsAppInteraction(...)
  → Persiste em whatsapp_interactions, whatsapp_users
```

### `secure-conversations.ts`
```
getOrCreateConversation(phoneNumber)
  → Gerencia isolamento por cliente

addMessageToContext(conversationId, role, content)
  → Multi-turn ready

storeMatchesInConversation(conversationId, freelancerIds, scope)
  → Preparação pra validações

validateFreelancerAccess(conversationId, freelancerId)
  → Segurança: só mostra perfil se foi recomendado

completeConversation(conversationId, selectedFreelancerId)
  → Marca conversa como done

validateNoPersonalDataInResponse(text)
  → Detecção de vazamento (regex patterns)
```

---

## Variáveis de ambiente necessárias

```bash
# WhatsApp Business API (da Meta)
WHATSAPP_PHONE_ID=123456789...
WHATSAPP_ACCESS_TOKEN=EAB...
WHATSAPP_VERIFY_TOKEN=prestacerto_webhook_token
WHATSAPP_APP_SECRET=abc123... # CRÍTICO para HMAC

# IA
ANTHROPIC_API_KEY=sk-ant-...

# Banco
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Domínio (pra links na resposta WhatsApp)
NEXT_PUBLIC_DOMAIN=prestacerto.com
```

---

## Fluxo de dados (segurança)

```
Cliente envia número pessoal?
  ❌ NÃO — cliente envia descrição do projeto, não contato
     → IA analisa descrição
     → Freelancers recomendados (dados públicos)
     → Links seguros

Quem vê número de telefone do cliente?
  ❌ Freelancer não vê (até aceitar proposta)
  ❌ WhatsApp nunca vê (sistema roda no servidor)
  ✅ Servidor pode ver (isolado em conversa_id)

Quem vê dados pessoais do freelancer?
  ❌ Cliente anônimo não vê (redirect valida)
  ✅ Cliente vê após clicar no link (consentido)
  ✅ Cliente logado vê (RLS)

Proteção de vazamento:
  1. Validação HMAC (rejeita forjados)
  2. Conversas isoladas (separação por client)
  3. Endpoint redirect valida (acesso condicional)
  4. Regex check (no response content)
  5. RLS no banco (camada final)
```

---

## Performance esperada

| Métrica | Valor |
|---------|-------|
| Webhook → Resposta | < 3 segundos |
| IA análise | ~1.5s (Claude latency) |
| Busca freelancers | < 200ms (índice de rating) |
| WhatsApp send | < 500ms |
| **Total** | **< 5 segundos** |

Gargalos:
- Claude API (IA) → 1.5s (necessário, não pode otimizar)
- Supabase (BD) → pode aumentar se muitos freelancers

---

## Monitoramento

```sql
-- Real-time
SELECT COUNT(*) as msgs_last_hour
FROM whatsapp_interactions
WHERE created_at > now() - interval '1 hour';

-- Success rate
SELECT 
  COUNT(CASE WHEN freelancers_returned > 0 THEN 1 END) * 100 / COUNT(*) as success_pct
FROM whatsapp_interactions;

-- Error tracking (check logs)
vercel logs  # Procure por [WHATSAPP ERROR]
```

---

## Roadmap pós-Fase-1

- [ ] Conversa multi-turn (refinamentos, perguntas adicionais)
- [ ] Message templates (aprovados pela Meta)
- [ ] Notificações pro freelancer
- [ ] Criação automática de projeto
- [ ] Rate limiting (Upstash)
- [ ] Analytics dashboard
- [ ] Escalonamento humano
- [ ] Chat roteado (Opção 2 — agora)
