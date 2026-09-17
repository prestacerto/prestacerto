import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'payment-router',
    status: 'operational',
    description: 'PIX/crypto/Swift',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'payment-router',
    status: 'processed',
  });
}
