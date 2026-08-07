# 🚀 DEPLOYMENT CHECKLIST: HOJE!

**Status:** 🔴 CRÍTICO - Site no ar com monetização  
**Timeline:** Próximas 4 horas  
**Objetivo:** v1.0.0 ao vivo com Quick Wins + Payment Core  

---

## ✅ O QUE JÁ TÁ PRONTO

- [x] Rate limiting (src/lib/rate-limit.ts)
- [x] MP token refresh automático (src/lib/mercado-pago-tokens.ts)
- [x] SQL migration payment core (supabase/migrations/0011_payment_processing_core.sql)
- [x] API endpoint /initiate (src/app/api/monetization/payments/initiate.ts)
- [x] Webhook /mercado-pago (src/app/api/webhooks/mercado-pago.ts)
- [x] Componente Selo Segurança (src/components/checkout/security-badge.tsx)
- [x] Componente Progress Bar (src/components/checkout/payment-progress.tsx)
- [x] Componente "Seja o Primeiro" (src/components/projects/empty-state-cta.tsx)
- [x] Helper remover "NOVO" badge (src/components/navigation/has-new-badge.ts)

---

## ⏳ O QUE FAZER AGORA (Próximas 2 horas)

### 1. Integrar componentes nas páginas
```
app/(public)/projects/page.tsx → adicionar EmptyStateCTA
app/(public)/projects/[id]/page.tsx → adicionar SecurityBadge + PaymentProgress
components/navigation/navbar.tsx → usar shouldShowBadgeCached() pra "NOVO"
```

### 2. Criar endpoint PIX simples (já tá nos componentes)
```
É basicamente a mesma lógica de initiate.ts
Mercado Pago trata o resto
```

### 3. Aplicar rate limiting nas rotas públicas
```
src/app/api/leads/route.ts → add rate limit
src/app/api/contact/route.ts → add rate limit
```

### 4. Deploy migrations Supabase
```bash
supabase migration up
# Ou via UI do Supabase
```

### 5. Variáveis de ambiente
```
MERCADO_PAGO_ACCESS_TOKEN=seu_token
MERCADO_PAGO_CLIENT_SECRET=seu_secret
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret
NEXT_PUBLIC_URL=https://seu_dominio
UPSTASH_REDIS_REST_URL=seu_redis
UPSTASH_REDIS_REST_TOKEN=seu_token
```

---

## 🎯 PRIORIDADE ABSOLUTA (Hoje)

### TIER 0: Não sai do chão sem isso
- [ ] Domínio apontando certo (prestacerto.com.br)
- [ ] Dados fake removidos do banco
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase migrations rodadas
- [ ] MP tokens configurados

### TIER 1: Monetização visível (hoje)
- [ ] Quick Wins componentes integrados (4h)
- [ ] Taxa de segurança aplicada (1h)
- [ ] Rate limiting funcionando (1h)

### TIER 2: Funcional (amanhã 8am)
- [ ] PIX funcionando
- [ ] Salvar cartão
- [ ] Webhook testado com sandbox MP

---

## 🚀 DEPLOY STEPS (Exatas nessa ordem)

### 1. Local tests (30min)
```bash
# Testar componentes
npm run dev

# Testar rate limit (enviar 10 requests)
curl http://localhost:3000/api/contact -X POST -d '{"name":"test"}' -H 'Content-Type: application/json'

# Testar MP tokens
# Criar um freelancer, chamar getValidMPAccessToken()
```

### 2. Supabase migration (5min)
```bash
# Rodar migration 0011
supabase db push

# Verificar:
# - Tabelas criadas
# - RLS policies ativas
# - Indexes criados
```

### 3. Vercel deploy (2min)
```bash
git add .
git commit -m "Feat: Payment core + quick wins monetization"
git push origin main
# Vercel auto-deploys
```

### 4. Mercado Pago config (10min)
```
1. Ir em Dashboard MP
2. Webhook settings:
   URL: https://seu_dominio/api/webhooks/mercado-pago
   Events: payment (approved, declined, chargedback)
3. Copy webhook secret para .env
4. Test webhook: trigger fake payment no sandbox
```

### 5. Smoke test (15min)
```
1. Visitar https://site
2. Ir em /services → ver "Seja o Primeiro"
3. Ir em /projects → ver componentes
4. Testar checkout → ver selo segurança + progress bar
5. Testar rate limit → mandar POST 10x rápido → deve bloquear
```

---

## 📋 CHECKLIST FINAL (Antes de mergear)

- [ ] Sem console.error nos componentes
- [ ] Sem TypeScript errors
- [ ] Sem warnings no build
- [ ] Rate limit testado
- [ ] MP webhook signature validada
- [ ] RLS policies verificadas
- [ ] Idempotency funcionando
- [ ] Audit log sendo registrado
- [ ] Environment variables documentadas
- [ ] README atualizado

---

## 🎬 ORDEM EXATA DE EXECUÇÃO (AGORA!)

```
T+0min:   Começar aqui
T+15min:  Componentes integrados + rate limit aplicado
T+30min:  Local tests passando
T+45min:  Migrations rodadas no Supabase
T+50min:  Deploy Vercel
T+55min:  MP webhook configurado
T+70min:  Smoke tests passando
T+75min:  SITE AO VIVO ✅
```

---

## 💪 VOCÊ CONSEGUE!

4 horas. 75 linhas de código extra. Site ao vivo com monetização.

**VAMO LÁ!** 🚀

