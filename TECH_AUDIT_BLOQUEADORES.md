# 🔴 TECH AUDIT: 4 BLOQUEADORES CRÍTICOS

**Achados:** Problemas REAIS que virariam bugs em produção  
**Status:** ⚠️ CRÍTICO — RESOLVER ANTES DE LAUNCH  
**Timeline:** 8 horas pra resolver tudo

---

## 🔴 BLOQUEADOR #1: MERCADO PAGO TOKEN EXPIRY (180 dias)

**O Problema:**
```
- Freelancer conecta Mercado Pago via OAuth
- Token recebe com 180 dias de validade
- App NÃO renova token automaticamente
- Dia 181: token expira
- Resultado: freelancer não consegue sacar, sem aviso
```

**Impacto:** CRÍTICO — Usuário perde funcionalidade sem feedback

**Solução:**
```typescript
// 1. Salvar refresh_token sempre que receber
create table mercado_pago_tokens (
  id uuid primary key,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  access_token text not null encrypted,
  refresh_token text not null encrypted,
  token_expiry timestamptz not null,
  created_at timestamptz default now(),
  
  constraint one_token_per_freelancer unique (freelancer_id)
);

// 2. Função que renova automaticamente
async function refreshMPTokenIfNeeded(freelancer_id: string) {
  const token = await db.mercado_pago_tokens.findOne({ freelancer_id })
  
  if (Date.now() < token.token_expiry - 86400000) { // 1 dia antes
    return token.access_token // ainda válido
  }
  
  // Expirou soon, renovar
  const response = await fetch('https://api.mercadopago.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.MP_CLIENT_ID,
      client_secret: process.env.MP_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token
    })
  })
  
  const { access_token, refresh_token, expires_in } = await response.json()
  
  // Atualizar DB
  await db.mercado_pago_tokens.update(
    { freelancer_id },
    {
      access_token,
      refresh_token,
      token_expiry: new Date(Date.now() + expires_in * 1000)
    }
  )
  
  return access_token
}

// 3. Usar em todo lugar que chama MP API
const mpToken = await refreshMPTokenIfNeeded(freelancer_id)
const response = await callMercadoPagoAPI(mpToken, ...)
```

**Esforço:** 2h  
**Crítico?** SIM — resolver ANTES de qualquer payout real

---

## 🔴 BLOQUEADOR #2: ROTAS PÚBLICAS SEM RATE LIMIT (Spam)

**O Problema:**
```
POST /api/leads (captura email planos Pro/Business)
  → SEM autenticação
  → SEM rate limit
  → Qualquer bot pode spam: 10k emails falsos em 1h

POST /api/contact (formulário /contato)
  → SEM limite
  → Bom pra malware/scam enviarem mensagens
```

**Impacto:** ALTO — Banco de dados cheio de lixo, emails spam, reputação

**Solução:**
```typescript
// 1. Instalar rate-limit middleware
npm install @upstash/ratelimit

// 2. Criar rate limiter por IP
import { Ratelimit } from '@upstash/ratelimit'

const leadRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 submissões por hora por IP
  analytics: true
})

// 3. Aplicar em todas rotas públicas
// app/api/leads/route.ts
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await leadRateLimit.limit(ip)
  
  if (!success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // ... processar lead
}

// app/api/contact/route.ts
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { success } = await contactRateLimit.limit(ip)
  
  if (!success) {
    return Response.json(
      { error: 'Too many submissions. Try again later.' },
      { status: 429 }
    )
  }
  
  // ... processar contato
}

// 4. Validação extra: honeypot field
// Adicionar campo invisível no form HTML — bots preenchem, humanos não
<input type="text" name="website_url" style="display: none" />

if (req.body.website_url) {
  // É bot, ignorar silenciosamente
  return Response.json({ success: true }) // fingir que funcionou
}
```

**Limites Recomendados:**
- `/api/leads`: 5/hora por IP
- `/api/contact`: 3/hora por IP
- `/api/proposals`: 20/hora (usuário autenticado)
- `/api/messages`: 100/hora (usuário autenticado)

