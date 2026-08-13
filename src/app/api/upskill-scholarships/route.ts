import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'upskill-scholarships',
    status: 'operational',
    description: 'Scholarships',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'upskill-scholarships',
    status: 'processed',
  });
}
