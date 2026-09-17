# FASE 4 - Community Products Setup

**Data:** 17 de setembro de 2026
**Status:** Código pronto para checkout links

## O que foi implementado

### 1. Estrutura de dados dos 7 produtos + CERTO PREMIUM
- **arquivo:** `src/lib/community-products-data.ts`
- Todos os 8 produtos definidos com:
  - Preços (em BRL)
  - Descrições
  - Features listadas
  - Público-alvo
  - Status (live/beta)
  - Dashboards
  - APIs

### 2. Página pública de produtos
- **URL:** `/products`
- Lista todos os 8 produtos com grid visual
- Cada produto mostra:
  - Ícone, nome, preço
  - Features principais
  - CTA "Assinar" ou "Acessar"
  - Status (Live, Beta, Coming Soon)

### 3. Landing page individual por produto
- **URL:** `/products/[slug]`
- Estática gerada para todos os produtos
- Apresentação completa com:
  - Hero section com preço
  - Lista de features
  - FAQ
  - CTA de checkout

### 4. Dashboards para cada produto
- `/dashboard/academy`
- `/dashboard/templates`
- `/dashboard/invoice`
- `/dashboard/cold-email`
- `/dashboard/tax` (já existente, mantido)
- `/dashboard/destaque`
- `/dashboard/candidato`
- `/dashboard/certo-premium` (suite com links para outros)

### 5. API de produtos
- **Endpoint:** `GET /api/products`
- Retorna lista completa com checkout URLs
- Filtro por status: `?status=live|beta|coming-soon`
- Busca por ID: `?id=academy`

## PRÓXIMAS ETAPAS - Você faz no Assinify

### 1. Criar os produtos no Assinify

Para cada produto, acesse https://pay.assiny.com.br e crie um novo produto:

#### Academy
- Nome: `Academy`
- Preço: `R$ 297,00`
- Tipo: One-time payment
- Frequência: N/A (único)

#### Templates
- Nome: `Templates`
- Preço: `R$ 29,90`
- Tipo: Monthly subscription
- Frequência: Mensal

#### Invoice
- Nome: `Invoice`
- Preço: `R$ 19,90`
- Tipo: Monthly subscription
- Frequência: Mensal

#### Cold Email
- Nome: `Cold Email`
- Preço: `R$ 79,90`
- Tipo: Monthly subscription
- Frequência: Mensal

#### Tax (já existe?)
- Nome: `Tax`
- Preço: `R$ 49,90`
- Tipo: Monthly subscription
- Frequência: Mensal

#### Destaque
- Nome: `Destaque`
- Preço: `R$ 99,90`
- Tipo: Monthly subscription
- Frequência: Mensal

#### Candidato
- Nome: `Candidato`
- Preço: `Grátis` (Free tier)
- Tipo: Free registration

#### Certo Premium
- Nome: `Certo Premium`
- Preço: `R$ 199,90`
- Tipo: Monthly subscription
- Frequência: Mensal

### 2. Copiar os links de checkout

Para cada produto pago, o Assinify fornecerá um link como:
```
https://pay.assiny.com.br/xxxx/node/yyyy
```

Anote todos os 7 links de checkout (Academy, Templates, Invoice, Cold Email, Tax, Destaque, Certo Premium)

### 3. Adicionar os links ao projeto

Adicione as env vars ao `.env.local`:

```env
# Assinify Checkout URLs - FASE 4
NEXT_PUBLIC_ASSINIFY_CHECKOUT_ACADEMY=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_TEMPLATES=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_INVOICE=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_COLD_EMAIL=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_TAX=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_DESTAQUE=https://pay.assiny.com.br/...
NEXT_PUBLIC_ASSINIFY_CHECKOUT_CERTO_PREMIUM=https://pay.assiny.com.br/...
```

### 4. Testar o fluxo de checkout

1. Acesse `/products`
2. Clique em um produto
3. Deve redirecionar para o Assinify com o link correto
4. Complete o pagamento de teste
5. O webhook em `/api/webhooks/assinify` processará a assinatura

## Estrutura de arquivos criados

```
src/lib/community-products-data.ts           ← Dados dos 8 produtos
src/components/community-products-grid.tsx   ← Grid de produtos
src/components/product-dashboard.tsx         ← Template de dashboard
src/app/(public)/products/page.tsx           ← Página de produtos
src/app/(public)/products/[slug]/page.tsx    ← Landing individual
src/app/api/products/route.ts                ← API de produtos
src/app/dashboard/academy/page.tsx
src/app/dashboard/templates/page.tsx
src/app/dashboard/invoice/page.tsx
src/app/dashboard/cold-email/page.tsx
src/app/dashboard/destaque/page.tsx
src/app/dashboard/candidato/page.tsx
src/app/dashboard/certo-premium/page.tsx
src/app/dashboard/products/layout.tsx
```

## URLs ao vivo

- **Grid de produtos:** `https://prestacerto.com.br/products`
- **Produto individual:** `https://prestacerto.com.br/products/academy`
- **Dashboard:** `https://prestacerto.com.br/dashboard/academy`
- **API:** `https://prestacerto.com.br/api/products`

## Checklist para deploy

- [ ] Gerar links de checkout no Assinify para todos 7 produtos + premium
- [ ] Adicionar env vars ao `.env.local`
- [ ] Testar fluxo em staging: `/products` → checkout → webhook
- [ ] Configurar webhook do Assinify apontando para `/api/webhooks/assinify`
- [ ] Validar que o secret está em `ASSINY_WEBHOOK_SECRET`
- [ ] Deploy para produção
- [ ] Testar pagamento real em `prod`

## Notas importantes

1. **Tax** já tem um dashboard funcional em `/dashboard/tax` - mantido como estava
2. **Candidato** é free - não precisa de link de checkout
3. **Certo Premium** inclui todos os outros - considere desconto ou bundle no Assinify
4. **Webhook** já está pronto em `/api/webhooks/assinify` - ele ativa o plan quando o pagamento é confirmado
5. **Analytics** - Use a API `/api/products` para listar todos os produtos com checkout URLs dinamicamente

## Próximas melhorias (FASE 5)

- [ ] Integrações com Stripe/PayPal além de Assinify
- [ ] Trial periods para cada produto
- [ ] Upgrade/downgrade entre planos
- [ ] Métricas de uso por produto no dashboard
- [ ] Chat de suporte integrado no dashboard
- [ ] Mobile app para iPhone/Android
