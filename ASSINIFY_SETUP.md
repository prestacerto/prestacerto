# Assinify Integration - Setup & Payment Links

## Produtos Implementados

### 1. CERTO MATCH ✅
- **ID**: `certo-match`
- **Descrição**: IA que compara suas habilidades com projetos e encontra as melhores oportunidades
- **Planos**:
  - Pagamento Único: R$ 29,00
    - Link: `https://assinify.com.br/certo-match?price=2900&type=one-time`
  - Assinatura Mensal: R$ 14,90/mês
    - Link: `https://assinify.com.br/certo-match?price=1490&type=monthly`
- **Dashboard**: `/dashboard/products/match`
- **API**: `POST /api/products/match`

### 2. CERTO PREÇO ✅
- **ID**: `certo-preço`
- **Descrição**: Engine de preços com IA que recomenda o valor ideal para seus projetos
- **Planos**:
  - Assinatura Mensal: R$ 14,90/mês
    - Link: `https://assinify.com.br/certo-preço?price=1490&type=monthly`
- **Dashboard**: `/dashboard/products/preço`
- **API**: `POST /api/products/preço`
  - Body: `{ projectType, complexity, timeline?, marketData? }`
  - Response: `{ recommendedPrice, currency, insights }`

### 3. CERTO TIMING ✅
- **ID**: `certo-timing`
- **Descrição**: Recomendações com IA sobre o melhor momento para publicar seus projetos
- **Planos**:
  - Assinatura Mensal: R$ 9,90/mês
    - Link: `https://assinify.com.br/certo-timing?price=990&type=monthly`
- **Dashboard**: `/dashboard/products/timing`
- **API**: `POST /api/products/timing`
  - Body: `{ projectType, targetAudience, competitorActivity? }`
  - Response: `{ recommendation: { bestDay, bestHour, confidence } }`

---

## Setup do Assinify

### 1. Criar Contas de Produto no Assinify
Para cada produto, você precisa:

1. Acessar [assinify.com.br](https://assinify.com.br)
2. Criar um novo produto/plano:
   - **Nome**: "Certo Match", "Certo Preço", "Certo Timing"
   - **URL de Sucesso**: `https://seudominio.com/dashboard/payments/success`
   - **URL de Falha**: `https://seudominio.com/dashboard/payments/failure`
   - **Webhook URL**: `https://seudominio.com/api/subscriptions/{product-id}`

### 2. Configurar Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_ASSINIFY_WEBHOOK_SECRET=seu_webhook_secret
ASSINIFY_WEBHOOK_TOKEN=seu_webhook_token
```

### 3. Ativar Webhooks

No Assinify Dashboard:
- Events → Enable Webhooks
- Add Webhook URL para cada produto
- Selecionar eventos:
  - `subscription.paid`
  - `subscription.cancelled`
  - `payment.approved`

---

## URLs de Acesso dos Produtos

### CERTO MATCH
- Dashboard: https://seudominio.com/dashboard/products/match
- Comprar (One-Time): https://assinify.com.br/certo-match?price=2900&type=one-time
- Assinar (Monthly): https://assinify.com.br/certo-match?price=1490&type=monthly

### CERTO PREÇO
- Dashboard: https://seudominio.com/dashboard/products/preço
- Assinar (Monthly): https://assinify.com.br/certo-preço?price=1490&type=monthly

### CERTO TIMING
- Dashboard: https://seudominio.com/dashboard/products/timing
- Assinar (Monthly): https://assinify.com.br/certo-timing?price=990&type=monthly

---

## Banco de Dados - Tabelas Necessárias

### certo_subscriptions
```sql
CREATE TABLE certo_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  plan TEXT NOT NULL, -- 'one-time' | 'monthly'
  status TEXT NOT NULL, -- 'active' | 'cancelled' | 'expired' | 'pending'
  subscription_id TEXT,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  renewal_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### certo_payment_events
```sql
CREATE TABLE certo_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subscription_id TEXT,
  payload JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### certo_product_usage
```sql
CREATE TABLE certo_product_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Testes

### Teste de API de Produto
```bash
curl -X POST https://seudominio.com/api/products/preço \
  -H "Content-Type: application/json" \
  -d '{
    "projectType": "desenvolvimento",
    "complexity": "alta"
  }'
```

### Teste de Webhook
```bash
curl -X POST https://seudominio.com/api/subscriptions/certo-match \
  -H "Content-Type: application/json" \
  -H "x-assiny-signature: seu_token" \
  -d '{
    "event": "subscription.paid",
    "email": "usuario@example.com",
    "subscriptionId": "sub_123",
    "plan": "monthly",
    "active": true
  }'
```

---

## Status de Implementação

- [x] APIs dos 3 produtos
- [x] Dashboards dos 3 produtos
- [x] Configuração de produtos
- [x] Hook de subscriptions
- [x] API de subscriptions com webhook
- [x] Links Assinify configurados
- [ ] Tabelas do banco de dados (executar SQL acima)
- [ ] Variáveis de ambiente (adicionar em .env.local)
- [ ] Testes em produção
