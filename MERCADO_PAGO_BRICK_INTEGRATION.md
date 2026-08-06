# 💳 MERCADO PAGO BRICK — INTEGRATION GUIDE

## O QUE É BRICK

Brick é o SDK de pagamentos do Mercado Pago. Oferece:
- **Card Payment** — Formulário de cartão pré-built
- **Wallet Brick** — Pagamentos com conta MP (boleto, pix, etc)
- **Payment Brick** — Checkout completo

**Vamos usar Card Payment** (mais simples, só cartão)

## SETUP (5 minutos)

### 1. Instalar SDK
```bash
npm install @mercadopago/sdk-react
```

### 2. Pegar credenciais
```
https://www.mercadopago.com/developers/panel/credentials
→ Public Key (TOKEN): COPY this
→ Access Token: COPY this

.env.local:
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=TEST-abcd1234...
MERCADO_PAGO_ACCESS_TOKEN=APP_abcd1234...
```

### 3. Setup Global (Fazer UMA VEZ)
```typescript
// src/app/layout.tsx (ou seu root layout)
import { MercadoPagoProvider } from '@mercadopago/sdk-react';

export default function RootLayout() {
  return (
    <MercadoPagoProvider publicKey={process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!}>
      {children}
    </MercadoPagoProvider>
  );
}
```

## IMPLEMENTAÇÃO — 3 COMPONENTES

### #1: Featured Listing Modal

**Arquivo:** `src/components/monetization/featured-listing-modal.tsx`

```typescript
'use client';

import { useState } from 'react';
import { CardPayment, useCardPaymentFormContext } from '@mercadopago/sdk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeaturedListingModalProps {
  freelancerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeaturedListingModal({ 
  freelancerId, 
  open, 
  onOpenChange 
}: FeaturedListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | null>(null);
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [paymentStep, setPaymentStep] = useState<'plan' | 'payment'>('plan');

  const plans = [
    {
      id: 'basic',
      name: 'Destaque Básico',
      price: 39.9,
      label: 'R$ 39,90',
      slots: '1 projeto',
    },
    {
      id: 'pro',
      name: 'Destaque Premium',
      price: 79.9,
      label: 'R$ 79,90',
      slots: '5 projetos',
    },
  ];

  async function handleSelectPlan(planId: 'basic' | 'pro') {
    setSelectedPlan(planId);
    setLoading(true);

    try {
      // 1️⃣ Criar preference no Mercado Pago
      const response = await fetch('/api/monetization/featured-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId,
          planType: planId === 'basic' ? 'featured_basic' : 'featured_pro',
        }),
      });

      const data = await response.json();
      setPreferenceId(data.preferenceId);
      setPaymentStep('payment'); // Mostrar Brick
    } catch (error) {
      console.error('Error creating preference:', error);
      toast.error('Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSubmit(formData: any) {
    setLoading(true);
    try {
      // 2️⃣ Enviar dados do cartão pro backend
      const response = await fetch('/api/monetization/featured-listing-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId,
          planType: selectedPlan === 'basic' ? 'featured_basic' : 'featured_pro',
          payment_method_id: formData.paymentMethodId,
          token: formData.token,
          issuer_id: formData.issuerId,
          installments: formData.installments,
          payer_email: formData.payer.email,
          payer_identification_type: formData.payer.identification?.type,
          payer_identification_number: formData.payer.identification?.number,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Pagamento confirmado! ✅');
        onOpenChange(false);
        setPaymentStep('plan');
        window.location.reload(); // Atualizar dashboard
      } else {
        toast.error(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {paymentStep === 'plan' ? (
          <>
            <DialogHeader>
              <DialogTitle>Destaque seu Perfil</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id as 'basic' | 'pro')}
                  disabled={loading}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-2 text-2xl font-bold">{plan.label}</div>
                  <div className="mt-1 text-sm text-gray-600">{plan.slots}</div>
                </button>
              ))}
            </div>

            <Button onClick={() => {}} disabled={!selectedPlan || loading}>
              {loading ? 'Carregando...' : 'Continuar'}
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirme seu pagamento</DialogTitle>
            </DialogHeader>

            {/* 3️⃣ Brick CardPayment renderiza aqui */}
            <CardPayment
              initialization={{
                amount: selectedPlan === 'basic' ? 39.9 : 79.9,
                preferenceId, // Opcional, mas recomendado
              }}
              onSubmit={handlePaymentSubmit}
              onError={(error) => {
                console.error('Brick error:', error);
                toast.error('Erro no formulário de pagamento');
              }}
              onReady={() => {
                console.log('Brick ready');
              }}
            />

            <Button
              variant="outline"
              onClick={() => setPaymentStep('plan')}
              disabled={loading}
            >
              Voltar
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### #2 & #3: Portfolio Premium (IDÊNTICO)

Copiar o mesmo código acima, mas:
- Trocar `/api/monetization/featured-listing` → `/api/monetization/portfolio-premium`
- Trocar `featured_basic` → `portfolio_standard`
- Trocar amounts (39.9, 79.9 mantém igual)

## BACKEND — API ROUTES

### Criar Preference (Step 1)
```typescript
// src/app/api/monetization/featured-listing/route.ts

