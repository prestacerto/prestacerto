# FASE 3: Client Products (8 produtos cliente) — 17/09/2026

## Visão Geral

Implementação de 8 produtos pagos para **clientes** (diferente dos planos para freelancers).
Cada produto possui:
- **API própria** em `/api/client-products/{slug}`
- **Dashboard público** em `/client-dashboard/{slug}`
- **Link de checkout Assinify** com integração automática

## 8 Produtos Client Tools

### 1. Currículo IA (Grátis)
- **ID**: `curriculo`
- **Modelo**: Free
- **Preço**: Grátis
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_CURRICULO`
- **Features**:
  - Geração automática de currículo
  - Múltiplos templates
  - Export PDF/DOCX
  - Otimização para ATS
  - Sugestões de IA

### 2. Escrow Seguro (5% comissão)
- **ID**: `escrow`
- **Modelo**: Commission-based
- **Preço**: 5% por transação
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_ESCROW`
- **Features**:
  - Transações seguras entre partes
  - Proteção de ambos os lados
  - Liberação condicional
  - Suporte 24/7
  - Taxa de 5% por transação
  - Sem taxa mínima

### 3. Milestones (2% comissão)
- **ID**: `milestones`
- **Modelo**: Commission-based
- **Preço**: 2% por milestone
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_MILESTONES`
- **Features**:
  - Criação de milestones automático
  - Rastreamento de progresso
  - Alertas inteligentes
  - Relatórios detalhados
  - Taxa de 2% por milestone
  - Integração com escrow

### 4. Analytics Cliente (R$ 49,90/mês)
- **ID**: `analytics-cliente`
- **Modelo**: Subscription
- **Preço**: R$ 49,90/mês
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_ANALYTICS_CLIENTE`
- **Features**:
  - Dashboard em tempo real
  - Métricas de projeto
  - ROI por projeto
  - Comparativo com mercado
  - Exportação de relatórios
  - API de dados
  - Alertas automáticos

### 5. Contrato IA (R$ 24,90/mês)
- **ID**: `contrato-ia`
- **Modelo**: Subscription
- **Preço**: R$ 24,90/mês
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_CONTRATO_IA`
- **Features**:
  - Geração automática de contratos
  - Templates customizáveis
  - Análise de cláusulas
  - Revisão por IA
  - Assinatura eletrônica
  - Histórico de versões
  - Suporte jurídico

### 6. QA Automático (R$ 34,90/mês)
- **ID**: `qa-automatico`
- **Modelo**: Subscription
- **Preço**: R$ 34,90/mês
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_QA_AUTOMATICO`
- **Features**:
  - Testes automáticos
  - Cobertura de código
  - Integração CI/CD
  - Relatórios de bugs
  - Performance monitoring
  - Sugestões de melhoria
  - Histórico de execuções

### 7. VIP Network (R$ 999,90/mês)
- **ID**: `vip-network`
- **Modelo**: Subscription (Premium)
- **Preço**: R$ 999,90/mês
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_VIP_NETWORK`
- **Features**:
  - Acesso à rede VIP exclusiva
  - Encontros mensais
  - Masterclasses
  - Consultoria 1-1
  - Oportunidades de investimento
  - Due diligence support
  - Personal account manager
  - Priority support 24/7

### 8. Community Pro (R$ 39,90/mês)
- **ID**: `community`
- **Modelo**: Subscription
- **Preço**: R$ 39,90/mês
- **Checkout URL env**: `NEXT_PUBLIC_ASSINY_CHECKOUT_COMMUNITY`
- **Features**:
  - Acesso à comunidade
  - Fóruns de discussão
  - Eventos mensais
  - Networking
  - Conteúdo exclusivo
  - Biblioteca de recursos
  - Certificados de participação
  - Job board com prioridade

## Arquitetura Implementada

### Estrutura de Arquivos

```
src/
├── lib/
│   └── client-products.ts          # Definição de todos os 8 produtos
├── app/
│   ├── client-products/
│   │   └── page.tsx                # Página de listagem
│   └── api/
│       ├── payments/
│       │   └── client-checkout/
│       │       └── route.ts        # API de checkout
│       └── client-products/
│           └── list/
│               └── route.ts        # API de listagem
├── components/
│   └── client-products-hub.tsx     # Componente de listagem
└── app/
    └── client-dashboard/           # Dashboards (para implementar)
        ├── curriculo/
        ├── escrow/
        ├── milestones/
        ├── analytics-cliente/
        ├── contrato-ia/
        ├── qa-automatico/
        ├── vip-network/
        └── community/
