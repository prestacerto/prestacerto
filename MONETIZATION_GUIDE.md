# 💰 MONETIZATION FEATURES — GUIA DE INTEGRAÇÃO

## STATUS: ✅ ESTRUTURA PRONTA, FALTAM INTEGRAÇÕES MP

Todas as 3 features estão **estruturadas e prontas**. Faltam só as integrações com **Mercado Pago Brick**.

---

## 🎯 3 FEATURES IMPLEMENTADAS

### 1. **Destaque de Projeto** (Cliente paga)
📁 **Componentes:**
- `src/components/monetization/highlight-project-modal.tsx` — Modal com opções de duração
- Preços: R$ 29,90 (7 dias) | R$ 49,90 (14 dias) | R$ 79,90 (30 dias)

🔌 **API:**
- `src/app/api/monetization/highlight/route.ts` — POST pra criar preference MP

📊 **Schema:**
- `projects.is_featured` — boolean
- `projects.featured_until` — Timestamp de expiração

---

### 2. **Perfil Verificado** (Freelancer paga)
📁 **Componentes:**
- `src/components/monetization/verification-badge.tsx` — Button + Modal + Display badge
- Preço: R$ 9,90 (válido 1 ano)

🔌 **API:**
- `src/app/api/monetization/verify/route.ts` — POST pra criar preference MP

📊 **Schema:**
- `profiles.is_verified` — boolean
- `profiles.verified_at` — Timestamp

---

### 3. **Antecipação de Pagamento** (Freelancer paga)
📁 **Componentes:**
- `src/components/monetization/early-payment-button.tsx` — Button + Modal com cálculo de taxa
- Taxa: 2.99% do valor

🔌 **API:**
- `src/app/api/monetization/early-payment/route.ts` — POST pra criar preference MP

📊 **Schema:**
- `early_payment_requests.proposal_id`
- `early_payment_requests.freelancer_id`
- `early_payment_requests.original_amount`
- `early_payment_requests.early_payment_fee`
- `early_payment_requests.net_amount`
- `early_payment_requests.status` — pending | captured | failed

---

## 🔌 TODO: INTEGRAÇÃO MERCADO PAGO

Cada API route tem **comentários TODO** mostrando exatamente o que fazer:

### Passo 1: Criar Preference no MP
```typescript
// No route handler, chamar:
const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    items: [{
      title: "Destacar Projeto",
      quantity: 1,
      unit_price: 29.90
    }],
    back_urls: {
      success: `${NEXT_PUBLIC_SITE_URL}/dashboard/projects/${projectId}`,
      failure: `${NEXT_PUBLIC_SITE_URL}/dashboard/projects/${projectId}`,
    },
    notification_url: `${NEXT_PUBLIC_SITE_URL}/api/monetization/webhook`,
    auto_return: "approved"
  })
});

const preference = await response.json();
return NextResponse.json({ preferenceId: preference.id });
```

### Passo 2: Renderizar Card Brick no Frontend
```typescript
// No componente, após sucesso da API:
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

initMercadoPago(NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);

<CardPayment
  initialization={{ amount: 29.90, preferenceId }}
  onSubmit={async (formData) => {
    // Chamar /api/monetization/webhook com dados do pagamento
  }}
/>
```

### Passo 3: Webhook pra Confirmar
```typescript
// Criar novo route: src/app/api/monetization/webhook/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  if (data.type === "payment" && data.data.status === "approved") {
    // Chamar addProjectHighlight(projectId, days, paymentId)
  }
}
```

---

## 📋 CHECKLIST DE INTEGRAÇÃO

- [ ] Adicionar MERCADO_PAGO_ACCESS_TOKEN em .env
- [ ] Criar route `/api/monetization/webhook`
- [ ] Integrar Card Brick em `HighlightProjectModal`
- [ ] Integrar Card Brick em `VerificationBadgeButton`
- [ ] Integrar Card Brick em `EarlyPaymentButton`
- [ ] Testar fluxo completo (checkout → webhook → feature ativada)
- [ ] Adicionar campo `is_featured` em projects filter/sort
- [ ] Adicionar badge visual em ServiceCard quando `is_verified`
- [ ] Testar antecipação de pagamento (captura automática MP)

---

## 🚀 COMO USAR NO APP

### Integrar no Dashboard Projetos:
```tsx
// src/app/(protected)/dashboard/projects/[id]/page.tsx

import { HighlightProjectModal } from "@/components/monetization/highlight-project-modal";

export default function ProjectPage({ params }) {
  const [highlightOpen, setHighlightOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setHighlightOpen(true)}>
        ⭐ Destacar Projeto
      </Button>
      
      <HighlightProjectModal
        projectId={params.id}
        open={highlightOpen}
        onOpenChange={setHighlightOpen}
      />
    </>
  );
}
```

### Integrar no ServiceCard (perfil freelancer):
```tsx
// src/components/services/service-card.tsx

import { VerificationBadgeButton, VerificationBadgeDisplay } from "@/components/monetization/verification-badge";

<div className="flex items-center gap-2">
  {isVerified ? (
    <VerificationBadgeDisplay />
  ) : (
    <VerificationBadgeButton freelancerId={freelancerId} />
  )}
</div>
```

---

## 💡 PRÓXIMOS PASSOS

1. **Configurar credenciais MP** em .env.local
2. **Integrar Brick em cada componente** (3 components)
3. **Criar webhook handler** pra confirmar pagamentos
4. **Testar fluxo completo** de ponta a ponta
5. **Adicionar logs/analytics** pra rastrear conversão
6. **Deploy com credenciais reais do MP**

---

**Arquivos criados:**
- ✅ `src/lib/firebase/monetization.ts` — Lógica Firestore
- ✅ `src/components/monetization/highlight-project-modal.tsx`
- ✅ `src/components/monetization/verification-badge.tsx`
- ✅ `src/components/monetization/early-payment-button.tsx`
- ✅ `src/app/api/monetization/highlight/route.ts`
- ✅ `src/app/api/monetization/verify/route.ts`
- ✅ `src/app/api/monetization/early-payment/route.ts`

**Todos:** comentários TODO em cada arquivo mostrando exatamente o que falta fazer com Mercado Pago.
