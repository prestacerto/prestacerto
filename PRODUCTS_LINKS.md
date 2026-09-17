# Links de Pagamento - Assinify

## CERTO MATCH
**Status**: ✅ LIVE

### Dashboards
- Dashboard de Produto: `/dashboard/products/match`

### Links de Pagamento
- **Compra Única (R$ 29,00)**: https://assinify.com.br/certo-match?price=2900&type=one-time
- **Assinatura Mensal (R$ 14,90/mês)**: https://assinify.com.br/certo-match?price=1490&type=monthly

### Descrição
IA que compara suas habilidades com projetos disponíveis e encontra as melhores oportunidades. Compatibilidade automática em tempo real.

---

## CERTO PREÇO
**Status**: ✅ LIVE

### Dashboards
- Dashboard de Produto: `/dashboard/products/preço`

### Links de Pagamento
- **Assinatura Mensal (R$ 14,90/mês)**: https://assinify.com.br/certo-preço?price=1490&type=monthly

### Descrição
Engine de preços com IA que recomenda o valor ideal para seus projetos baseado em tipo, complexidade e dados de mercado. Maximize sua rentabilidade.

### API
- Endpoint: `POST /api/products/preço`
- Body:
  ```json
  {
    "projectType": "desenvolvimento|design|marketing|consultoria|design-gráfico",
    "complexity": "baixa|média|alta"
  }
  ```
- Response:
  ```json
  {
    "recommendedPrice": 1500,
    "insights": {
      "competitorRange": {
        "min": 1200,
        "max": 1800
      }
    }
  }
  ```

---

## CERTO TIMING
**Status**: ✅ LIVE

### Dashboards
- Dashboard de Produto: `/dashboard/products/timing`

### Links de Pagamento
- **Assinatura Mensal (R$ 9,90/mês)**: https://assinify.com.br/certo-timing?price=990&type=monthly

### Descrição
Recomendações com IA sobre o melhor momento para publicar, lançar ou fazer promoção de seus projetos. Maximize o alcance e a conversão.

### API
- Endpoint: `POST /api/products/timing`
- Body:
  ```json
  {
    "projectType": "desenvolvimento|design|marketing|educação|consultoria",
    "targetAudience": "profissionais|estudantes|empreendedores|público-geral",
    "competitorActivity": "low|medium|high"
  }
  ```
- Response:
  ```json
  {
    "recommendation": {
      "bestDay": "Tuesday",
      "bestHour": "evening",
      "confidence": 0.87,
      "nextWindowDays": 3
    }
  }
  ```

---

## Página de Produtos
- URL: `/dashboard/products`
- Exibe todos os 3 produtos com opções de assinar/comprar

---

## Dados para Configuração no Assinify

Para cada produto, você precisa configurar no Assinify:

### CERTO MATCH
- **Nome do Produto**: Certo Match
- **Slug**: certo-match
- **Planos**:
  - One-Time: R$ 29,00 (code: `one-time-29`)
  - Monthly: R$ 14,90/mês (code: `monthly-14-90`)

### CERTO PREÇO
- **Nome do Produto**: Certo Preço
- **Slug**: certo-preço
- **Planos**:
  - Monthly: R$ 14,90/mês (code: `monthly-14-90`)

### CERTO TIMING
- **Nome do Produto**: Certo Timing
- **Slug**: certo-timing
- **Planos**:
  - Monthly: R$ 9,90/mês (code: `monthly-9-90`)

---

## Webhook Configuration

Para receber confirmações de pagamento, configure os webhooks no Assinify:

**URL Base de Webhooks**: `https://seu-dominio.com/api/subscriptions/{product-id}`

**Substituir {product-id} com**:
- `certo-match`
- `certo-preço`
- `certo-timing`

**Events a Habilitar**:
- subscription.paid
- subscription.cancelled
- payment.approved
- purchase.approved

---

## Como Testar

1. Acesse qualquer um dos dashboards:
   - https://seu-dominio.com/dashboard/products/match
   - https://seu-dominio.com/dashboard/products/preço
   - https://seu-dominio.com/dashboard/products/timing

2. Clique em "Assinar Agora" ou "Comprar Agora"

3. Você será redirecionado para o Assinify

4. Complete o pagamento

5. Será redirecionado de volta para o site

---

## Rastreamento de Uso

Cada ação nos produtos é rastreada em `certo_product_usage`:
- Cálculos de preço
- Análises de timing
- Acessos ao match

---

## Próximos Passos

1. Criar tabelas no banco de dados (ver ASSINIFY_SETUP.md)
2. Configurar variáveis de ambiente (.env)
3. Testar links de pagamento com Assinify
4. Configurar webhooks no Assinify
5. Fazer pagamento de teste em produção
