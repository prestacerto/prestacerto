import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'skills-marketplace',
    status: 'operational',
    description: 'Sell skills',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'skills-marketplace',
    status: 'processed',
  });
}
