import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, description, skills_required, budget_min, budget_max, deadline, company, job_type } = await req.json();

    const jobId = `JOB_${Date.now()}`;
    const platformFee = (budget_max * 0.1);

    return NextResponse.json({
      success: true,
      job_id: jobId,
      title,
      description,
      skills_required,
      budget: { min: budget_min, max: budget_max },
      platform_fee: platformFee,
      net_to_freelancer: budget_max - platformFee,
      deadline,
      company,
      job_type,
      status: 'open',
      created_at: new Date().toISOString(),
      posting_url: `https://prestacerto.com.br/jobs/${jobId}`,
      visibility: 'top-10-percent-only',
      estimated_applications: `${Math.round(Math.random() * 50 + 20)}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
