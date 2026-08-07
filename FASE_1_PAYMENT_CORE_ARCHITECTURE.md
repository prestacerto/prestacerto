# 🏗️ FASE 1: PAYMENT PROCESSING CORE ARCHITECTURE

**Status:** 🚀 EM EXECUÇÃO  
**Timeline:** 4 semanas (80 horas)  
**Priority:** CRÍTICO (coração do ecossistema)  
**Approach:** Zero-trust on money, bulletproof, production-ready

---

## 📋 ARQUITETURA TÉCNICA

### **Layer 1: Payment Ledger (Foundation)**

#### Tables to Create
```sql
-- Ledger duplo (auditoria compliance)
create table payment_ledger (
  id uuid primary key,
  transaction_id uuid not null,
  account_id uuid not null,
  direction text not null, -- 'debit' | 'credit'
  amount decimal(10,2) not null,
  currency text default 'BRL',
  status text not null, -- 'pending' | 'posted'
  posted_at timestamptz,
  created_at timestamptz default now()
);

-- Escrow Ledger (dinheiro retido)
create table escrow_ledger (
  id uuid primary key,
  project_id uuid not null,
  freelancer_id uuid not null,
  client_id uuid not null,
  amount decimal(10,2) not null,
  reason text, -- 'delivery_pending' | 'dispute'
  status text, -- 'held' | 'released' | 'disputed'
  held_at timestamptz default now(),
  release_triggered_at timestamptz,
  released_at timestamptz,
  created_at timestamptz default now()
);

-- Account Balance (cache pra performance)
create table account_balance (
  user_id uuid primary key references profiles(id),
  available_balance decimal(10,2) default 0,
  held_balance decimal(10,2) default 0, -- escrow
  pending_balance decimal(10,2) default 0,
  total_earned decimal(10,2) default 0,
  last_updated timestamptz default now()
);

-- Payout History (quem sacou, quando, quanto)
create table payouts (
  id uuid primary key,
  freelancer_id uuid not null,
  amount decimal(10,2) not null,
  method text not null, -- 'pix' | 'ted' | 'stripe'
  status text not null, -- 'pending' | 'processing' | 'completed' | 'failed'
  external_reference text, -- ID no Mercado Pago
  requested_at timestamptz default now(),
  processed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Fee Configuration (dinâmico por categoria)
create table fee_config (
  id uuid primary key,
  category text not null unique, -- 'dev' | 'design' | 'copywriting'
  base_fee_percent decimal(3,2) not null, -- 2.50 = 2.5%
  subscription_discount_percent decimal(3,2) default 0.50, -- assinantes pagam menos
  active boolean default true,
  created_at timestamptz default now()
);
```

#### Indexes (Critical Performance)
```sql
create index idx_payment_ledger_account on payment_ledger(account_id, created_at desc);
create index idx_payment_ledger_transaction on payment_ledger(transaction_id);
create index idx_escrow_ledger_freelancer on escrow_ledger(freelancer_id, status);
create index idx_escrow_ledger_client on escrow_ledger(client_id, status);
create index idx_payouts_freelancer on payouts(freelancer_id, status);
create index idx_payouts_completed on payouts(completed_at desc) where status = 'completed';
```

---

### **Layer 2: Transaction Processing (Core Logic)**

#### Endpoints to Create
```
POST   /api/monetization/transactions/initiate
       Início de pagamento (cliente → projeto)
       
POST   /api/monetization/transactions/confirm
       Confirmação após webhook Mercado Pago
       
POST   /api/monetization/escrow/release
       Liberar dinheiro do escrow
       
POST   /api/monetization/escrow/dispute
       Abrir disputa (bloqueia release)
       
POST   /api/monetization/payouts/request
       Freelancer solicita saque
       
POST   /api/monetization/payouts/webhook
       Webhook Mercado Pago payout completed
       
GET    /api/monetization/balance
       Saldo atual (available + held + pending)
       
GET    /api/monetization/transactions
       Histórico de transações
```

#### Core Algorithm (Transaction Flow)
```
1. CLIENT PAYS (POST /initiate)
   ├─ Validate amount
   ├─ Create Mercado Pago preference
   ├─ Create payment_ledger record (status: pending)
   ├─ Lock account (prevent double-spend)
   └─ Return preference ID → frontend checkout

2. PAYMENT CONFIRMED (POST /confirm via webhook)
   ├─ Verify webhook HMAC signature
   ├─ Check payment status (approved)
   ├─ Debit client account (ledger)
   ├─ Credit escrow account (ledger)
   ├─ Update payment_ledger (status: posted)
   └─ Unlock account

3. DELIVERY CONFIRMED (7-14 days after payment)
   ├─ Client clicks "approve delivery"
   ├─ Release escrow → freelancer available_balance
   ├─ Debit escrow, credit freelancer
   ├─ Update account_balance cache
   └─ Trigger payout eligibility

4. FREELANCER REQUESTS PAYOUT
   ├─ Check available_balance >= R$ 100 (minimum)
   ├─ Create payout record (status: pending)
   ├─ Queue async job (Bull)
   ├─ Call Mercado Pago transfer API
   └─ Wait for webhook confirmation

5. PAYOUT COMPLETED (Webhook from Mercado Pago)
   ├─ Verify webhook signature
   ├─ Update payout record (status: completed)
   ├─ Debit freelancer balance
   ├─ Create ledger record (audit trail)
   └─ Send confirmation email
```

---

### **Layer 3: Reconciliation & Safety**

