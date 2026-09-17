import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    available_teams: [
      {
        id: 'react-team',
        name: 'React Specialists Team',
        size: 4,
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        hourly_rate: 350,
        weekly_cost: 5997,
        availability: 'Próxima semana',
        projects_completed: 234,
        average_rating: 4.9,
      },
      {
        id: 'mobile-team',
        name: 'Mobile Development Team',
        size: 3,
        skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
        hourly_rate: 320,
        weekly_cost: 5997,
        availability: 'Imediato',
        projects_completed: 189,
        average_rating: 4.8,
      },
      {
        id: 'fullstack-team',
        name: 'Full Stack Specialists',
        size: 5,
        skills: ['Next.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
        hourly_rate: 380,
        weekly_cost: 5997,
        availability: 'Próxima semana',
        projects_completed: 312,
        average_rating: 4.9,
      },
    ],
    included_in_swat: [
      '✅ Dedicated team lead',
      '✅ Daily standups',
      '✅ Code reviews',
      '✅ Git workflow + CI/CD',
      '✅ Weekly delivery report',
      '✅ 24h support channel',
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const { team_id, project_description, start_date, weeks_needed } = await req.json();

    const total_cost = 5997 * weeks_needed;
    const bookingId = `SWAT_${Date.now()}`;

    return NextResponse.json({
      success: true,
      booking_id: bookingId,
      team_id,
      start_date,
      duration_weeks: weeks_needed,
      total_investment: total_cost,
      monthly_equivalent: (total_cost * 4.33) / 1,
      status: 'confirmed',
      team_lead_email: 'swat.lead@prestacerto.com',
      onboarding_call: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      message: `Team will start in ${start_date}. First call in 2 days.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
