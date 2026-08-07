# 🚀 QUICK START: DO ZERO AO DEPLOY (4 HORAS)

**Você tá aqui:** Tem o código pronto, falta só conectar e deploy  
**Seu objetivo:** Site ao vivo com monetização HOJE  
**Tempo total:** 4 horas  

---

## 📋 PRÉ-REQUISITOS (Tenha antes de começar)

```
✓ Acesso Supabase (projeto criado)
✓ Vercel conectado ao GitHub
✓ Mercado Pago (conta + sandbox keys)
✓ Redis (Upstash GRÁTIS)
✓ Git commit privilege
```

---

## ⚡ PASSO 1: Preparar Variáveis de Ambiente (5 min)

Copia esse template no `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu_service_key_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key_aqui

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_mp
MERCADO_PAGO_CLIENT_SECRET=seu_client_secret
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=seu_public_key

# App
NEXT_PUBLIC_URL=https://localhost:3000 (local) ou https://seu-dominio.com (prod)

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://seu-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=seu_token_aqui
```

**Onde pega:**
- Supabase: Project settings → API
- Mercado Pago: Account settings → Credentials
- Redis: Dashboard Upstash → Copy URL + Token
- URL: Se localhost, deixa `localhost:3000`. Se prod, `https://seu-dominio.com`

---

## ⚡ PASSO 2: Rodar Migrations (2 min)

```bash
# Terminal na raiz do projeto

# Opção A: Via CLI Supabase (melhor)
supabase migration up

# Opção B: Via UI Supabase (mais fácil)
# 1. Ir em Supabase Dashboard
# 2. SQL Editor
# 3. New query
# 4. Copiar conteúdo de: supabase/migrations/0011_payment_processing_core.sql
# 5. Run
```

**Verifica se rodou:**
```sql
-- No SQL Editor do Supabase
SELECT tablename FROM pg_tables WHERE tablename LIKE 'payment_%' OR tablename LIKE 'escrow_%';

-- Deve retornar:
-- payment_ledger
-- payment_transactions
-- payment_audit_log
-- escrow_ledger
-- saved_payment_methods
-- payouts
-- mercado_pago_tokens
-- fee_config
```

---

## ⚡ PASSO 3: Integrar Componentes (30 min)

### 3.1: Adicionar Selo Segurança no checkout

Procura por: `src/components/checkout/*.tsx` (ou cria se não existir)

Em qualquer modal de pagamento, adiciona:

```tsx
import { SecurityBadge } from "@/components/checkout/security-badge";

export function CheckoutModal() {
  return (
    <div>
      {/* Seu form de pagamento */}
      <SecurityBadge /> {/* ← ADICIONA AQUI */}
      <button>Pagar com Mercado Pago</button>
    </div>
  );
}
```

### 3.2: Adicionar Progress Bar na confirmação

```tsx
import { PaymentProgress } from "@/components/checkout/payment-progress";

export function PaymentConfirmationStep() {
  const [status, setStatus] = useState("processing");
  
  return (
    <PaymentProgress 
      status={status}
      message="Processando seu pagamento..."
    />
  );
  
  // Quando webhook chegar:
  // setStatus("completed")
}
```

### 3.3: Adicionar "Seja o Primeiro" em projects vazios

```tsx
import { EmptyStateCTA } from "@/components/projects/empty-state-cta";

export function ProjectsPage({ projects }) {
  if (!projects.length) {
    return <EmptyStateCTA category="Desenvolvimento" type="projects" />;
  }
  
  return <ProjectsList projects={projects} />;
}
```

### 3.4: Remover "NOVO" badge fake

```tsx
// src/components/navigation/navbar.tsx
import { shouldShowBadgeCached } from "@/components/navigation/has-new-badge";

export async function Navbar() {
  const hasVagas = await shouldShowBadgeCached("vagas", "projects");
  
  return (
    <nav>
      <Link href="/projects">Projetos</Link>
      <Link href="/services">Serviços</Link>
      
      {/* Só mostra "Vagas" se tiver conteúdo */}
      {hasVagas && <Link href="/vagas">Vagas {/* SEM badge NOVO */}</Link>}
      {!hasVagas && <span className="text-gray-400">Vagas (em breve)</span>}
    </nav>
  );
}
```

---

## ⚡ PASSO 4: Aplicar Rate Limiting (15 min)

Em TODAS as rotas públicas que aceitam POST:

```typescript
// src/app/api/contact/route.ts
import { checkRateLimit, getClientIP, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // ADICIONA ESSAS 3 LINHAS NO INÍCIO
  const ip = getClientIP(req);
  const rateLimitCheck = await checkRateLimit(rateLimiters.contact, ip);
  if (!rateLimitCheck.success) return rateLimitResponse(rateLimitCheck.reset);
  
  // ... resto do código
}
```

Repetir em:
- `src/app/api/leads/route.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/proposals/route.ts`
- Qualquer outra rota pública

---

## ⚡ PASSO 5: Configurar Mercado Pago Webhook (10 min)

