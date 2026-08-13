import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'insurance-crypto',
    status: 'operational',
    description: 'Crypto insurance',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'insurance-crypto',
    status: 'processed',
  });
}