```

## APIs Disponíveis

### 1. Listar Todos os Produtos
```bash
GET /api/client-products/list

Response:
{
  "products": [
    {
      "id": "curriculo",
      "name": "Currículo IA",
      "slug": "curriculo",
      "emoji": "📄",
      "description": "...",
      "pricing": {
        "model": "free",
        "monthlyPrice": null,
        "commissionRate": null,
        "currency": "BRL",
        "formatted": "Grátis"
      },
      "features": [...],
      "dashboardRoute": "/client-dashboard/curriculo",
      "tier": "free",
      "hasCheckout": false,
      "comingSoon": false
    },
    ...
  ],
  "summary": {
    "totalProducts": 8,
    "monthlyProducts": 6,
    "commissionProducts": 2,
    "freeProducts": 1,
    "estimatedMRR": 1248.70
  }
}
```

### 2. Gerar Link de Checkout
```bash
POST /api/payments/client-checkout
Content-Type: application/json

{
  "product_id": "analytics-cliente"
}

Response:
{
  "url": "https://pay.assiny.com.br/{account_id}/node/{offer_id}?client_product=analytics-cliente&user_id={uuid}&email={email}",
  "product": {
    "id": "analytics-cliente",
    "name": "Analytics Cliente",
    "price": 49.90,
    "model": "monthly"
  }
}
```

## Integração com Assinify

### URLs de Checkout

Cada produto cliente tem uma variável de ambiente para seu URL de checkout:

```env
# Produtos com Comissão
NEXT_PUBLIC_ASSINY_CHECKOUT_ESCROW=https://pay.assiny.com.br/{account_id}/node/{offer_id}
NEXT_PUBLIC_ASSINY_CHECKOUT_MILESTONES=https://pay.assiny.com.br/{account_id}/node/{offer_id}

# Produtos Mensais (R$ 49,90, R$ 24,90, R$ 34,90)
NEXT_PUBLIC_ASSINY_CHECKOUT_ANALYTICS_CLIENTE=https://pay.assiny.com.br/{account_id}/node/{offer_id}
NEXT_PUBLIC_ASSINY_CHECKOUT_CONTRATO_IA=https://pay.assiny.com.br/{account_id}/node/{offer_id}
NEXT_PUBLIC_ASSINY_CHECKOUT_QA_AUTOMATICO=https://pay.assiny.com.br/{account_id}/node/{offer_id}

# Produtos Premium (R$ 999,90, R$ 39,90)
NEXT_PUBLIC_ASSINY_CHECKOUT_VIP_NETWORK=https://pay.assiny.com.br/{account_id}/node/{offer_id}
NEXT_PUBLIC_ASSINY_CHECKOUT_COMMUNITY=https://pay.assiny.com.br/{account_id}/node/{offer_id}
```

### Como Gerar Links no Assinify Admin

1. **Acessar painel**: https://admin.assiny.com.br/login
2. **Organização**: SIMA MIDIAS LTDA
3. **Projeto**: Sima Midias
4. Para cada produto:
   - Criar novo "Offer" (oferta)
   - Configurar nome (ex: "Currículo IA")
   - Configurar preço e recorrência
   - Copiar link do checkout público
   - Colar em `NEXT_PUBLIC_ASSINY_CHECKOUT_{PRODUTO}`

### Padrão de URL Assinify

```
https://pay.assiny.com.br/{account_id}/node/{offer_id}

Exemplo:
https://pay.assiny.com.br/ba2d4a/node/rtlXli
```

### Webhook Configuration

- **Endpoint**: `https://prestacerto.com.br/api/webhooks/assiny`
- **Header**: `x-assiny-token` (configurado em `ASSINY_WEBHOOK_SECRET`)
- **Eventos suportados**:
  - `subscription.paid` (ativar acesso)
  - `subscription.cancelled` (desativar acesso)
  - `payment.refunded` (reverter acesso)

## MRR Potencial FASE 3

| Produto | Modelo | Valor | Potencial MRR |
|---------|--------|-------|--------------|
| Currículo | Free | - | R$ 0 |
| Escrow | Comissão 5% | 5% | R$ 0* |
| Milestones | Comissão 2% | 2% | R$ 0* |
| Analytics Cliente | Mensal | R$ 49,90 | R$ 49,90 |
| Contrato IA | Mensal | R$ 24,90 | R$ 24,90 |
| QA Automático | Mensal | R$ 34,90 | R$ 34,90 |
| VIP Network | Mensal | R$ 999,90 | R$ 999,90 |
| Community | Mensal | R$ 39,90 | R$ 39,90 |
| **TOTAL** | | | **R$ 1.248,70/mês** |