1. **Ir em:** https://www.mercadopago.com.br/account/webhooks
2. **Adicionar nova URL:**
   ```
   https://seu-dominio.com/api/webhooks/mercado-pago
   ```
3. **Selecionar eventos:**
   - ✅ payment.updated
   - ✅ payment.created
   - ✅ payment.approved ⭐ (CRÍTICO)
   - ✅ payment.declined
4. **Copy webhook secret** → Cole em `.env.local` como `MERCADO_PAGO_WEBHOOK_SECRET`
5. **Salvar**

**Testar webhook (sandbox):**
```bash
# Trigger fake payment
curl -X POST https://api.mercadopago.com/v1/payments \
  -H "Authorization: Bearer YOUR_SANDBOX_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "payment_method_id": "visa", ...}'

# Seu webhook deve receber em segundos
# Verifica em: Supabase → payment_audit_log
```

---

## ⚡ PASSO 6: Local Tests (30 min)

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Tests

# Test 1: Rate limit
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"test@test.com","message":"test"}'
done
# Deve bloquear após 3 requisições

# Test 2: Components
# Abrir browser em http://localhost:3000
# Ir em /projects → deve ver "Seja o Primeiro"
# Ir em checkout → deve ver selo segurança + progress bar

# Test 3: API
curl -X POST http://localhost:3000/api/monetization/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "project_id": "uuid-aqui",
    "amount": 100,
    "idempotency_key": "test-123",
    "payment_method": "pix"
  }'
# Deve retornar preference_id + pix_qr_code
```

---

## ⚡ PASSO 7: Deploy Vercel (5 min)

```bash
# 1. Commit
git add -A
git commit -m "Feat: Payment core + quick wins monetization (DETONATION MODE)"

# 2. Push
git push origin main

# 3. Vercel auto-deploys
# Espera 2-3 min até ver "Deployment Success"

# 4. Testar em produção
# Ir em https://seu-site.vercel.app
# Passar pelos mesmos tests do passo 6
```

---

## ⚡ PASSO 8: Smoke Test FINAL (15 min)

✅ **Checklist de "Tá Vivo?"**

```
[ ] Site carrega em https://seu-dominio
[ ] Login funciona
[ ] Dashboard carrrega
[ ] /projects mostra "Seja o Primeiro" (se vazio)
[ ] Navbar mostra "Vagas" ou não (baseado em conteúdo)
[ ] Tenta fazer checkout → vê selo segurança
[ ] Tenta mandar 4 mensagens rapidinho → bloqueia na 4ª (rate limit)
[ ] Supabase audit_log tem registros de payment_initiated
[ ] Mercado Pago recebeu sua URL de webhook
[ ] DB tem tabelas payment_ledger, escrow_ledger, etc
```

Se tudo verde → **PRONTO! SITE AO VIVO COM MONETIZAÇÃO!** 🚀

---

## 🔧 TROUBLESHOOTING

### "Payment endpoint retorna 401"
- [ ] User tá logado?
- [ ] JWT token tá válido?
- [ ] Verifica em middleware.ts se tá bloqueando rotas `/api/monetization/*`

### "Webhook não funciona"
- [ ] MP secret tá certo em `.env`?
- [ ] URL pública em NEXT_PUBLIC_URL tá configurada?
- [ ] Firewall bloqueando POST?
- [ ] Verifica logs em: `Supabase → payment_audit_log`

### "Rate limit dá erro"
- [ ] Redis credentials tá certas?
- [ ] Upstash tá rodando?
- [ ] Testar redis connection: `redis-cli ping`

### "Componentes não aparecem"
- [ ] Path imports tá certo (`@/components/...`)?
- [ ] Tá usando `"use client"` top do arquivo?
- [ ] Build tá passando? `npm run build`

---

## 🎯 PRÓXIMOS PASSOS (Depois de hoje)

**Amanhã de manhã:**
- [ ] PIX integrado (já tá 90% pronto)
- [ ] Salvar cartão (já tá pronto)
- [ ] Testar fluxo completo de pagamento

**Próxima semana:**
- [ ] Impulsionar serviço (R$ 19,90)
- [ ] Selo urgente projeto (R$ 14,90)
- [ ] Desconto anual (Pro/Business)

**Mês que vem:**
- [ ] Plano Agência (+R$ 399/mês)
- [ ] Ads Network (CPM)
- [ ] API v1

---

## ✅ VOCÊ CONSEGUE!

Essa é a última reta. 4 horas. 8 passos. Site ao vivo.

**Documentação tá aqui:**
- `RESUMO_EXECUTIVO_FINAL.md` — O que fizemos
- `ROADMAP_FINAL_ALINHADO_LUCRATIVIDADE.md` — O que vem
- `DEPLOYMENT_CHECKLIST_TODAY.md` — Checklist detalhado

**Código tá pronto:**
- Migrations SQL ✅
- Rate limiting ✅
- Payment APIs ✅
- Webhooks ✅
- Componentes ✅

**Vão fazer?** 🚀

Boa sorte, campeão! 💪

