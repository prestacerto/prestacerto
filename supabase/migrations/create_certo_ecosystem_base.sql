-- ARQUITETURA BASE DO CERTO ECOSYSTEM (27 PRODUTOS)

-- Tabela central: Produtos do Certo
CREATE TABLE IF NOT EXISTS certo_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL, -- "match", "preco", "timing", etc
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) NOT NULL, -- "intelligence", "tools", "payments", "community"
  price_monthly DECIMAL(10, 2) DEFAULT 0,
  price_type VARCHAR(20) DEFAULT 'subscription', -- "subscription", "one-time", "commission", "freemium"
  icon VARCHAR(10), -- emoji
  status VARCHAR(20) DEFAULT 'planned', -- "planned", "alpha", "beta", "live"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Subscrições do usuário
CREATE TABLE IF NOT EXISTS certo_user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES certo_products(id),
  subscription_status VARCHAR(20) DEFAULT 'active', -- "active", "paused", "cancelled"
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  renews_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, product_id)
);

-- Tabela: Uso e Analytics
CREATE TABLE IF NOT EXISTS certo_product_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES certo_products(id),
  action VARCHAR(50), -- "calculate", "view", "export", "share"
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Pontos/Gamification (Ecossistema)
CREATE TABLE IF NOT EXISTS certo_user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  badges_earned JSONB DEFAULT '[]',
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Transações (Escrow, Milestones, etc)
CREATE TABLE IF NOT EXISTS certo_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id VARCHAR(255) NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  project_id UUID,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  transaction_type VARCHAR(30), -- "escrow", "milestone", "commission"
  status VARCHAR(20) DEFAULT 'pending', -- "pending", "released", "disputed", "completed"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP WITH TIME ZONE,
  disputed_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_certo_products_status ON certo_products(status);
CREATE INDEX IF NOT EXISTS idx_certo_products_category ON certo_products(category);
CREATE INDEX IF NOT EXISTS idx_certo_user_products_user ON certo_user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_certo_user_products_status ON certo_user_products(subscription_status);
CREATE INDEX IF NOT EXISTS idx_certo_product_usage_user ON certo_product_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_certo_transactions_user ON certo_transactions(freelancer_id, client_id);

-- Seeds: Produtos iniciais (27 produtos)
INSERT INTO certo_products (slug, name, category, price_monthly, status) VALUES
-- FASE 1: Top 3
('match', 'Certo Match', 'intelligence', 2.90, 'alpha'),
('preco', 'Certo Preço', 'intelligence', 14.90, 'planned'),
('timing', 'Certo Timing', 'intelligence', 9.90, 'planned'),

-- FASE 2: Inteligência
('dashboard-ia', 'Dashboard IA', 'intelligence', 49.90, 'planned'),
('insights', 'Certo Insights', 'intelligence', 24.90, 'planned'),
('badge', 'Certo Badge', 'tools', 19.90, 'planned'),
('certificacao', 'Certo Certificação', 'education', 29.90, 'planned'),
('biblioteca-proposta', 'Biblioteca de Proposta', 'tools', 19.90, 'planned'),
('portfolio-ia', 'Portfolio IA', 'tools', 12.90, 'planned'),
('follow-up-ia', 'Follow-up IA', 'intelligence', 12.90, 'planned'),
('contra-proposta-ia', 'Contra-proposta IA', 'intelligence', 9.90, 'planned'),

-- FASE 3: Seus Produtos
('curriculo', 'Certo Currículo', 'tools', 9.90, 'planned'),
('escrow', 'Certo Escrow', 'payments', 0, 'planned'),
('milestones', 'Certo Milestones', 'payments', 0, 'planned'),
('analytics-cliente', 'Analytics Cliente', 'tools', 49.90, 'planned'),
('contrato-ia', 'Contrato IA', 'tools', 24.90, 'planned'),
('qa-automatico', 'QA Automático', 'tools', 34.90, 'planned'),
('vip', 'Certo VIP', 'community', 999.90, 'planned'),
('community', 'Certo Community', 'community', 39.90, 'planned'),

-- FASE 4: Comunidade
('academy', 'Certo Academy', 'education', 297.00, 'planned'),
('templates', 'Certo Templates', 'tools', 29.90, 'planned'),
('invoice', 'Certo Invoice', 'tools', 19.90, 'planned'),
('cold-email', 'Certo Cold Email', 'tools', 79.90, 'planned'),
('tax', 'Certo Tax', 'tools', 49.90, 'beta'),
('destaque', 'Certo Destaque', 'marketplace', 99.90, 'planned'),
('candidato', 'Certo Candidato', 'marketplace', 0, 'planned'),
('premium', 'Certo Premium', 'community', 199.90, 'planned');

COMMENT ON TABLE certo_products IS 'Todos os 27 produtos do Certo Ecosystem';
COMMENT ON TABLE certo_user_products IS 'Rastreia qual user tem qual product ativo';
COMMENT ON TABLE certo_product_usage IS 'Analytics: como users usam cada product';
COMMENT ON TABLE certo_user_points IS 'Gamification: pontos, badges, levels';
COMMENT ON TABLE certo_transactions IS 'Transações financeiras (escrow, milestones, comissões)';
