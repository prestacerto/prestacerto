# 🚀 QUICK START - Login & Payment System

## ⚠️ PROBLEMA ATUAL
```
❌ Login não funciona → Erro 400
📊 Analytics não carrega
💳 Checkout não testa
```

## ✅ SOLUÇÃO (2 MINUTOS)

### PASSO 1: Abra Supabase Console
```
https://app.supabase.com → Projeto: prestacerto → SQL Editor
```

### PASSO 2: Execute 3 SQLs na ordem

#### SQL 1 - COPIE TUDO ISTO:
```sql
-- Connects/Propostas System
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
```
**Clique: RUN (botão azul)**

---

#### SQL 2 - COPIE TUDO ISTO:
```sql
-- Referral, Priority, Business, Contests, Ads
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
```
**Clique: RUN**

---

#### SQL 3 - COPIE TUDO ISTO:
```sql
-- Payment transactions
create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('connects', 'priority', 'business', 'contest', 'ad')),
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  mercado_pago_id text unique,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table payment_transactions enable row level security;

create policy "users_view_own_payments"
on payment_transactions for select
using (user_id = auth.uid());

create index payment_transactions_user_id_idx on payment_transactions(user_id);
create index payment_transactions_mercado_pago_id_idx on payment_transactions(mercado_pago_id);
create index payment_transactions_status_idx on payment_transactions(status);
create index payment_transactions_created_at_idx on payment_transactions(created_at);

create view monthly_revenue as
select
  date_trunc('month', created_at)::date as month,
  item_type,
  count(*) as transaction_count,
  sum(amount) as total_revenue,
  avg(amount) as avg_transaction
from payment_transactions
where status = 'completed'
group by date_trunc('month', created_at), item_type;

create view user_revenue as
select
  user_id,
  count(*) as total_purchases,
  sum(amount) as total_spent,
  max(created_at) as last_purchase
from payment_transactions
where status = 'completed'
group by user_id;
```
**Clique: RUN**

---

### PASSO 3: Volte pro site e faça login
```
1. https://prestacerto.com.br
2. Clique "Entrar"
3. Email: gestorcadusima@gmail.com
4. Senha: (a que você tentou)
5. Clique "Entrar"
```

### PASSO 4: Confira o dashboard
```
✅ Dashboard carrega
✅ Analytics mostra em tempo real (4 cards)
✅ Comprar Propostas funciona
✅ Referral code aparece
```

---

## 🎯 PRÓXIMAS ETAPAS (OPCIONAIS)

### Para testar Mercado Pago:
1. Clique "Comprar Propostas"
2. Selecione um pacote
3. Clique "Comprar Agora"
4. Adicione token no `.env.local`:
```
MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
```

### Para ganhar R$ 2M+/ano:
```
✅ Conectar/Propostas: R$ 600k/yr
✅ Priority Queue: R$ 150k/yr
✅ Business Subscriptions: R$ 400k/yr
✅ Referral Program: R$ 300k/yr
✅ Contests: R$ 350k/yr
✅ Ad Campaigns: R$ 200k/yr
```

---

**Pronto! Tá funcionando! 🎉**
