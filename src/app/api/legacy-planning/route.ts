import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'legacy-planning',
    status: 'operational',
    description: 'Will + estate',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'legacy-planning',
    status: 'processed',
  });
}
