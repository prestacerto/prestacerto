import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'skill-certification',
    status: 'operational',
    description: 'Cloud certs',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'skill-certification',
    status: 'processed',
  });
}
