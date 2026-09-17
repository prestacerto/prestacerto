# 🚨 LEIA ISTO AGORA - COMO FAZER LOGIN FUNCIONAR

## O PROBLEMA
```
❌ Login retorna Erro 400
❌ Migrations não foram executadas
❌ Tabelas não existem no banco
```

## A SOLUÇÃO (DEFINITIVA - 3 MIN)

### PASSO 1: Abra Supabase Console
Clique aqui: https://app.supabase.com

### PASSO 2: Selecione Projeto
- Clique em "prestacerto"

### PASSO 3: Vá em SQL Editor
- Menu esquerdo → SQL Editor

### PASSO 4: Cole este SQL COMPLETO (tudo de uma vez)

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

### PASSO 5: Clique o botão azul "RUN"
- ⚡ Aguarde 10-20 segundos
- Não fecha a página!
- Espere aparecer "✓ Execution completed"

### PASSO 6: Volte pro site
```
https://prestacerto.com.br/register
```

### PASSO 7: Registre uma NOVA conta
```
Nome: João Teste
Email: joao@prestacerto.test (IMPORTANTE: use um email novo)
Senha: Teste123!@#
```

### PASSO 8: Clique "Criar conta"
Aguarde redirecionar pro dashboard...

### PASSO 9: SE NÃO FUNCIONAR
Tira screenshot do erro e manda pra:
📧 contato@prestacerto.com.br

---

## ✅ QUANDO FUNCIONAR, VOCÊ VERÁ:

```
✅ Dashboard carrega
✅ "Olá, João" no topo
✅ Cards mostrando:
   - Propostas Disponíveis
   - Desafios de Hoje
   - Esta Semana
   - Analytics Dashboard (tempo real)
✅ Botão "Comprar Propostas"
✅ Botão "Gerar Código Referral"
```

---

**NÃO SAIA DESSA PÁGINA ATÉ APARECER "Execution completed" NA SQL EDITOR!**

Se aparecer erro vermelho, copie o erro e manda a screenshot.

