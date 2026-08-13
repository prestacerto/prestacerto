import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'career-ladder',
    status: 'operational',
    description: 'Career planning',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'career-ladder',
    status: 'processed',
  });
}
