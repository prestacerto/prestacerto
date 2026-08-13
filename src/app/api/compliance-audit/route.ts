import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'compliance-audit',
    status: 'operational',
    description: 'LGPD/HIPAA',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'compliance-audit',
    status: 'processed',
  });
}
