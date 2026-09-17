import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'venture',
    status: 'operational',
    description: 'Investment fund',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'venture',
    status: 'processed',
  });
}
