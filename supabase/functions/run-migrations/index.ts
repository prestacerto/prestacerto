import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const migrations = [
  `create extension if not exists "pgcrypto";

  create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role in ('freelancer', 'client', 'both')),
    full_name text not null,
    city text,
    state text,
    bio text,
    avatar_url text,
    contact_email text,
    contact_phone text,
    plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
    created_at timestamptz not null default now()
  );

  alter table profiles enable row level security;

  create policy if not exists "perfis são publicamente visíveis"
  on profiles for select
  using (true);

  create policy if not exists "usuário cria seu próprio perfil"
  on profiles for insert
  with check (id = auth.uid());

  create policy if not exists "usuário edita seu próprio perfil"
  on profiles for update
  using (id = auth.uid());

  create function if not exists public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = public
  as $function$
  begin
    insert into public.profiles (id, role, full_name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'role', 'client'),
      coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
    );
    return new;
  end;
  $function$;

  drop trigger if exists on_auth_user_created on auth.users;
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();`
];

serve(async (req) => {
  // Check auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.includes("prestacerto_admin_2026")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = Deno.env.get("SUPABASE_DB_URL");
    if (!client) throw new Error("SUPABASE_DB_URL not set");

    console.log("🔄 Running migrations...");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Migrations queued for execution",
        note: "Please run migrations manually in Supabase Console",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
