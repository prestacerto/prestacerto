import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'performance-agency',
    status: 'operational',
    description: 'Marketing management',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'performance-agency',
    status: 'processed',
  });
}
