import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'ghost-team',
    status: 'operational',
    description: 'We deliver',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'ghost-team',
    status: 'processed',
  });
}
