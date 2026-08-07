import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas de admin
  if (pathname.startsWith("/admin")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            const response = NextResponse.next();
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
            return response;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Se não tá logado, redireciona pra login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Se tá logado, deixa passar (TODO: verificar se é admin)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
