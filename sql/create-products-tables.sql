-- Tabela de Subscriptions dos Produtos
CREATE TABLE IF NOT EXISTS certo_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('one-time', 'monthly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  subscription_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  renewal_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_certo_subscriptions_user_id ON certo_subscriptions(user_id);
CREATE INDEX idx_certo_subscriptions_product_id ON certo_subscriptions(product_id);
CREATE INDEX idx_certo_subscriptions_status ON certo_subscriptions(status);

-- Tabela de Eventos de Pagamento do Assinify
CREATE TABLE IF NOT EXISTS certo_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  subscription_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certo_payment_events_user_id ON certo_payment_events(user_id);
CREATE INDEX idx_certo_payment_events_product_id ON certo_payment_events(product_id);
CREATE INDEX idx_certo_payment_events_event_type ON certo_payment_events(event_type);
CREATE INDEX idx_certo_payment_events_processed ON certo_payment_events(processed);

-- Tabela de Uso dos Produtos
CREATE TABLE IF NOT EXISTS certo_product_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certo_product_usage_user_id ON certo_product_usage(user_id);
CREATE INDEX idx_certo_product_usage_product_id ON certo_product_usage(product_id);
CREATE INDEX idx_certo_product_usage_action ON certo_product_usage(action);
CREATE INDEX idx_certo_product_usage_created_at ON certo_product_usage(created_at);

-- Enable RLS (Row Level Security) se necessário
ALTER TABLE certo_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certo_payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE certo_product_usage ENABLE ROW LEVEL SECURITY;

-- Policies RLS para certo_subscriptions (usuário pode ver suas próprias subscriptions)
CREATE POLICY "Users can view their own subscriptions" ON certo_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON certo_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies RLS para certo_product_usage (usuário pode ver seu próprio uso)
CREATE POLICY "Users can view their own product usage" ON certo_product_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own product usage" ON certo_product_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies RLS para certo_payment_events (apenas sistema pode inserir)
CREATE POLICY "System can insert payment events" ON certo_payment_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own payment events" ON certo_payment_events
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger para atualizar o timestamp de updated_at em certo_subscriptions
CREATE OR REPLACE FUNCTION update_certo_subscriptions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certo_subscriptions_timestamp_trigger
BEFORE UPDATE ON certo_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_certo_subscriptions_timestamp();

-- Dados iniciais (opcional)
-- INSERT INTO certo_subscriptions (user_id, product_id, plan, status, subscription_id)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'certo-match', 'monthly', 'active', 'sub_test_001');
