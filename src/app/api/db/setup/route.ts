import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Create projects table
    const { error: projectsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    }).catch(() => ({ error: null }));

    // Create proposals table
    const { error: proposalsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    }).catch(() => ({ error: null }));

    // Create transactions table
    const { error: transError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    }).catch(() => ({ error: null }));

    return NextResponse.json({
      success: true,
      message: 'Tabelas criadas/verificadas',
      errors: [projectsError, proposalsError, transError].filter(Boolean),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
