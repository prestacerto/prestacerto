# 🔐 ESCROW PAYMENT SECURITY — SETUP GUIDE

## O QUE É

PrestaCerto mantém o dinheiro do cliente em **escrow** (conta intermediária) até o projeto ser concluído. Depois libera pro freelancer. Isso:
- ✅ Protege freelancer (cliente não desaparece sem pagar)
- ✅ Protege cliente (recebe os fundos de volta se freelancer não entregar)
- ✅ Gera receita pra PrestaCerto (4% de taxa)

## ARQUIVOS CRIADOS

- `src/lib/firebase/escrow.ts` — Lógica de Firestore
- `src/app/api/monetization/escrow-payment/route.ts` — TODO (criar)
- `src/app/api/monetization/escrow-release/route.ts` — TODO (criar)

## COMO FUNCIONA (FLUXO)

```
1. Cliente propõe pagar R$1.000
   ↓
2. Cliente clica "Pagar via PrestaCerto" 
   ↓
3. Mercado Pago Brick renderiza formulário de cartão
   ↓
4. Cliente digita cartão e confirma
   ↓
5. MP charges R$1.000 e notifica webhook
   ↓
6. Webhook cria EscrowTransaction (status: "held")
   ✅ PrestaCerto fica com R$40 (4%)
   ✅ Freelancer vê R$960 "em escrow" no dashboard
   ↓
7. Projeto é concluído
   ↓
8. Cliente clica "Confirmar conclusão"
   ↓
9. Sistema libera escrow:
      - MP transfere R$960 pro freelancer
      - Status muda pra "released"
   ↓
10. Freelancer recebe dinheiro (banco)
```

## SETUP STEPS

### 1. Configurar Mercado Pago

#### A. Criar conta PSP (Payment Service Provider)
```
Opções:
- Mercado Pago (MP): Já temos integração
- Stripe Connect: Melhor pra transfers internacionais
- Wise: Mais barato, 1.49% transfer fee
```

**Recomendação:** Mercado Pago (já conhecemos) ou Stripe (mais robusto)

#### B. Pegar credenciais
```
MERCADO_PAGO_ACCESS_TOKEN=APP_[...]
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=TEST-[...]
```

### 2. Criar Collection no Firebase

```firestore
ESCROW_TRANSACTIONS collection:
  {
    id: string
    proposal_id: string
    project_id: string
    client_id: string
    freelancer_id: string
    amount: number (R$1.000)
    escrow_fee_percent: 0.04
    escrow_fee_amount: number (R$40)
    net_amount: number (R$960)
    status: "held" | "released" | "refunded" | "disputed"
    created_at: Timestamp
    released_at?: Timestamp
    mercado_pago_payment_id: string
  }
```

### 3. Implementar API Routes

#### POST `/api/monetization/escrow-payment`
```typescript
1. Recebe: { proposal_id, amount }
2. Cria preference no MP com amount
3. Retorna preference_id pra frontend
4. Frontend renderiza CardPayment Brick

Webhook (MP notifica):
1. Cria EscrowTransaction (status: "held")
2. Notifica ambos (cliente + freelancer)
```

#### POST `/api/monetization/escrow-release`
```typescript
1. Recebe: { escrow_transaction_id }
2. Verifica se status = "held"
3. Chama MP Transfer API: paga R$960 ao freelancer
4. Atualiza status pra "released"
5. Notifica freelancer
```

### 4. Atualizar Dashboard

Adicionar no dashboard do freelancer:
```
Escrow holding (Fundos em segurança)
- R$4.560 em escrow de 5 projetos
- R$2.500 já liberados

Actions:
- [View Details] → ver cada transação
- [Release] → solicitar liberação (manual, pra disputas)
```

### 5. Webhook Handler

Criar `src/app/api/monetization/escrow-webhook/route.ts`:
```typescript
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Validar assinatura MP
  if (!isValidMercadoPagoSignature(request, data)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (data.type === 'payment' && data.data.status === 'approved') {
    // Encontrar proposal_id no metadata
    const escrowTxId = await createEscrowTransaction(
      data.data.external_reference, // proposal_id
      data.data.id, // payment_id
      data.data.transaction_amount
    );
    
    // Notificar via email/push
    await notifyPaymentReceived(escrowTxId);
  }

  return NextResponse.json({ success: true });
}
```

## COMPLIANCE / LEGAL

### Brasil - Leis aplicáveis:

1. **Lei 12.865/2013** — Instituições de Pagamento
   - PrestaCerto precisa registro no Banco Central como "PSP" se for intermediar
   - Alternativa: Usar Mercado Pago como intermediário (MP é o PSP, não você)

2. **KYC (Know Your Customer)**
   - Verificar identidade de clientes + freelancers
   - Mercado Pago já faz isso

