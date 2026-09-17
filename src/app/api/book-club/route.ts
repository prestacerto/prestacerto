import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    feature: 'book-club',
    status: 'operational',
    description: 'Business books',
  });
}

export async function POST(req) {
  return NextResponse.json({
    success: true,
    feature: 'book-club',
    status: 'processed',
  });
}
