import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/dashboard";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: getUser() revalida a sessão contra o servidor de auth do
  // Supabase a cada chamada. getSession() sozinho só leria o cookie local,
  // que pode estar presente mesmo com uma sessão já revogada/expirada — foi
  // exatamente esse tipo de checagem "de mentirinha" que deixou /dashboard e
  // /financial públicos no protótipo anterior.
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // Falha de rede/config do Supabase: trata como não-autenticado. Em rota
    // protegida isso resulta em redirect pro login (seguro por padrão); em
    // rota pública o request segue normalmente.
    console.error("proxy: falha ao verificar sessão:", error);
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
