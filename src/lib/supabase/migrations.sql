-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_cents INTEGER NOT NULL,
  deadline TIMESTAMP,
  skills TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'geral',
  status TEXT DEFAULT 'aberto',
  client_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  freelancer_id UUID NOT NULL,
  content TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  ai_optimized_content TEXT,
  ai_score INTEGER,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_project ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer ON proposals(freelancer_id);

-- Transactions table (Escrow)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  freelancer_id UUID NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT DEFAULT 'pendente',
  escrow_status TEXT DEFAULT 'locked',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_project ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_freelancer ON transactions(freelancer_id);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view open projects"
  ON projects FOR SELECT
  USING (status = 'aberto' OR auth.uid() = client_id);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view proposals on their projects"
  ON proposals FOR SELECT
  USING (auth.uid() IN (
    SELECT client_id FROM projects WHERE projects.id = project_id
  ) OR auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can submit proposals"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = freelancer_id);
