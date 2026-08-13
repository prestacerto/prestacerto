import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'travel-concierge',
    status: 'operational',
    description: 'Arrange trips',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'travel-concierge',
    status: 'processed',
  });
}
