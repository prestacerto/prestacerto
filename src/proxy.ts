import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export function proxy(request: NextRequest) {
  const publicHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.hostname).toLowerCase().replace(/:\d+$/, "");
  // Redirect navigation only; preserve session handling for form and webhook submissions.
  if ((request.method === "GET" || request.method === "HEAD") && publicHost === "www.prestacerto.com.br") {
    const canonical = request.nextUrl.clone();
    canonical.hostname = "prestacerto.com.br";
    canonical.protocol = "https:";
    canonical.port = "";
    return NextResponse.redirect(canonical, 308);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    /*
     * Roda em todo request pra manter o cookie de sessão do Supabase
     * atualizado, exceto assets estáticos.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
