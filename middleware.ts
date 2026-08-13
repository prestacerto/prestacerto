import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl;

  // Redirect www to non-www
  if (hostname?.startsWith("www.")) {
    const newUrl = request.nextUrl.clone();
    newUrl.hostname = hostname.replace("www.", "");
    return NextResponse.redirect(newUrl, { status: 308 });
  }

  const response = NextResponse.next();

  // Security and performance headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