export async function POST(request: NextRequest) {
  const { freelancerId, planType } = await request.json();

  const prices = {
    featured_basic: 39.9,
    featured_pro: 79.9,
  };

  // Chamar Mercado Pago API pra criar preference
  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payer: {
        email: user.email,
      },
      items: [
        {
          id: `featured_${planType}`,
          title: planType === 'featured_basic' ? 'Destaque Básico' : 'Destaque Premium',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: prices[planType as keyof typeof prices],
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/services`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/services`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/monetization/webhook`,
      external_reference: freelancerId, // Pra webhook identificar
      metadata: {
        freelancer_id: freelancerId,
        plan_type: planType,
        feature: 'featured_listing',
      },
    }),
  });

  const preference = await response.json();
  return NextResponse.json({ preferenceId: preference.id });
}
```

### Processar Pagamento (Step 2)
```typescript
// src/app/api/monetization/featured-listing-payment/route.ts

export async function POST(request: NextRequest) {
  const {
    freelancerId,
    planType,
    token, // Do Brick
    payment_method_id,
    issuer_id,
    installments,
    payer_email,
    payer_identification_type,
    payer_identification_number,
  } = await request.json();

  const prices = {
    featured_basic: 39.9,
    featured_pro: 79.9,
  };

  try {
    // Chamar MP Payment API
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${freelancerId}-${Date.now()}`, // Evita duplicação
      },
      body: JSON.stringify({
        transaction_amount: prices[planType as keyof typeof prices],
        token,
        description: `Featured Listing - ${planType}`,
        installments,
        payment_method_id,
        issuer_id,
        payer: {
          email: payer_email,
          identification: {
            type: payer_identification_type,
            number: payer_identification_number,
          },
        },
        external_reference: freelancerId,
        metadata: {
          freelancer_id: freelancerId,
          plan_type: planType,
        },
      }),
    });

    const payment = await response.json();

    if (payment.status === 'approved') {
      // ✅ Pagamento aprovado! Ativar feature
      await createFeaturedListing(
        freelancerId,
        planType as 'featured_basic' | 'featured_pro',
        payment.id
      );

      return NextResponse.json({ success: true, payment_id: payment.id });
    } else {
      return NextResponse.json(
        { success: false, error: `Payment status: ${payment.status}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
```

### Webhook (Step 3)
```typescript
// src/app/api/monetization/webhook/route.ts

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Validar assinatura MP
  const signature = request.headers.get('x-signature');
  const timestamp = request.headers.get('x-timestamp');

  // TODO: Validar signature (MP envia esse header)
  // if (!isValidMercadoPagoSignature(signature, timestamp, data)) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  // }

  // Processar eventos
  if (data.type === 'payment') {
    const payment = data.data;

    if (payment.status === 'approved') {
      console.log(`✅ Payment approved: ${payment.id}`);
      // Já foi ativado via API route, só logar aqui
    } else if (payment.status === 'rejected') {
      console.log(`❌ Payment rejected: ${payment.id}`);
      // Notificar freelancer
    }
  }

  return NextResponse.json({ success: true });
}
```

## TESTING (Sandbox)

### Credenciais de teste
```
Public Key (Test): TEST-xxxxx
Access Token (Test): APP_TEST-xxxxx

Card Numbers:
4111 1111 1111 1111  → Visa (sucesso)
5555 5555 5555 4444  → Mastercard (sucesso)
378282246310005      → Amex (sucesso)

Exp: Qualquer futuro (ex: 12/25)
CVV: 123
```

### Testar Flow Completo
1. Logar como freelancer
2. Abrir Featured Listing Modal
3. Selecionar "Destaque Básico" (R$39,90)
4. Preencher com card 4111 1111 1111 1111
5. Confirmar
6. ✅ Deve aparecer "Featured listing created"

## TROUBLESHOOTING

### "Brick not rendering"
```typescript
// Verificar se MercadoPagoProvider está no layout
// Verificar se PUBLIC_KEY está definida
console.log(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY); // Não deve ser undefined
```

### "Payment rejected"
```
Motivos comuns:
- Card não validado (use os números de teste acima)
- CPF/Email inválido
- Valor > R$10.000 sem KYC completo
```

### "Webhook not received"
```
1. Configurar webhook URL em MP dashboard
   Settings → Webhooks → Add URL
   https://prestacerto.com/api/monetization/webhook

2. Testar com curl:
   curl -X POST https://localhost:3000/api/monetization/webhook \
     -H "Content-Type: application/json" \
     -d '{"type":"payment","data":{"id":123,"status":"approved"}}'

3. Ver logs do ngrok (se usar ngrok localmente)
```

## CHECKLIST ANTES DE DEPLOY

- [ ] Mercado Pago credenciais configuradas em .env.local
- [ ] MercadoPagoProvider no layout root
- [ ] CardPayment renderizando (não erro no console)
- [ ] Teste completo com card sandbox
- [ ] Webhook URL registrada no dashboard MP
- [ ] createFeaturedListing() sendo chamada após aprovação
- [ ] Dashboard mostrando "Featured" após pagamento
- [ ] Email de confirmação enviado (opcional)
- [ ] Logs do erro sendo capturados

## REVENUE ATIVADO! 🎉

Após essas 3 features:
- Featured Listing: +R$1.170/mês
- Portfolio Premium: +R$1.580/mês
- **Escrow (depois):** +R$6-30k/mês

**Total possível: R$30-35k/mês (Ano 1)**
