import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'newsletter-sponsorships',
    status: 'operational',
    description: 'Ad network',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'newsletter-sponsorships',
    status: 'processed',
  });
}
