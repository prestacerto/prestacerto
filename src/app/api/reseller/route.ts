import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'reseller',
    status: 'operational',
    description: 'Resell with branding',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'reseller',
    status: 'processed',
  });
}
