import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'vpn-suite',
    status: 'operational',
    description: 'VPN + security',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'vpn-suite',
    status: 'processed',
  });
}