**Esforço:** 1.5h  
**Crítico?** SIM — implementar HOJE

---

## 🟡 BLOQUEADOR #3: PROPOSTA EM PROJETO FECHADO (API Bug)

**O Problema:**
```
1. Cliente publica projeto, depois fecha ("Já contratei")
2. Projeto status = 'closed'
3. UI esconde botão "Enviar Proposta"
4. Mas API route handler NÃO valida status
5. Hacker faz POST /api/proposals com projeto_id de projeto fechado
6. Proposta é criada mesmo assim ❌
```

**Impacto:** MÉDIO — Não é financeiro, mas é data corruption

**Solução:**
```typescript
// app/api/proposals/route.ts
export async function POST(req: Request) {
  const { project_id, message, proposed_price } = await req.json()
  const user = await getUser()
  
  // ✅ VALIDAR status do projeto
  const project = await supabase
    .from('projects')
    .select('id, status, client_id')
    .eq('id', project_id)
    .single()
  
  if (!project) {
    return Response.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }
  
  // ✅ REJEITAR se não está 'open'
  if (project.status !== 'open') {
    return Response.json(
      { error: 'Project is no longer open for proposals' },
      { status: 410 } // 410 Gone
    )
  }
  
  // ✅ Validar que não há proposta duplicate
  const existing = await supabase
    .from('proposals')
    .select('id')
    .eq('project_id', project_id)
    .eq('freelancer_id', user.id)
    .eq('status', 'pending')
    .single()
  
  if (existing) {
    return Response.json(
      { error: 'You already have a pending proposal for this project' },
      { status: 409 }
    )
  }
  
  // ✅ Criar proposta
  const proposal = await supabase
    .from('proposals')
    .insert({
      project_id,
      freelancer_id: user.id,
      message,
      proposed_price,
      status: 'pending'
    })
    .select()
    .single()
  
  return Response.json(proposal)
}
```

**Também adicionar em RLS:**
```sql
create policy "apenas projetos open aceitam propostas"
on proposals for insert
with check (
  exists (
    select 1 from projects
    where projects.id = project_id
    and projects.status = 'open'
  )
);
```

**Esforço:** 1h  
**Crítico?** MÉDIO — resolver esta semana

---

## 🟡 BLOQUEADOR #4: RETENÇÃO PAGAMENTO NÃO TESTADA (Sandbox)

**O Problema:**
```
- Código de escrow/retenção de pagamento segue documentação Mercado Pago
- MAS: nunca foi testado contra SANDBOX deles com dinheiro de teste
- Quando vai pra produção, podem haver surpresas:
  * Webhook não chega (timing)
  * Valores retornam com decimais diferentes
  * Currency conversions inesperadas
  * Taxa é calculada diferente
```

**Impacto:** CRÍTICO — É a base do payment processing todo

**Solução:**
```typescript
// 1. Criar script de teste contra sandbox MP
// scripts/test-mp-sandbox.ts

const MP_SANDBOX_CONFIG = {
  client_id: process.env.MP_SANDBOX_CLIENT_ID,
  client_secret: process.env.MP_SANDBOX_CLIENT_SECRET,
  base_url: 'https://api.mercadolibre.com.ar' // Sandbox usa .com.ar
}

async function testCompletePaymentFlow() {
  console.log('🧪 Testando fluxo de pagamento completo no Sandbox MP...\n')
  
  // Passo 1: Criar preference
  const preference = await createMPPreference({
    items: [{
      title: 'Projeto Teste',
      description: 'Projeto teste sandbox',
      quantity: 1,
      unit_price: 100.50
    }],
    notification_url: 'https://seu-dominio.com/api/webhooks/mercado-pago'
  })
  console.log('✅ Preference criada:', preference.id)
  
  // Passo 2: Simular pagamento no sandbox
  // Usar card de teste do MP: 4111111111111111
  // Usuário: TESTUSER123456@testuser.com
  console.log('🔗 URL checkout:', preference.init_point)
  console.log('📝 Use card: 4111111111111111 (test user)')
  console.log('⏳ Aguardando webhook... (máximo 2 minutos)')
  
  // Passo 3: Esperar webhook
  const webhook = await waitForWebhook(preference.id, 120000)
  console.log('✅ Webhook recebido:', webhook)
  
  // Passo 4: Validar ledger foi criado corretamente
  const ledger = await db.payment_ledger.findOne({
    transaction_id: webhook.data.id
  })
  console.log('✅ Ledger criado:', ledger)
  
  // Passo 5: Validar balanço foi atualizado
  const balance = await db.account_balance.findOne({
    user_id: ledger.account_id
  })
  console.log('✅ Balance atualizado:', balance)
  
  console.log('\n✅ TESTE COMPLETO PASSOU')
}

// 2. Rodar antes de enviar pra produção
// npm run test:mp-sandbox

// 3. Gerar relatório
console.log(`
════════════════════════════════════════
  MERCADO PAGO SANDBOX TEST REPORT
