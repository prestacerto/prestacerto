import { type NextRequest, NextResponse } from "next/server";
import { createPublicClient } from '@/lib/supabase/public';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { createHash } from "node:crypto";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "invalid_profile" }, { status: 400 });
  if (req.headers.get('origin') && req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({ recorded: false }, { status: 403 });
  const user = await getAuthenticatedUser();
  if (user?.id === id) return NextResponse.json({ recorded: false, reason: 'own_profile' });
  const visitor = req.cookies.get('pc_profile_visitor')?.value || crypto.randomUUID();
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  // The database stores a daily opaque identifier, never an IP address.
  const visitorDayHash = createHash('sha256').update(`${visitor}:${id}:${day}`).digest('hex').slice(0, 32);
  const db = createPublicClient();
  const { error } = await db.from("profile_views").insert({
    freelancer_id: id,
    viewer_ip_hash: visitorDayHash,
  });
  if (error && error.code !== '23505') return NextResponse.json({ recorded: false, reason: 'tracking_unavailable' }, { status: 503 });
  const response = NextResponse.json({ recorded: !error, duplicate: error?.code === '23505' });
  if (!req.cookies.has('pc_profile_visitor')) response.cookies.set('pc_profile_visitor', visitor, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 31536000, path: '/' });
  return response;
}
