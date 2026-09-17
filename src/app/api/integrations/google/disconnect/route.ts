import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { disconnectGoogle } from "@/lib/integrations/google";

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await disconnectGoogle(user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Google disconnect falhou:", err);
    return NextResponse.json({ error: "Falha ao desconectar" }, { status: 500 });
  }
}
