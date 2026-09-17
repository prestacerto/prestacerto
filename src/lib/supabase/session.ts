import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { getGoogleAdsId } from "@/lib/google-ads";

const PROTECTED_PREFIX = "/dashboard";
const FREELANCER_ONLY_DASHBOARD_PATHS = [
  "/dashboard/match",
  "/dashboard/pricing",
  "/dashboard/timing",
  "/dashboard/portfolio",
  "/dashboard/referral",
  "/dashboard/integrations",
  "/dashboard/certo-curriculo",
];

// GA collection endpoints: https://developers.google.com/tag-platform/security/guides/csp#google_analytics
function applySecurityHeaders(response: NextResponse) {
  // Only enable Ads origins when an actual AW tag is configured. Country
  // endpoints are explicit for the platform's Brazilian audience.
  const adsEnabled = Boolean(getGoogleAdsId());
  const adsScripts = adsEnabled ? ' https://www.googleadservices.com https://www.google.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net' : '';
  const adsConnections = adsEnabled ? ' https://pagead2.googlesyndication.com https://www.google.com https://www.google.com.br https://www.googleadservices.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://google.com https://google.com.br' : '';
  const adsImages = adsEnabled ? ' https://googleads.g.doubleclick.net https://www.google.com https://www.google.com.br https://pagead2.googlesyndication.com https://www.googleadservices.com https://google.com https://google.com.br' : '';
  const adsFrames = adsEnabled ? ' frame-src https://www.googletagmanager.com;' : '';
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self' ${SUPABASE_URL}; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app https://www.googletagmanager.com https://connect.facebook.net https://analytics.tiktok.com https://snap.licdn.com${adsScripts}; style-src 'self' 'unsafe-inline'; connect-src 'self' ${SUPABASE_URL} ${SUPABASE_URL.replace("https:", "wss:")} https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://connect.facebook.net https://www.facebook.com https://analytics.tiktok.com https://px.ads.linkedin.com https://www.linkedin.com${adsConnections}; img-src 'self' data: blob: ${SUPABASE_URL} https://images.unsplash.com https://cdn.prestacerto.com https://lh3.googleusercontent.com https://www.facebook.com https://px.ads.linkedin.com https://*.google-analytics.com https://www.googletagmanager.com${adsImages};${adsFrames}`,
  );
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = applySecurityHeaders(NextResponse.next({ request }));
  const isProtected = request.nextUrl.pathname.startsWith(PROTECTED_PREFIX);

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = applySecurityHeaders(NextResponse.next({ request }));
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  let user: { id: string; user_metadata?: Record<string, unknown> } | null = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.error("proxy: validação de sessão falhou:", error);
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    const response = applySecurityHeaders(NextResponse.redirect(url));
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  }

  // Clientes usam uma experiência de contratação. Recursos que ajudam o
  // prestador a se posicionar ficam fora dessa jornada; a checagem de rota
  // complementa a navegação condicional e não substitui as políticas RLS.
  if (user && FREELANCER_ONLY_DASHBOARD_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const metadataRole = typeof user.user_metadata?.role === "string" ? user.user_metadata.role : undefined;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const role = profile?.role ?? metadataRole;

    if (role === "client") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("notice", "client-area");
      const response = applySecurityHeaders(NextResponse.redirect(url));
      supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
      return response;
    }
  }

  return supabaseResponse;
}
