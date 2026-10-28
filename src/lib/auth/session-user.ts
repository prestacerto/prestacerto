import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function getSessionUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
}
