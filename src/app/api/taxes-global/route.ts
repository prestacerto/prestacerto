import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'taxes-global',
    status: 'operational',
    description: 'Tax any country',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'taxes-global',
    status: 'processed',
  });
}