3. **Recomendação:**
   - **Usar MP como intermediário** (mais seguro, MP assume compliance)
   - MP tem estrutura de PSP no Brasil
   - Você só cria escrow_transactions no seu banco, MP gerencia contas

## TAXAS SUGERIDAS

```
Opção A (Agressivo): 5% escrow fee
- PrestaCerto fica com R$50/R$1.000
- Mercado Pago fica com ~1,99% (R$20)
- Freelancer recebe R$930
- Lucro líquido: R$30/R$1.000

Opção B (Competitivo): 4% escrow fee
- PrestaCerto fica com R$40/R$1.000
- Mercado Pago: ~R$20
- Freelancer recebe R$940
- Lucro líquido: R$20/R$1.000 ← RECOMENDADO

Opção C (Penetração): 2% escrow fee
- PrestaCerto fica com R$20/R$1.000
- MP: ~R$20
- Freelancer recebe R$960
- Lucro: ZERO (só paga MP)
```

**Escolha: 4% (Opção B) — bom equilíbrio**

## ROADMAP DE IMPLEMENTAÇÃO

### Semana 1: Research + Setup
- [ ] Contatar Mercado Pago (programa de marketplace)
- [ ] Pedir credenciais de integração
- [ ] Revisar compliance com advogado
- [ ] Setup webhook (MP → seu servidor)

### Semana 2: Implementação
- [ ] Criar API routes (escrow-payment, escrow-release, webhook)
- [ ] Integrar Mercado Pago Card Brick
- [ ] Atualizar Proposals model: adicionar escrow_transaction_id
- [ ] Testar fluxo completo em sandbox

### Semana 3: UAT + Deploy
- [ ] Testar com time (client + freelancer flow)
- [ ] Setup email notifications
- [ ] Monitorar webhook logs
- [ ] Deploy pra produção

## ARQUITETURA (Alta nível)

```
┌─────────────────┐
│   PrestaCerto   │
│   Dashboard     │
└────────┬────────┘
         │
    1. Cria payment request
         ↓
┌─────────────────────────┐
│   Mercado Pago Brick    │
│  (CardPayment form)     │
└────────┬────────────────┘
         │
    2. Cliente digita cartão
         ↓
┌──────────────────────────────┐
│  Mercado Pago Auth Gateway   │
│  (valida, charges)           │
└────────┬─────────────────────┘
         │
    3. Sucesso → webhook
         ↓
┌──────────────────────────────┐
│  PrestaCerto Webhook Handler │
│  (cria EscrowTransaction)    │
└────────┬─────────────────────┘
         │
    4. Armazena em Firestore
         ↓
┌──────────────────────────────┐
│  Firestore ESCROW_TRANSACTIONS│
│  status: "held"              │
└──────────────────────────────┘
         │
         │ (após projeto pronto)
         ↓
┌──────────────────────────────┐
│  Release escrow request      │
│  Transfer via MP             │
└────────┬─────────────────────┘
         │
    5. MP Transfer API
         ↓
┌──────────────────────────────┐
│  Freelancer Bank Account     │
│  (recebe R$960)              │
└──────────────────────────────┘
```

## TESTING

### Sandbox Testing

```bash
# 1. Use Mercado Pago sandbox credentials
MERCADO_PAGO_ACCESS_TOKEN=APP_TEST_...

# 2. Test card numbers:
4111 1111 1111 1111  → visa (sucesso)
5555 5555 5555 4444  → mastercard (sucesso)
6011 1111 1111 1117  → amex (sucesso)

# 3. Testar webhook localmente:
# Usar ngrok: ngrok http 3000
# Configurar webhook URL: https://[ngrok].ngrok.io/api/monetization/escrow-webhook
# Simular payment no dashboard MP
```

## MONITORAMENTO EM PRODUÇÃO

Adicionar logs:
```typescript
import { logger } from '@/lib/logger'; // Sentry, LogRocket, etc

// Em cada passo importante
logger.info('Escrow transaction created', {
  escrowId,
  freelancerId,
  amount,
  fee_percent: 0.04,
});

logger.info('Escrow released', { escrowId, net_amount });
logger.error('Escrow webhook failed', { error, payload });
```

Alertas:
- ❌ Webhook falhas (resend automático?)
- ❌ Disputes (notificar admin)
- ✅ Taxa de sucesso < 95% (revisar)

## PRÓXIMO: Implementar as API routes

Após confirmar setup, criar:
1. `src/app/api/monetization/escrow-payment/route.ts`
2. `src/app/api/monetization/escrow-release/route.ts`
3. `src/app/api/monetization/escrow-webhook/route.ts`
4. Atualizar Proposals UI com botão "Pagar via PrestaCerto"

**Estimativa:** 2 semanas (research + setup + testing + deploy)
**Payoff:** +R$6k/mês (Ano 1) → +R$30k/mês (Ano 2+)