#### Automated Reconciliation (24/7)
```typescript
// Run every 1 hour
async function reconcileAccounts() {
  // Check: sum(ledger.debit) = sum(ledger.credit)
  // Check: account_balance = sum(ledger) for that account
  // Check: account_balance.held >= sum(escrow.held)
  // Alert if mismatch detected
  // Auto-rollback problematic transactions
}

// Run every 6 hours
async function reconcilePayouts() {
  // Check: all pending payouts against Mercado Pago API
  // Update status if webhook was missed
  // Alert if payout fails
}

// Run daily
async function generateAuditReport() {
  // GMV yesterday
  // Take rate revenue
  // Payout summary
  // Disputes opened/resolved
  // Fraud alerts triggered
}
```

#### Idempotency (No Double-Charging)
```typescript
// Every transaction must have idempotency key
POST /api/monetization/transactions/initiate
  {
    idempotency_key: "client_123_project_456_20260807",
    project_id: "...",
    amount: 1000,
    ...
  }

// Server-side logic:
1. Hash idempotency_key
2. Check if already processed
3. If yes: return previous result
4. If no: process and store key
```

---

### **Layer 4: Fraud Detection & Compliance**

#### KYC Verification (Required)
```typescript
POST /api/kyc/start-verification
  {
    cpf: "11111111111", // encrypted
    full_name: "João da Silva",
    birth_date: "1990-01-15",
    document_front: file, // upload
    document_back: file,
    selfie: file // liveness check
  }

// Verification levels:
// Level 0: No KYC (no payouts allowed)
// Level 1: Basic KYC (max R$ 5k/month)
// Level 2: Full KYC + facial (unlimited)

// Integration: iDemeum or Truora
```

#### Fraud Detection Rules (ML-ready)
```
Rules:
1. High velocity: >10 transactions in 1 hour → flag
2. Geographic: transaction from 3 countries in 1 day → flag
3. Amount spike: 10x usual transaction size → flag
4. Same payment method, 5 different accounts → flag
5. Chargeback history: >5% chargeback rate → suspend
6. Device fingerprint: same device, 20 accounts → flag

Actions:
- Flag: manual review (1h)
- Block: immediate suspension
- Alert: email to user + PrestaCerto
```

---

### **Layer 5: Webhooks & Async Processing**

#### Webhook Events
```
1. payment.created (immediate)
2. payment.approved (1-5min) ← PRIMARY
3. payment.declined (immediate)
4. payment.chargedback (24-180 days)
5. payout.completed (6-24h)
6. payout.failed (6-24h)
7. dispute.opened (user-triggered)
8. dispute.resolved (manual review)
```

#### Webhook Reliability
```typescript
// Bull Queue Configuration
{
  attempts: 10,
  backoff: {
    type: 'exponential',
    delay: 2000 // 2s, 4s, 8s, 16s, 32s...
  },
  removeOnComplete: true,
  removeOnFail: false // keep for debugging
}

// Webhook signature verification
const HMAC = crypto.createHmac('sha256', SECRET)
  .update(event.id + event.timestamp + JSON.stringify(event.data))
  .digest('hex')

if (HMAC !== event.signature) {
  throw new Error('Invalid webhook signature')
}
```

---

### **Layer 6: Payout System**

#### Payout Methods
```
1. PIX (instant, zero fee)
   - Preferred by Brazilian freelancers
   - Settlement: 1-2 minutes
   
2. TED Transfer (1-2 hours)
   - For non-PIX accounts
   - Fee: R$ 10 (absorbed by us)
   
3. Stripe (international)
   - For foreign freelancers
   - Fee: 2% (charged to freelancer)
   - Settlement: 2-3 days
```

#### Payout Batching (Cost Optimization)
```typescript
// Weekly job (every Friday 2am)
async function batchPayouts() {
  // Get all pending payouts
  const payouts = await getPendingPayouts()
  
  // Group by method
  const pixPayouts = payouts.filter(p => p.method === 'pix')
  const tedPayouts = payouts.filter(p => p.method === 'ted')
  
  // PIX: send individually (cheap)
  for (const payout of pixPayouts) {
    await sendViaMP(payout)
  }
  
  // TED: batch in groups of 20 (reduce API calls)
  for (let i = 0; i < tedPayouts.length; i += 20) {
    await batchSendViaMP(tedPayouts.slice(i, i + 20))
  }
}
```

---

## 📊 DATA CONSISTENCY GUARANTEES

### **Atomicity**
- All ledger operations ACID transactions
- No partial updates
- Rollback on any failure

### **Availability**
- Read replicas for read-heavy operations
- Cache for balance lookups
- Graceful degradation (no double-spending, but slower response)

### **Auditability**
- Every transaction logged
- Cannot delete ledger entries (immutable)
- Audit trail for compliance

---

## 🔐 SECURITY REQUIREMENTS

- [ ] PCI DSS Level 1 (no card data storage)
- [ ] Webhook HMAC signature verification
- [ ] Idempotency key enforcement
- [ ] Account locking during payment
- [ ] KYC verification before payouts
- [ ] Rate limiting (100 req/min per user)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Encryption at rest (AES-256)
- [ ] Audit logging (immutable)

---

## 📈 PERFORMANCE TARGETS

- Payment initiation: <200ms
- Webhook processing: <500ms
- Balance lookup: <50ms (cache)
- Payout request: <300ms

---

## ✅ READY FOR IMPLEMENTATION

Next: Create migration files, endpoint code, tests, webhooks validation.

**Status: ARCHITECTURE APPROVED** ✅

---

