# 🎯 CLIQUE POR CLIQUE - GUIA VISUAL

## PASSO 1️⃣: Abra Supabase
**Clique aqui:**
```
https://app.supabase.com
```

Vai abrir uma página assim:
```
┌─────────────────────────────────────────┐
│  SUPABASE                               │
│  ┌─────────────────────────────────┐   │
│  │ Seus Projetos                   │   │
│  │                                 │   │
│  │ 📦 prestacerto                  │◄──┼── CLIQUE AQUI
│  │ Projeto: taktwwwpcyxhyylzmgho   │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## PASSO 2️⃣: Depois de clicar em "prestacerto"
Você vai ver a página do projeto. 

**NO MENU ESQUERDO**, procure por:
```
┌──────────────────────┐
│  Supabase Menu       │
│  ├─ Home             │
│  ├─ Editor ◄─────────┼── CLIQUE AQUI
│  ├─ SQL Editor ◄─────┼── OU AQUI (melhor)
│  ├─ Database         │
│  ├─ Auth             │
│  └─ ...              │
└──────────────────────┘
```

**Clique em:** `SQL Editor` (ou `Editor`)

---

## PASSO 3️⃣: Agora você está no SQL Editor
Você vai ver uma tela assim:
```
┌──────────────────────────────────────────┐
│  SQL Editor                              │
│  ┌──────────────────────────────────┐   │
│  │ Untitled query                   │   │
│  │ ────────────────────────────────   │
│  │                                  │   │
│  │  [CAIXA DE TEXTO BRANCA]         │   │
│  │  ← COLE O SQL AQUI               │   │
│  │                                  │   │
│  │ ────────────────────────────────   │
│  │                      [RUN] [Save]  │
│  │                         ▲           │
│  │                    CLIQUE AQUI      │
│  └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## PASSO 4️⃣: Copie TODO este SQL

```sql
-- ============ MIGRATION 1: CONNECTS SYSTEM ============

CREATE TABLE IF NOT EXISTS public.user_connects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  monthly_limit int NOT NULL DEFAULT 5,
  used_this_month int NOT NULL DEFAULT 0,
  total_purchased int NOT NULL DEFAULT 0,
  extra_connects int NOT NULL DEFAULT 0,
  last_reset_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_connects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_connects" ON public.user_connects
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_update_own_connects" ON public.user_connects
  FOR UPDATE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.connect_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'monthly_reset')),
  reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.connect_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_transactions" ON public.connect_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.reset_monthly_connects()
RETURNS void AS $$
BEGIN
  UPDATE public.user_connects
  SET used_this_month = 0, last_reset_at = now()
  WHERE EXTRACT(MONTH FROM last_reset_at) != EXTRACT(MONTH FROM now())
    OR EXTRACT(YEAR FROM last_reset_at) != EXTRACT(YEAR FROM now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user_connects()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_connects (user_id, plan, monthly_limit)
  VALUES (new.id, 'free', 5)
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_connects ON auth.users;
CREATE TRIGGER on_auth_user_connects
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_connects();

-- ============ MIGRATION 2: MONETIZATION ============

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  earnings_total numeric DEFAULT 0,
  referrals_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.priority_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text CHECK (tier IN ('gold', 'platinum', 'diamond')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.priority_queue ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.business_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text CHECK (plan IN ('starter', 'pro', 'enterprise')),
  price numeric,
  team_limit int,
  next_billing timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  prize numeric NOT NULL,
  presta_commission numeric,
  category text,
  deadline timestamptz,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  placement text,
  duration_days int,
  budget numeric,
  daily_rate numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  starts_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_referrals" ON public.referral_codes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_priority" ON public.priority_queue FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_business" ON public.business_subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_see_own_contests" ON public.contests FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "users_see_own_campaigns" ON public.ad_campaigns FOR SELECT USING (user_id = auth.uid());

-- ============ MIGRATION 3: PAYMENTS ============

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('connects', 'priority', 'business', 'contest', 'ad')),
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  mercado_pago_id text UNIQUE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_payments" ON public.payment_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE INDEX payment_transactions_user_id_idx ON payment_transactions(user_id);
CREATE INDEX payment_transactions_mercado_pago_id_idx ON payment_transactions(mercado_pago_id);
CREATE INDEX payment_transactions_status_idx ON payment_transactions(status);
CREATE INDEX payment_transactions_created_at_idx ON payment_transactions(created_at);

CREATE OR REPLACE VIEW public.monthly_revenue AS
SELECT
  date_trunc('month', created_at)::date as month,
  item_type,
  count(*) as transaction_count,
  sum(amount) as total_revenue,
  avg(amount) as avg_transaction
FROM payment_transactions
WHERE status = 'completed'
GROUP BY date_trunc('month', created_at), item_type;

CREATE OR REPLACE VIEW public.user_revenue AS
SELECT
  user_id,
  count(*) as total_purchases,
  sum(amount) as total_spent,
  max(created_at) as last_purchase
FROM payment_transactions
WHERE status = 'completed'
GROUP BY user_id;
```

---

## PASSO 5️⃣: Cole na caixa de texto

1. Clique dentro da caixa branca (SQL Editor)
2. Pressione: `Ctrl+A` (seleciona tudo)
3. Pressione: `Ctrl+V` (cola)

Agora você vai ver o SQL inteiro dentro da caixa.

---

## PASSO 6️⃣: Clique no botão azul RUN

```
┌────────────────────────────────────────┐
│                                        │
│  [SQL AQUI]                            │
│                                        │
│                      [RUN] ◄─ CLIQUE   │
│                                        │
└────────────────────────────────────────┘
```

**Espere 10-20 segundos...**

Você vai ver:
```
✓ Execution completed

Lines 1-5 of query returned 0 rows
```

---

## PASSO 7️⃣: Pronto! Agora volta pro site

Abra:
```
https://prestacerto.com.br/register
```

Registre uma conta nova (qualquer email):
```
Nome: João Teste
Email: joao@teste.com (NOVO EMAIL)
Senha: Teste123!@#
```

Clique: "Quero oferecer serviços"
Clique: "Criar conta"

---

## ✅ QUANDO FUNCIONAR

Você vai ver:
```
Olá, João!
Seu dashboard está pronto.

[Cards com métricas]
[Analytics em tempo real]
[Botão: Comprar Propostas]
```

---

**DÚVIDAS?**

- Está vendo a SQL Editor? ✅
- Conseguiu colar o SQL? ✅
- Clicou RUN? ✅
- Viu "Execution completed"? ✅

Se sim → Volta pro site → Registra → PRONTO! 🎉

Se não → Me manda screenshot do erro.
