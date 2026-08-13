import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'marketplace-vertical',
    status: 'operational',
    description: 'Shopify devs',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'marketplace-vertical',
    status: 'processed',
  });
}
