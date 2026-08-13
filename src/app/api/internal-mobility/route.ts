import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'internal-mobility',
    status: 'operational',
    description: 'Transfer devs',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'internal-mobility',
    status: 'processed',
  });
}
