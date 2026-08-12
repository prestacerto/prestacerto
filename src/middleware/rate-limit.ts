import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/redis';

export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: { limit?: number; window?: number } = {}
) {
  try {
    const { limit = 100, window = 60 } = options;

    // Get IP do cliente
    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    const key = `rate-limit:${ip}:${req.nextUrl.pathname}`;
    const allowed = await checkRateLimit(key, limit, window);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return handler(req);
  } catch (error) {
    console.error('Rate limit error:', error);
    // Se Redis falhar, deixa passar (fail open)
    return handler(req);
  }
}
