import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'hackathon',
    status: 'operational',
    description: 'Monthly hackathon',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'hackathon',
    status: 'processed',
  });
}
