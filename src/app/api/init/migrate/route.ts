import { NextResponse } from 'next/server';

const MIGRATIONS_SQL = `
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

-- Transactions table
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
`;

export async function POST() {
  try {
    // Tenta executar via Supabase admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        {
          error: 'Supabase não configurado',
          note: 'Execute migrations manualmente em https://app.supabase.com/project/taktwwwpcyxhyylzmgho/sql/new',
          migrations_sql: MIGRATIONS_SQL,
        },
        { status: 500 }
      );
    }

    // Tenta fazer request pra executar SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: MIGRATIONS_SQL }),
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Migrations executadas com sucesso!',
        tables_created: ['projects', 'proposals', 'transactions'],
      });
    }

    return NextResponse.json({
      success: false,
      warning: 'Migrations precisam ser executadas manualmente',
      instructions: {
        step1: 'Acesse https://app.supabase.com',
        step2: 'Vá em SQL Editor',
        step3: 'Cole o SQL abaixo e execute',
        step4: 'Pronto! Seu banco está pronto',
      },
      sql: MIGRATIONS_SQL,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        manual_setup: 'Copie o SQL e execute manualmente no Supabase SQL Editor',
      },
      { status: 500 }
    );
  }
}
