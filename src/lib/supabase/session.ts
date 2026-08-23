import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Add security headers
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
  supabaseResponse.headers.set("X-Frame-Options", "DENY");
  supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
  supabaseResponse.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  supabaseResponse.headers.set(
    "Content-Security-Policy",
    "default-src 'self' https://taktwwwpcyxhyylzmgho.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; connect-src 'self' https://taktwwwpcyxhyylzmgho.supabase.co https://www.googletagmanager.com https://connect.facebook.net;"
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
          supabaseResponse.headers.set("X-Frame-Options", "DENY");
          supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
          supabaseResponse.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains"
          );
          supabaseResponse.headers.set(
            "Content-Security-Policy",
            "default-src 'self' https://taktwwwpcyxhyylzmgho.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; connect-src 'self' https://taktwwwpcyxhyylzmgho.supabase.co https://www.googletagmanager.com https://connect.facebook.net;"
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // Fallback: check for auth token directly
    const token = request.cookies.get("sb-token")?.value ||
                  request.cookies.get("sb-access-token")?.value ||
                  (request.headers.get("authorization")?.replace("Bearer ", ""));

    if (token) {
      try {
        // Verify token with Supabase
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
          }
        );
        if (response.ok) {
          user = await response.json();
        }
      } catch (err) {
        console.error("proxy: fallback token validation failed:", err);
      }
    }
  }

  const isProtected = request.nextUrl.pathname.startsWith(PROTECTED_PREFIX);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
