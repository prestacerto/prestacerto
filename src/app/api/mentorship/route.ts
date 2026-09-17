import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'mentorship',
    status: 'operational',
    description: 'Mentees + mentors',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'mentorship',
    status: 'processed',
  });
}