════════════════════════════════════════
✅ Preference criação
✅ Webhook recebimento (${webhook_latency}ms)
✅ Ledger double-entry
✅ Balance update
✅ Currency handling (BRL)
✅ Fee calculation (2.99%)
✅ Escrow hold
✅ Payout simulation

Status: PRONTO PARA PRODUÇÃO ✅
════════════════════════════════════════
`)
```

**Esforço:** 2h  
**Crítico?** SIM — rodar ANTES de aceitar pagamentos reais

---

## ❌ NÃO FAZER: "VAGAS AGREGADAS"

**O Quê:** Promete raspar Telegram/LinkedIn/WhatsApp pra "agregar" vagas

**Por Quê NÃO FAZER:**
- ❌ Violates ToS (Telegram, LinkedIn, WhatsApp)
- ❌ Violates LGPD (dados pessoais sem consentimento)
- ❌ Violates Lei de Acesso à Rede (raspar sem autorização)
- ❌ Pode resultar em processo + bloqueio de plataformas
- ❌ Imagem de scam (plataforma roubando dados)

**Alternativa Legal:**
```
Em vez de raspar:

✅ Integração oficial (se uma plataforma abrir API)
✅ Parceria com fonte (LinkedIn jobs via oficial API)
✅ Imports manual (usuário copia/cola vaga)
✅ RSS feeds públicas (se disponível)
✅ Notificação pra usuário: "Você pode postar uma vaga similar aqui"
```

**Decisão:** REMOVER completamente do escopo

---

## 📋 ORDEM DE RESOLUÇÃO

| Prioridade | Bloqueador | Esforço | Timeline |
|------------|-----------|---------|----------|
| 🔴 HOJE | MP Token Expiry | 2h | Imediato |
| 🔴 HOJE | Rate Limiting | 1.5h | Imediato |
| 🟡 ESTA SEMANA | Projeto Fechado | 1h | Antes dos Quick Wins |
| 🟡 ANTES DE PRODUÇÃO | MP Sandbox Test | 2h | Antes de pagar real |
| ❌ NEVER | Vagas Agregadas | — | Remover do roadmap |

**TOTAL EFFORT: 6.5 horas**

---

## ✅ CHECKLIST PRÉ-PRODUCTION

- [ ] MP Token OAuth com refresh automático implementado
- [ ] Rate limit em todas rotas públicas
- [ ] Validação de status em todas operações sensíveis
- [ ] Script de teste Sandbox MP rodou com sucesso
- [ ] Audit log de todas transações
- [ ] Webhook signature validation HMAC
- [ ] Idempotency keys em todos endpoints de escrita
- [ ] Secrets em .env (não em código)
- [ ] SSL/TLS 1.3 ativo
- [ ] CORS configurado corretamente
- [ ] Permissões RLS verificadas
- [ ] Teste de segurança (penetration test mini)

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Resolver os 4 bloqueadores (6.5h)
2. ✅ Implementar Quick Wins Friction Reduction (5h)
3. ✅ Deploy v1.0 com segurança production-ready
4. ✅ Começar Semana 2 com confiança

Quer que comece pelos bloqueadores ou pelos Quick Wins?

