-- FASE 2 — Subscriptions para 8 produtos IA
-- Rastreia assinantes e acesso aos features

CREATE TABLE IF NOT EXISTS phase2_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id VARCHAR(50) NOT NULL,

  -- Assinatura
  subscription_id VARCHAR(255) UNIQUE,
  assiny_event_id VARCHAR(255),
  billing_type VARCHAR(20) NOT NULL CHECK (billing_type IN ('monthly', 'one-time')),

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),

  -- Datas
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,

  -- Rastreamento
  last_event_id VARCHAR(255),
  last_event_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_product CHECK (
    product_id IN (
      'dashboard-ia',
      'insights',
      'badge',
      'certificacao',
      'biblioteca-proposta',
      'portfolio-ia',
      'followup-ia',
      'contra-proposta-ia'
    )
  )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_phase2_user ON phase2_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_phase2_product ON phase2_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_phase2_status ON phase2_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_phase2_expires ON phase2_subscriptions(expires_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_phase2_user_product ON phase2_subscriptions(user_id, product_id);

-- RLS
ALTER TABLE phase2_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: users podem ver suas próprias subscriptions
CREATE POLICY "Users see their own phase2 subscriptions"
ON phase2_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Política: service_role pode fazer tudo
CREATE POLICY "Service role manages all phase2 subscriptions"
ON phase2_subscriptions
USING (auth.role() = 'service_role');

-- Função: Obter produtos FASE 2 ativos do usuário
CREATE OR REPLACE FUNCTION get_user_phase2_products(user_id UUID)
RETURNS TABLE (
  product_id VARCHAR,
  status VARCHAR,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
  SELECT product_id, status, expires_at
  FROM phase2_subscriptions
  WHERE user_id = $1
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY product_id;
$$ LANGUAGE SQL SECURITY INVOKER;

-- Função: Conferir acesso a um produto FASE 2
CREATE OR REPLACE FUNCTION has_phase2_access(user_id UUID, product_id VARCHAR)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM phase2_subscriptions
    WHERE user_id = $1
      AND product_id = $2
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW())
  );
$$ LANGUAGE SQL SECURITY INVOKER;

-- Função: Listar todos os produtos FASE 2 que um usuário tem acesso
CREATE OR REPLACE FUNCTION list_phase2_access(user_id UUID)
RETURNS TABLE (product_id VARCHAR) AS $$
  SELECT DISTINCT product_id
  FROM phase2_subscriptions
  WHERE user_id = $1
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY product_id;
$$ LANGUAGE SQL SECURITY INVOKER;

-- Trigger: atualizar updated_at
CREATE OR REPLACE FUNCTION update_phase2_subscriptions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER phase2_subscriptions_updated_at
BEFORE UPDATE ON phase2_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_phase2_subscriptions_timestamp();

-- Log de auditoria
CREATE TABLE IF NOT EXISTS phase2_subscription_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES phase2_subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  assiny_event_id VARCHAR(255),
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phase2_events_subscription ON phase2_subscription_events(subscription_id);
