import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  let response: NextResponse = NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
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
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.session) {
    return NextResponse.json({ error: "No session returned" }, { status: 400 });
  }

  // Return success with session data
  response = NextResponse.json(
    {
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    },
    { status: 200 }
  );

  // Cookies are already set via the setAll callback above
  return response;
}
