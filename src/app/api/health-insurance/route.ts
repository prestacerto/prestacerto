import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'health-insurance',
    status: 'operational',
    description: 'Group insurance',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'health-insurance',
    status: 'processed',
  });
}
