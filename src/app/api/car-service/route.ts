import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'car-service',
    status: 'operational',
    description: 'Car rental affiliate',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'car-service',
    status: 'processed',
  });
}
