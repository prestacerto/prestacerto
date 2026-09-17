# 🚀 CERTO ECOSYSTEM - DEPLOYMENT CHECKLIST

## PRÉ-DEPLOYMENT (HOJE — Cadu)

### PASSO 1: Criar 27 Produtos no Assinify (60 min)
- [ ] Acessar https://admin.assiny.com.br/login
- [ ] Criar produto "Certo Match" (R$ 2,90 - por proposta)
- [ ] Criar produto "Certo Preço" (R$ 14,90 - mensal)
- [ ] Criar produto "Certo Timing" (R$ 9,90 - mensal)
- [ ] Continuar com Fase 2 (8 produtos)
- [ ] Continuar com Fase 3 (8 produtos)
- [ ] Continuar com Fase 4 (8 produtos)

**Template de Descrição:** Ver `CERTO_ECOSYSTEM_MASTER_2026-09-17.md`

### PASSO 2: Copiar Links de Checkout (15 min)
Para cada produto, copiar o link de checkout que Assinify fornece.

Exemplo:
```
Certo Match: https://assinify.com.br/checkout/certo-match?session=abc123
Certo Preço: https://assinify.com.br/checkout/certo-preco?session=xyz789
... (total 27)
```

### PASSO 3: Criar .env.local com Links (15 min)
```bash
# .env.local

# Assinify Webhook
ASSINIFY_WEBHOOK_SECRET=seu_token_super_secreto

# FASE 1
NEXT_PUBLIC_ASSINIFY_MATCH=https://assinify.com.br/checkout/certo-match?session=...
NEXT_PUBLIC_ASSINIFY_PRECO=https://assinify.com.br/checkout/certo-preco?session=...
NEXT_PUBLIC_ASSINIFY_TIMING=https://assinify.com.br/checkout/certo-timing?session=...

# FASE 2 (8 produtos)
NEXT_PUBLIC_ASSINIFY_DASHBOARD_IA=...
NEXT_PUBLIC_ASSINIFY_INSIGHTS=...
... (etc)

# FASE 3 (8 produtos)
NEXT_PUBLIC_ASSINIFY_ANALYTICS_CLIENTE=...
... (etc)

# FASE 4 (8 produtos)
NEXT_PUBLIC_ASSINIFY_ACADEMY=...
NEXT_PUBLIC_ASSINIFY_TEMPLATES=...
... (etc)
```

### PASSO 4: Configurar Webhook no Assinify (10 min)
1. Ir para Settings → Webhooks
2. Adicionar webhook URL: `https://prestacerto.com.br/api/webhooks/assinify`
3. Selecionar eventos:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `payment.completed`
   - `payment.failed`
4. Copiar webhook secret e adicionar a `.env.local` (ASSINIFY_WEBHOOK_SECRET)

---

## DEPLOYMENT (DEPOIS)

### PASSO 5: Validar Localmente (30 min)
```bash
# Terminal 1: Rodando servidor de desenvolvimento
npm run dev

# Terminal 2: Testar webhook
curl -X POST http://localhost:3000/api/webhooks/assinify \
  -H "Content-Type: application/json" \
  -H "x-assinify-signature: seu_webhook_secret" \
  -d '{
    "id": "test-123",
    "event": "subscription.created",
    "timestamp": 1234567890,
    "data": {
      "product_id": "match",
      "customer_id": "user-123",
      "customer_email": "test@example.com",
      "amount": 2900,
      "status": "active"
    }
  }'
```

### PASSO 6: Testar Links Assinify
- [ ] Ir para http://localhost:3000/dashboard/products
- [ ] Clicar em cada produto → deve redirecionar para Assinify
- [ ] Verificar que links estão corretos

### PASSO 7: Rodar Testes
```bash
npm test
# Esperado: 13+ testes PASS
```

### PASSO 8: Build para Produção
```bash
npm run build
# Verificar que build completa sem erros
```

### PASSO 9: Deploy
```bash
# Opção 1: Vercel
vercel deploy --prod

# Opção 2: Heroku
git push heroku main

# Opção 3: Self-hosted
git push
# (configure CI/CD conforme seu setup)
```

### PASSO 10: Validar em Produção
- [ ] Acessar https://prestacerto.com.br/dashboard/products
- [ ] Clicar em cada produto → Assinify checkout
- [ ] Testar pagamento com cartão de teste Assinify
- [ ] Verificar webhook foi chamado (check logs)
- [ ] Verificar subscription foi criada no banco

### PASSO 11: Monitorar
- [ ] Dashboard admin: https://prestacerto.com.br/admin/analytics
- [ ] Logs de webhook em tempo real
- [ ] Erros de pagamento
- [ ] Taxa de conversão por produto

---

## ROLLOUT STRATEGY

### SEMANA 1-2: Fase 1 (3 produtos)
- Lançar Match, Preço, Timing
- Monitorar conversão
- Feedback de usuários
- Alvo: R$ 69k/mês

### SEMANA 3-6: Fase 2 (8 produtos)
- Lançar inteligência (Dashboard, Insights, Badge, etc)
- Cross-sell para usuários Fase 1
- Alvo: +R$ 309k/mês

### SEMANA 7-10: Fase 3 (8 produtos)
- Lançar client tools (Analytics, Contrato, QA, VIP)
- Bundle de 3+ produtos = desconto
- Alvo: +R$ 1.828k/mês

### SEMANA 11-14: Fase 4 (8 produtos)
- Lançar comunidade (Academy, Templates, Cold Email, Premium)
- Tier premium com benefícios
- Alvo: +R$ 1.164k/mês

**TOTAL:** R$ 3.371k/mês (conservador)

---

## TROUBLESHOOTING

### Webhook não está sendo chamado
1. Verificar webhook URL em Assinify settings
2. Verificar ASSINIFY_WEBHOOK_SECRET está correto
3. Verificar logs: `npm run dev` e fazer POST test

### Link Assinify retorna 404
1. Verificar link em `.env.local`
2. Verificar produto foi criado em Assinify
3. Verificar sessão não expirou

### Testes falhando
1. Verificar banco de dados está rodando
2. Verificar Supabase variables em `.env.local`
3. Rodar: `npm test -- --passWithNoTests`

---

## OBSERVAÇÕES IMPORTANTES

⚠️ **NÃO FAZER:**
- Não delete produtos do Assinify depois de lançados (quebra links)
- Não mude webhooks sem avisar developers
- Não exporte links para repositório público

✅ **FAZER:**
- Teste tudo localmente antes de produção
- Monitore erros de pagamento em tempo real
- Mantenha backups de links Assinify

---

## SUPORTE

**Docs:** `CERTO_ECOSYSTEM_MASTER_2026-09-17.md`  
**Webhook:** `/api/webhooks/assinify` (POST)  
**Analytics:** `/admin/analytics`  
**Config:** `src/lib/certo-ecosystem/products-config.ts`  

---

**Status:** ✅ Pronto para deployment  
**Data:** 17 de Setembro de 2026  
**Next:** Aguardando links Assinify (seu turno!)
