import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Validar state
  const storedState = request.cookies.get("linkedin_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.json({ error: "State mismatch" }, { status: 400 });
  }

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`);
  }

  try {
    // Trocar código por token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error("No access token");
    }

    // Buscar dados do usuário
    const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    // Buscar email
    const emailResponse = await fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const emailData = await emailResponse.json();
    const email = emailData.elements?.[0]?.["handle~"]?.emailAddress;

    if (!email) {
      throw new Error("No email from LinkedIn");
    }

    // Procurar ou criar usuário
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Atualizar perfil com dados do LinkedIn
      await supabase
        .from("profiles")
        .update({
          full_name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          avatar_url: profile.profilePicture?.displayImage,
          linkedin_id: profile.id,
        })
        .eq("id", userId);
    } else {
      // Criar novo usuário
      const { data: newUser } = await supabase
        .from("profiles")
        .insert({
          email,
          full_name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          avatar_url: profile.profilePicture?.displayImage,
          role: "freelancer",
          linkedin_id: profile.id,
        })
        .select("id")
        .single();

      if (!newUser) throw new Error("Failed to create user");
      userId = newUser.id;
    }

    // Redirecionar pra dashboard com sessão
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    response.cookies.set("linkedin_user_id", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("LinkedIn auth error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`);
  }
}
