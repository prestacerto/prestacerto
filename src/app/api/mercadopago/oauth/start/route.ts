import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMpAuthorizationUrl } from "@/lib/payments/mercadopago";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?redirect=/dashboard`
    );
  }

  const state = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("mp_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return NextResponse.redirect(getMpAuthorizationUrl(state));
}
