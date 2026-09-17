import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'wellness-retreat',
    status: 'operational',
    description: 'Wellness event',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'wellness-retreat',
    status: 'processed',
  });
}
