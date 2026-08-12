-- Tabela de planos
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  description TEXT,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now()
);

-- Tabela de subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'active', -- active, canceled, past_due
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, plan_id)
);

-- Inserir planos padrão
INSERT INTO plans (id, name, price_cents, description, features) VALUES
  ('free', 'Grátis', 0, 'Para começar', '{"projects": 2, "job_matching": false, "analytics": false, "featured": false, "priority": false}'),
  ('pro', 'Pro', 2900, 'Para profissionais', '{"projects": 20, "job_matching": true, "analytics": true, "featured": false, "priority": false}'),
  ('premium', 'Premium', 9900, 'Acesso total', '{"projects": -1, "job_matching": true, "analytics": true, "featured": true, "priority": true}')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans são públicas" ON plans FOR SELECT USING (true);
CREATE POLICY "Usuários veem próprias subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Apenas sistema cria subscriptions" ON user_subscriptions FOR INSERT WITH CHECK (false);
CREATE POLICY "Apenas sistema atualiza subscriptions" ON user_subscriptions FOR UPDATE WITH CHECK (false);
