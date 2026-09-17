import { NextResponse } from 'next/server';

export async function GET() {
  const projects = [
    {
      id: '1',
      title: 'Dashboard React com TypeScript',
      description: 'Preciso de um dashboard admin moderno com gráficos em tempo real',
      budget_cents: 500000,
      category: 'web-dev',
      match_score: 95,
      posted_hours: 2
    },
    {
      id: '2',
      title: 'Otimização de SEO',
      description: 'Site precisa melhorar ranking no Google',
      budget_cents: 200000,
      category: 'marketing',
      match_score: 78,
      posted_hours: 4
    },
    {
      id: '3',
      title: 'API REST em Node.js',
      description: 'Backend para app mobile com autenticação JWT',
      budget_cents: 800000,
      category: 'backend',
      match_score: 88,
      posted_hours: 1
    }
  ];

  const today = new Date().toDateString();
  const hash = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const project = projects[hash % projects.length];

  return NextResponse.json({
    project,
    updated_at: new Date(),
    next_update: new Date(Date.now() + 86400000)
  });
}
