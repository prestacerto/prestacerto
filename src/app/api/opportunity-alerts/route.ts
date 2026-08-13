import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'opportunity-alerts',
    status: 'operational',
    description: 'Push alerts',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'opportunity-alerts',
    status: 'processed',
  });
}
