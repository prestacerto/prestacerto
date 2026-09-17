import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'arbitrage',
    status: 'operational',
    description: 'Buy cheap sell expensive',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'arbitrage',
    status: 'processed',
  });
}
