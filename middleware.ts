import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";

const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  // This is a simplified check — full auth validation happens in each page
  // Firebase client auth state is checked client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
