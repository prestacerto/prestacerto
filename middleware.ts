import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect www to non-www
  const host = request.headers.get("host") || "";

  if (host.startsWith("www.")) {
    const newHost = host.replace(/^www\./, "");
    const url = request.nextUrl.clone();
    url.host = newHost;
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
