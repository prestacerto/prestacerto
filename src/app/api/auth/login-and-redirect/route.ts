export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      return Response.json(
        { error: data.error_description || "Login falhou" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      access_token: data.access_token,
      user: data.user,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Erro no servidor" },
      { status: 500 }
    );
  }
}
