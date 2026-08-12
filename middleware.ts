import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Just pass through — Vercel handles www redirects
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
