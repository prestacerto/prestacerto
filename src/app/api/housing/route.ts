import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'housing',
    status: 'operational',
    description: 'Co-living',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'housing',
    status: 'processed',
  });
}
