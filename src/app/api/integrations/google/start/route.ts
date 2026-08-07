import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getGoogleAuthUrl } from "@/lib/integrations/google";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  const url = getGoogleAuthUrl(user.id);
  return NextResponse.redirect(url);
}
