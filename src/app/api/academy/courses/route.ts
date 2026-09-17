import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    courses: [
      {
        id: 'react-advanced',
        title: 'React Advanced - Production Ready',
        instructor: 'Top Dev Expert',
        price: 297,
        duration_hours: 24,
        modules: 8,
        students: 1230,
        rating: 4.9,
        description: 'Aprenda React profissional com patterns de produção',
      },
      {
        id: 'system-design',
        title: 'System Design para Freelancers',
        instructor: 'Architecture Master',
        price: 297,
        duration_hours: 20,
        modules: 7,
        students: 850,
        rating: 4.8,
        description: 'Projete sistemas escaláveis que impressionam clientes',
      },
      {
        id: 'business-freelancer',
        title: 'Business Skills pra Freelancers',
        instructor: 'Business Coach',
        price: 297,
        duration_hours: 16,
        modules: 6,
        students: 2100,
        rating: 4.9,
        description: 'Fature 3x mais: negocie melhor, gerencie cliente, venda melhor',
      },
      {
        id: 'security-essentials',
        title: 'Security Essentials',
        instructor: 'Security Expert',
        price: 297,
        duration_hours: 18,
        modules: 6,
        students: 650,
        rating: 4.7,
        description: 'Segurança que clientes enterprise exigem',
      },
    ],
    all_access_annual: 1197,
    all_access_description: 'Acesso vitalício a TODOS os cursos + novos cursos',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { user_id, course_id, payment_method } = await req.json();

    return NextResponse.json({
      success: true,
      enrollment_id: `ENROLL_${Date.now()}`,
      user_id,
      course_id,
      status: 'enrolled',
      access_granted: true,
      certificate_eligible: true,
      lifetime_access: true,
      message: 'Bem-vindo! Seu acesso foi criado.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
