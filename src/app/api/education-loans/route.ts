import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'education-loans',
    status: 'operational',
    description: 'Course loans',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'education-loans',
    status: 'processed',
  });
}
