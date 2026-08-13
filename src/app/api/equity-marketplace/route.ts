import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'equity-marketplace',
    status: 'operational',
    description: 'Founders + equity devs',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'equity-marketplace',
    status: 'processed',
  });
}
