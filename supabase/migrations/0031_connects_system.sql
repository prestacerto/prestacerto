-- Connects/Propostas System
-- Limita quantas propostas cada freelancer pode enviar por mês

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

-- Track connect usage
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

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION public.reset_monthly_connects()
RETURNS void AS $$
BEGIN
  UPDATE public.user_connects
  SET used_this_month = 0, last_reset_at = now()
  WHERE EXTRACT(MONTH FROM last_reset_at) != EXTRACT(MONTH FROM now())
    OR EXTRACT(YEAR FROM last_reset_at) != EXTRACT(YEAR FROM now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create connects record for new users
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
