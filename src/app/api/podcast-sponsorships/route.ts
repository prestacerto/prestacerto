import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'podcast-sponsorships',
    status: 'operational',
    description: 'Sponsor network',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'podcast-sponsorships',
    status: 'processed',
  });
}
