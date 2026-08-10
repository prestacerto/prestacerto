import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== "Bearer admin-setup-key-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log("🔄 Executando setup de banco...\n");

    // Create profiles table
    const { error: profilesError } = await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          role text NOT NULL CHECK (role IN ('freelancer', 'client', 'both')),
          full_name text NOT NULL,
          city text,
          state text,
          bio text,
          avatar_url text,
          contact_email text,
          contact_phone text,
          plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
          created_at timestamptz NOT NULL DEFAULT now()
        );

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "perfis são publicamente visíveis"
          ON public.profiles FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "usuário cria seu próprio perfil"
          ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

        CREATE POLICY IF NOT EXISTS "usuário edita seu próprio perfil"
          ON public.profiles FOR UPDATE USING (id = auth.uid());

        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        BEGIN
          INSERT INTO public.profiles (id, role, full_name)
          VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data ->> 'role', 'client'),
            COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
          )
          ON CONFLICT DO NOTHING;
          RETURN new;
        END;
        $$;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
      `.trim(),
    });

    if (profilesError) {
      console.log("Note: RPC might not exist or tables already created");
      console.log("Error:", profilesError.message);
    }

    // Try direct insert to verify table exists
    const { data, error: checkError } = await supabase
      .from("profiles")
      .select("COUNT(*)", { count: "exact" })
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        {
          success: false,
          error: "Table still doesn't exist. Manual setup required via Supabase Console.",
          details: checkError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Database setup complete! Login should work now.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: err },
      { status: 500 }
    );
  }
}
