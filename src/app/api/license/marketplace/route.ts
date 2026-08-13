import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    featured_templates: [
      {
        id: 'template-1',
        name: 'React E-commerce Starter Kit',
        creator: 'João Dev',
        price: 199,
        tech_stack: ['React', 'Next.js', 'Stripe', 'Tailwind'],
        downloads: 1240,
        rating: 4.9,
        description: 'Loja online completa pronta pra uso',
        includes: ['Source code', 'Documentation', 'Deployment guide', 'Email support'],
      },
      {
        id: 'template-2',
        name: 'SaaS Dashboard Template',
        creator: 'Maria React',
        price: 149,
        tech_stack: ['React', 'TypeScript', 'Charts.js', 'Auth0'],
        downloads: 890,
        rating: 4.8,
        description: 'Dashboard profissional + admin panel',
        includes: ['Fully responsive', 'Dark mode', 'Authentication', 'Components library'],
      },
      {
        id: 'template-3',
        name: 'API REST Boilerplate',
        creator: 'Carlos Backend',
        price: 99,
        tech_stack: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
        downloads: 2100,
        rating: 4.7,
        description: 'API production-ready com autenticação',
        includes: ['JWT auth', 'Rate limiting', 'Logging', 'Tests'],
      },
    ],
    total_templates: 2340,
    total_creators: 890,
    total_sales: 'R$ 450k+',
    monthly_active_users: 15000,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { template_id, user_id, payment_method } = await req.json();

    return NextResponse.json({
      success: true,
      purchase_id: `LICENSE_${Date.now()}`,
      template_id,
      download_link: 'https://cdn.prestacerto.com/templates/...',
      access_granted: true,
      lifetime_access: true,
      commercial_use: true,
      support_included: true,
      message: 'Download iniciado! Acesso permanente.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { template_name, description, price, files } = await req.json();

    return NextResponse.json({
      success: true,
      template_id: `TMPL_${Date.now()}`,
      name: template_name,
      status: 'pending_review',
      review_time: '24-48 horas',
      commission_rate: '30% pra você, 70% vai pra PrestaCerto',
      potential_monthly: 'Baseado em vendas',
      message: 'Template enviado! Será revisado e publicado em 24h.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
