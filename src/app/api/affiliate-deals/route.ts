import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'affiliate-deals',
    status: 'operational',
    description: 'SaaS deals',
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: true,
    feature: 'affiliate-deals',
    status: 'processed',
  });
}
