import { type NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCode } from "@/lib/integrations/google";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId
  const error = searchParams.get("error");

  const redirectBase = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations`;

  if (error || !code || !state) {
    return NextResponse.redirect(`${redirectBase}?google=error`);
  }

  try {
    await exchangeGoogleCode(code, state);
    return NextResponse.redirect(`${redirectBase}?google=connected`);
  } catch (err) {
    console.error("Google OAuth callback falhou:", err);
    return NextResponse.redirect(`${redirectBase}?google=error`);
  }
}
