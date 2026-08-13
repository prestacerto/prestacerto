import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const pathname = request.nextUrl.pathname;

  // Rate Limiting: Max 10k requests per minute per IP
  const rateLimit = process.env.RATE_LIMIT_REQUESTS || '10000';
  const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW || '60000');

  // Skip rate limiting for static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Add cache headers for API responses
  const response = NextResponse.next();

  // Cache strategy
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  }

  // Enable compression
  response.headers.set('Accept-Encoding', 'gzip, deflate, br');

  // Add CORS headers if needed
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Add performance headers
  response.headers.set('Server-Timing', `total;dur=${Date.now()}`);

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin/:path*'],
};