*Comissão calculada sobre volume de transações

## Próximas Etapas

### 1. Criar Ofertas no Assinify (Cadu)
- [ ] Escrow (5% comissão)
- [ ] Milestones (2% comissão)
- [ ] Analytics Cliente (R$ 49,90/mês)
- [ ] Contrato IA (R$ 24,90/mês)
- [ ] QA Automático (R$ 34,90/mês)
- [ ] VIP Network (R$ 999,90/mês)
- [ ] Community (R$ 39,90/mês)

### 2. Configurar Variáveis de Ambiente
```env
# Adicionar em .env.local e Vercel
NEXT_PUBLIC_ASSINY_CHECKOUT_ESCROW=...
NEXT_PUBLIC_ASSINY_CHECKOUT_MILESTONES=...
NEXT_PUBLIC_ASSINY_CHECKOUT_ANALYTICS_CLIENTE=...
NEXT_PUBLIC_ASSINY_CHECKOUT_CONTRATO_IA=...
NEXT_PUBLIC_ASSINY_CHECKOUT_QA_AUTOMATICO=...
NEXT_PUBLIC_ASSINY_CHECKOUT_VIP_NETWORK=...
NEXT_PUBLIC_ASSINY_CHECKOUT_COMMUNITY=...
```

### 3. Implementar Dashboards
Para cada produto em `/client-dashboard/{slug}`:
- [ ] Currículo IA
- [ ] Escrow
- [ ] Milestones
- [ ] Analytics Cliente
- [ ] Contrato IA
- [ ] QA Automático
- [ ] VIP Network
- [ ] Community

### 4. Implementar APIs de Produto
Para cada produto em `/api/client-products/{slug}`:
- [ ] GET: Obter dados do usuário
- [ ] POST: Atualizar/Criar dados
- [ ] DELETE: Remover dados

### 5. Testes
- [ ] Listar todos os produtos (API)
- [ ] Gerar links de checkout para cada produto
- [ ] Testar fluxo de pagamento no Assinify
- [ ] Validar webhooks de aprovação/cancelamento

## Páginas Públicas

- `GET /client-products` - Listagem de todos os produtos
- `GET /api/client-products/list` - API de listagem (JSON)

## Status de Implementação

| Componente | Status | Nota |
|-----------|--------|------|
| Estrutura de dados | ✅ COMPLETO | `client-products.ts` |
| API de listagem | ✅ COMPLETO | `/api/client-products/list` |
| API de checkout | ✅ COMPLETO | `/api/payments/client-checkout` |
| Componente de listagem | ✅ COMPLETO | `client-products-hub.tsx` |
| Página de produtos | ✅ COMPLETO | `/client-products` |
| Dashboards | ⏳ PENDENTE | 8 dashboards para implementar |
| Links Assinify | ⏳ PENDENTE | Criar ofertas no painel |
| Webhooks | ✅ EXISTENTE | Reutilizar `/api/webhooks/assiny` |

## Arquivos Criados

1. `src/lib/client-products.ts` - Definição dos 8 produtos
2. `src/app/api/payments/client-checkout/route.ts` - API de checkout
3. `src/app/api/client-products/list/route.ts` - API de listagem
4. `src/components/client-products-hub.tsx` - Componente UI
5. `src/app/client-products/page.tsx` - Página de listagem

## Consumo de API (Exemplo Frontend)

```typescript
// Listar produtos
const response = await fetch('/api/client-products/list');
const { products, summary } = await response.json();

// Gerar link de checkout
const checkoutResponse = await fetch('/api/payments/client-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product_id: 'analytics-cliente' })
});
const { url } = await checkoutResponse.json();
window.location.href = url; // Redireciona para Assinify
```

## Observações

- Produtos grátis (Currículo) não requerem checkout
- Produtos com comissão (Escrow, Milestones) não têm MRR fixo
- Produtos mensais têm MRR previsível
- VIP Network é o produto premium com maior potencial
- Todos os URLs de checkout usam o padrão Assinify
- Webhooks reutilizam infraestrutura existente

## Próximo Passo: Cadu

**Ir para https://admin.assiny.com.br** e criar as 7 ofertas faltando (Currículo já é free).

Copiar cada link do checkout e colar em `.env.local` nas variáveis correspondentes.
