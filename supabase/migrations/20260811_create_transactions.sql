-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'failed', 'refunded')),
  mercado_pago_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;

-- Create RLS policies
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert sample data
INSERT INTO public.transactions (user_id, plan_name, amount, status, created_at)
SELECT
  auth.users.id,
  'Destaque 30 dias',
  249.00,
  'approved',
  NOW() - INTERVAL '30 days'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (user_id, plan_name, amount, status, created_at)
SELECT
  auth.users.id,
  'Destaque 7 dias',
  99.00,
  'approved',
  NOW() - INTERVAL '45 days'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (user_id, plan_name, amount, status, created_at)
SELECT
  auth.users.id,
  'Job Alerts Premium',
  29.00,
  'pending',
  NOW() - INTERVAL '5 days'
FROM auth.users
LIMIT 1
ON CONFLICT DO NOTHING;
